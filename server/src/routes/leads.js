import { Router } from 'express'
import { pool } from '../config/db.js'
import { optionalUser } from '../middleware/auth.js'

const router = Router()

router.post('/chart-requests', optionalUser, async (req, res) => {
  const { type, name, email, phone, dob, tob, pob, gender, partnerDetails } = req.body || {}
  if (!type || !name || !phone || !dob || !pob) {
    return res.status(400).json({ error: 'type, name, phone, dob and pob are required' })
  }
  if (!['kundli', 'kundli_matching', 'numerology'].includes(type)) {
    return res.status(400).json({ error: 'Invalid request type' })
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO chart_requests (user_id, type, name, email, phone, dob, tob, pob, gender, partner_details)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user?.id || null,
        type,
        name,
        email || null,
        phone,
        dob,
        tob || null,
        pob,
        gender || null,
        partnerDetails ? JSON.stringify(partnerDetails) : null,
      ]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: 'Could not submit request', detail: err.message })
  }
})

router.post('/callback-requests', optionalUser, async (req, res) => {
  const { astrologerId, name, phone, preferredTime } = req.body || {}
  if (!astrologerId || !name || !phone) {
    return res.status(400).json({ error: 'astrologerId, name and phone are required' })
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO callback_requests (user_id, astrologer_id, name, phone, preferred_time)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user?.id || null, astrologerId, name, phone, preferredTime || null]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: 'Could not submit callback request', detail: err.message })
  }
})

router.post('/enquiries', async (req, res) => {
  const { name, email, phone, message } = req.body || {}
  if (!name || !message) return res.status(400).json({ error: 'name and message are required' })
  try {
    const [result] = await pool.query(
      'INSERT INTO enquiries (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email || null, phone || null, message]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: 'Could not submit enquiry', detail: err.message })
  }
})

export default router
