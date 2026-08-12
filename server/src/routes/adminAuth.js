import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const router = Router()

function safeCompare(a, b) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

router.post('/login', (req, res) => {
  const { password } = req.body || {}
  if (!password || !safeCompare(String(password), process.env.ADMIN_PASSWORD || '')) {
    return res.status(401).json({ error: 'Incorrect password' })
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' })
  res.json({ token })
})

export default router
