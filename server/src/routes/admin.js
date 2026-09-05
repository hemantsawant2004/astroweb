import { Router } from 'express'
import { pool } from '../config/db.js'
import { crudFactory } from '../utils/crudFactory.js'

const router = Router()

router.use(
  '/testimonials',
  crudFactory({ table: 'testimonials', columns: ['name', 'location', 'quote', 'rating', 'is_featured', 'sort_order'], orderBy: 'sort_order' })
)
router.use('/faqs', crudFactory({ table: 'faqs', columns: ['question', 'answer', 'sort_order'], orderBy: 'sort_order' }))
router.use(
  '/horoscopes',
  crudFactory({
    table: 'horoscopes',
    columns: ['zodiac_sign', 'period', 'love_text', 'career_text', 'finance_text', 'health_text', 'travel_text', 'remedies_text'],
  })
)
router.use(
  '/blog',
  crudFactory({ table: 'blog_posts', columns: ['title', 'slug', 'excerpt', 'content', 'cover_image_url', 'published_at'], orderBy: 'published_at DESC' })
)
router.use(
  '/packages',
  crudFactory({
    table: 'packages',
    columns: ['astrologer_id', 'name', 'slug', 'description', 'price_paise', 'duration_min', 'sort_order', 'is_active'],
    orderBy: 'sort_order',
  })
)
router.use(
  '/astrologers',
  crudFactory({
    table: 'astrologers',
    columns: ['name', 'slug', 'tagline', 'bio', 'specializations', 'experience_years', 'languages', 'avatar_initials', 'is_online'],
  })
)

// Leads / bookings: list + status update only (no free-form create/delete from admin side).
router.get('/bookings', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, p.name AS package_name FROM bookings b JOIN packages p ON p.id = b.package_id ORDER BY b.created_at DESC`
  )
  res.json(rows)
})
router.patch('/bookings/:id', async (req, res) => {
  const { status } = req.body || {}
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id])
  res.json({ ok: true })
})

router.get('/chart-requests', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM chart_requests ORDER BY created_at DESC')
  res.json(rows)
})
router.patch('/chart-requests/:id', async (req, res) => {
  const { status } = req.body || {}
  if (!['new', 'reviewed', 'contacted', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  await pool.query('UPDATE chart_requests SET status = ? WHERE id = ?', [status, req.params.id])
  res.json({ ok: true })
})

router.get('/enquiries', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC')
  res.json(rows)
})

export default router
