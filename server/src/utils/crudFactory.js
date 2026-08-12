import { Router } from 'express'
import { pool } from '../config/db.js'

// Generic CRUD router for simple admin-managed content tables (testimonials, faqs,
// horoscopes, blog_posts, packages, astrologers). `columns` is the whitelist of fields
// accepted on create/update -- callers must not pass arbitrary column names from the client.
export function crudFactory({ table, columns, orderBy = 'id' }) {
  const router = Router()

  router.get('/', async (_req, res) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`)
    res.json(rows)
  })

  router.get('/:id', async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  })

  router.post('/', async (req, res) => {
    const entries = columns.filter((c) => req.body?.[c] !== undefined)
    if (!entries.length) return res.status(400).json({ error: 'No valid fields provided' })
    const values = entries.map((c) => req.body[c])
    try {
      const [result] = await pool.query(
        `INSERT INTO ${table} (${entries.join(', ')}) VALUES (${entries.map(() => '?').join(', ')})`,
        values
      )
      res.status(201).json({ id: result.insertId })
    } catch (err) {
      res.status(500).json({ error: 'Create failed', detail: err.message })
    }
  })

  router.patch('/:id', async (req, res) => {
    const entries = columns.filter((c) => req.body?.[c] !== undefined)
    if (!entries.length) return res.status(400).json({ error: 'No valid fields provided' })
    const values = entries.map((c) => req.body[c])
    try {
      await pool.query(
        `UPDATE ${table} SET ${entries.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
        [...values, req.params.id]
      )
      res.json({ ok: true })
    } catch (err) {
      res.status(500).json({ error: 'Update failed', detail: err.message })
    }
  })

  router.delete('/:id', async (req, res) => {
    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id])
    res.json({ ok: true })
  })

  return router
}
