import { Router } from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import { pool } from '../config/db.js'
import { optionalUser } from '../middleware/auth.js'

const router = Router()

function getRazorpay() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env
  if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes('your_key_id')) {
    return null
  }
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
}

// purpose: 'booking' (amountPaise derived from the booking's package) or
// 'wallet_topup' (amountPaise supplied by the logged-in user, min Rs 100).
router.post('/create-order', optionalUser, async (req, res) => {
  const razorpay = getRazorpay()
  if (!razorpay) {
    return res.status(503).json({
      error: 'Payments are not configured yet. Add real Razorpay test keys to server/.env (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) to enable checkout.',
    })
  }

  const { purpose, bookingId, amountPaise } = req.body || {}
  try {
    let amount
    if (purpose === 'booking') {
      const [rows] = await pool.query(
        `SELECT b.id, p.price_paise FROM bookings b JOIN packages p ON p.id = b.package_id WHERE b.id = ?`,
        [bookingId]
      )
      if (!rows[0]) return res.status(404).json({ error: 'Booking not found' })
      amount = rows[0].price_paise
    } else if (purpose === 'wallet_topup') {
      if (!req.user) return res.status(401).json({ error: 'Login required to top up wallet' })
      if (!amountPaise || amountPaise < 10000) {
        return res.status(400).json({ error: 'Minimum top-up is Rs 100' })
      }
      amount = amountPaise
    } else {
      return res.status(400).json({ error: 'purpose must be "booking" or "wallet_topup"' })
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `${purpose}_${bookingId || req.user.id}_${Date.now()}`,
    })
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID })
  } catch (err) {
    res.status(500).json({ error: 'Could not create payment order', detail: err.message })
  }
})

router.post('/verify', optionalUser, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purpose, bookingId, amountPaise } = req.body || {}
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' })
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment signature verification failed' })
  }

  try {
    if (purpose === 'booking') {
      await pool.query(
        `UPDATE bookings SET payment_status = 'paid', status = 'confirmed',
         razorpay_order_id = ?, razorpay_payment_id = ? WHERE id = ?`,
        [razorpay_order_id, razorpay_payment_id, bookingId]
      )
    } else if (purpose === 'wallet_topup') {
      if (!req.user) return res.status(401).json({ error: 'Login required' })
      const conn = await pool.getConnection()
      try {
        await conn.beginTransaction()
        const [[user]] = await conn.query('SELECT wallet_balance_paise FROM users WHERE id = ? FOR UPDATE', [req.user.id])
        const newBalance = user.wallet_balance_paise + amountPaise
        await conn.query('UPDATE users SET wallet_balance_paise = ? WHERE id = ?', [newBalance, req.user.id])
        await conn.query(
          `INSERT INTO wallet_transactions (user_id, type, amount_paise, razorpay_payment_id, balance_after_paise)
           VALUES (?, 'credit', ?, ?, ?)`,
          [req.user.id, amountPaise, razorpay_payment_id, newBalance]
        )
        await conn.commit()
      } catch (err) {
        await conn.rollback()
        throw err
      } finally {
        conn.release()
      }
    } else {
      return res.status(400).json({ error: 'purpose must be "booking" or "wallet_topup"' })
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Could not finalize payment', detail: err.message })
  }
})

export default router
