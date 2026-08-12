import { Router } from 'express'
import { pool } from '../config/db.js'
import { optionalUser } from '../middleware/auth.js'

const router = Router()

router.post('/', optionalUser, async (req, res) => {
  const { packageId, name, email, phone, birthDate, birthTime, birthPlace, preferredDatetime } = req.body || {}
  if (!packageId || !name || !email || !phone) {
    return res.status(400).json({ error: 'packageId, name, email and phone are required' })
  }
  try {
    const [pkgRows] = await pool.query('SELECT id FROM packages WHERE id = ? AND is_active = TRUE', [packageId])
    if (!pkgRows[0]) return res.status(404).json({ error: 'Package not found' })

    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, package_id, name, email, phone, birth_date, birth_time, birth_place, preferred_datetime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user?.id || null,
        packageId,
        name,
        email,
        phone,
        birthDate || null,
        birthTime || null,
        birthPlace || null,
        preferredDatetime || null,
      ]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: 'Could not create booking', detail: err.message })
  }
})

router.get('/:id', optionalUser, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, p.name AS package_name, p.price_paise, p.duration_min
     FROM bookings b JOIN packages p ON p.id = b.package_id WHERE b.id = ?`,
    [req.params.id]
  )
  if (!rows[0]) return res.status(404).json({ error: 'Booking not found' })
  res.json(rows[0])
})

export default router
