import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireUser } from '../middleware/auth.js'

const router = Router()

router.get('/', requireUser, async (req, res) => {
  const [[user]] = await pool.query('SELECT wallet_balance_paise FROM users WHERE id = ?', [req.user.id])
  const [transactions] = await pool.query(
    'SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [req.user.id]
  )
  res.json({ balancePaise: user?.wallet_balance_paise ?? 0, transactions })
})

router.get('/bookings', requireUser, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, p.name AS package_name, p.price_paise FROM bookings b
     JOIN packages p ON p.id = b.package_id WHERE b.user_id = ? ORDER BY b.created_at DESC`,
    [req.user.id]
  )
  res.json(rows)
})

router.get('/chart-requests', requireUser, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM chart_requests WHERE user_id = ? ORDER BY created_at DESC', [
    req.user.id,
  ])
  res.json(rows)
})

export default router
