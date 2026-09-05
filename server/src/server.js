import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import adminAuthRoutes from './routes/adminAuth.js'
import contentRoutes from './routes/content.js'
import leadsRoutes from './routes/leads.js'
import bookingsRoutes from './routes/bookings.js'
import paymentsRoutes from './routes/payments.js'
import accountRoutes from './routes/account.js'
import adminRoutes from './routes/admin.js'
import { requireAdmin } from './middleware/auth.js'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api', contentRoutes)
app.use('/api', leadsRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/admin', requireAdmin, adminRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`MyAstroReader API listening on port ${PORT}`)
})
