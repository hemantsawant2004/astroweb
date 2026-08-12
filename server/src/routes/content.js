import { Router } from 'express'
import { pool } from '../config/db.js'

const router = Router()

router.get('/astrologers', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM astrologers ORDER BY id')
  res.json(rows)
})

router.get('/astrologers/:slug', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM astrologers WHERE slug = ?', [req.params.slug])
  if (!rows[0]) return res.status(404).json({ error: 'Astrologer not found' })
  res.json(rows[0])
})

router.get('/packages', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, a.name AS astrologer_name, a.slug AS astrologer_slug
     FROM packages p JOIN astrologers a ON a.id = p.astrologer_id
     WHERE p.is_active = TRUE ORDER BY p.sort_order`
  )
  res.json(rows)
})

router.get('/packages/:slug', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, a.name AS astrologer_name, a.slug AS astrologer_slug
     FROM packages p JOIN astrologers a ON a.id = p.astrologer_id
     WHERE p.slug = ?`,
    [req.params.slug]
  )
  if (!rows[0]) return res.status(404).json({ error: 'Package not found' })
  res.json(rows[0])
})

router.get('/testimonials', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY sort_order')
  res.json(rows)
})

router.get('/faqs', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM faqs ORDER BY sort_order')
  res.json(rows)
})

router.get('/horoscopes/:sign', async (req, res) => {
  const period = req.query.period || 'daily'
  const [rows] = await pool.query(
    'SELECT * FROM horoscopes WHERE zodiac_sign = ? AND period = ?',
    [req.params.sign, period]
  )
  if (!rows[0]) return res.status(404).json({ error: 'Horoscope not found' })
  res.json(rows[0])
})

router.get('/horoscopes', async (req, res) => {
  const period = req.query.period || 'daily'
  const [rows] = await pool.query('SELECT * FROM horoscopes WHERE period = ? ORDER BY id', [period])
  res.json(rows)
})

router.get('/blog', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, title, slug, excerpt, cover_image_url, published_at FROM blog_posts ORDER BY published_at DESC'
  )
  res.json(rows)
})

router.get('/blog/:slug', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM blog_posts WHERE slug = ?', [req.params.slug])
  if (!rows[0]) return res.status(404).json({ error: 'Post not found' })
  res.json(rows[0])
})

export default router
