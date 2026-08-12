import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

const router = Router()

function signUserToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: 'user' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) return res.status(409).json({ error: 'An account with this email already exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, phone || null]
    )
    const user = { id: result.insertId, name, email }
    res.status(201).json({ token: signUserToken(user), user: { ...user, phone, wallet_balance_paise: 0 } })
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', detail: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

    res.json({
      token: signUserToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        wallet_balance_paise: user.wallet_balance_paise,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message })
  }
})

export default router
