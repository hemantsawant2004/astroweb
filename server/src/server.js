import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes from './routes/auth.js'
import adminAuthRoutes from './routes/adminAuth.js'
import contentRoutes from './routes/content.js'
import leadsRoutes from './routes/leads.js'
import bookingsRoutes from './routes/bookings.js'
import paymentsRoutes from './routes/payments.js'
import walletRoutes from './routes/wallet.js'
import adminRoutes from './routes/admin.js'
import { requireAdmin } from './middleware/auth.js'
import { setupChatNamespace } from './chat.js'

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
app.use('/api/wallet', walletRoutes)
app.use('/api/admin', requireAdmin, adminRoutes)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173' },
})
setupChatNamespace(io)

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`MyAstroReader API listening on port ${PORT}`)
})
