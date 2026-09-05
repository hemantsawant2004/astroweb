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

router.post('/create-order', optionalUser, async (req, res) => {
  const razorpay = getRazorpay()
  if (!razorpay) {
    return res.status(503).json({
      error: 'Payments are not configured yet. Add real Razorpay test keys to server/.env (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) to enable checkout.',
    })
  }

  const { bookingId } = req.body || {}
  try {
    const [rows] = await pool.query(
      `SELECT b.id, p.price_paise FROM bookings b JOIN packages p ON p.id = b.package_id WHERE b.id = ?`,
      [bookingId]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Booking not found' })
    const amount = rows[0].price_paise

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `booking_${bookingId}_${Date.now()}`,
    })
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID })
  } catch (err) {
    res.status(500).json({ error: 'Could not create payment order', detail: err.message })
  }
})

router.post('/verify', optionalUser, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body || {}
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
    await pool.query(
      `UPDATE bookings SET payment_status = 'paid', status = 'confirmed',
       razorpay_order_id = ?, razorpay_payment_id = ? WHERE id = ?`,
      [razorpay_order_id, razorpay_payment_id, bookingId]
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Could not finalize payment', detail: err.message })
  }
})

export default router
