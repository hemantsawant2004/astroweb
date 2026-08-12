import jwt from 'jsonwebtoken'
import { pool } from './config/db.js'

const activeTimers = new Map() // sessionId -> interval handle

function room(sessionId) {
  return `session:${sessionId}`
}

async function chargeOneMinute(io, sessionId) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [[session]] = await conn.query(
      `SELECT cs.*, a.chat_rate_paise_per_min AS rate FROM chat_sessions cs
       JOIN astrologers a ON a.id = cs.astrologer_id WHERE cs.id = ? AND cs.status = 'active' FOR UPDATE`,
      [sessionId]
    )
    if (!session) {
      await conn.rollback()
      return { ended: true }
    }
    const [[user]] = await conn.query('SELECT wallet_balance_paise FROM users WHERE id = ? FOR UPDATE', [session.user_id])
    if (user.wallet_balance_paise < session.rate) {
      await conn.query(
        `UPDATE chat_sessions SET status = 'ended', ended_at = NOW() WHERE id = ?`,
        [sessionId]
      )
      await conn.commit()
      return { ended: true, reason: 'insufficient_balance' }
    }
    const newBalance = user.wallet_balance_paise - session.rate
    await conn.query('UPDATE users SET wallet_balance_paise = ? WHERE id = ?', [newBalance, session.user_id])
    await conn.query(
      `INSERT INTO wallet_transactions (user_id, type, amount_paise, chat_session_id, balance_after_paise)
       VALUES (?, 'debit', ?, ?, ?)`,
      [session.user_id, session.rate, sessionId, newBalance]
    )
    await conn.query(
      `UPDATE chat_sessions SET minutes_used = minutes_used + 1, amount_charged_paise = amount_charged_paise + ? WHERE id = ?`,
      [session.rate, sessionId]
    )
    await conn.commit()
    io.of('/chat').to(room(sessionId)).emit('wallet:update', { balancePaise: newBalance })
    return { ended: false, balancePaise: newBalance }
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

function stopTimer(sessionId) {
  const handle = activeTimers.get(sessionId)
  if (handle) {
    clearInterval(handle)
    activeTimers.delete(sessionId)
  }
}

async function endSession(io, sessionId, reason = 'ended') {
  stopTimer(sessionId)
  await pool.query(`UPDATE chat_sessions SET status = 'ended', ended_at = NOW() WHERE id = ? AND status = 'active'`, [sessionId])
  io.of('/chat').to(room(sessionId)).emit('chat:ended', { reason })
}

export function setupChatNamespace(io) {
  const chatNs = io.of('/chat')

  chatNs.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) return next(new Error('Missing token'))
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      if (!['user', 'admin'].includes(payload.role)) return next(new Error('Unauthorized'))
      socket.data.auth = payload
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  chatNs.on('connection', (socket) => {
    const { auth } = socket.data

    socket.on('join', async ({ sessionId, astrologerId }, ack) => {
      try {
        if (auth.role === 'user') {
          if (sessionId) {
            const [[existing]] = await pool.query('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?', [sessionId, auth.id])
            if (!existing) return ack?.({ error: 'Session not found' })
            socket.join(room(sessionId))
            return ack?.({ sessionId })
          }
          const [[astrologer]] = await pool.query('SELECT * FROM astrologers WHERE id = ?', [astrologerId])
          if (!astrologer) return ack?.({ error: 'Astrologer not found' })
          const [[user]] = await pool.query('SELECT wallet_balance_paise FROM users WHERE id = ?', [auth.id])
          if (user.wallet_balance_paise < astrologer.chat_rate_paise_per_min) {
            return ack?.({ error: 'Insufficient wallet balance to start chat. Please top up first.' })
          }
          const [result] = await pool.query(
            'INSERT INTO chat_sessions (user_id, astrologer_id) VALUES (?, ?)',
            [auth.id, astrologerId]
          )
          const newSessionId = result.insertId
          socket.join(room(newSessionId))
          const { balancePaise } = await chargeOneMinute(io, newSessionId)
          const timer = setInterval(() => {
            chargeOneMinute(io, newSessionId).then((result) => {
              if (result.ended) endSession(io, newSessionId, result.reason)
            })
          }, 60000)
          activeTimers.set(newSessionId, timer)
          return ack?.({ sessionId: newSessionId, ratePerMinPaise: astrologer.chat_rate_paise_per_min, balancePaise })
        }

        // admin/astrologer side: must join an existing session
        if (!sessionId) return ack?.({ error: 'sessionId is required' })
        socket.join(room(sessionId))
        return ack?.({ sessionId })
      } catch (err) {
        ack?.({ error: err.message })
      }
    })

    socket.on('message', async ({ sessionId, message }, ack) => {
      if (!sessionId || !message?.trim()) return ack?.({ error: 'sessionId and message are required' })
      const sender = auth.role === 'admin' ? 'astrologer' : 'user'
      try {
        await pool.query('INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)', [
          sessionId,
          sender,
          message.trim(),
        ])
        chatNs.to(room(sessionId)).emit('message', { sender, message: message.trim(), createdAt: new Date().toISOString() })
        ack?.({ ok: true })
      } catch (err) {
        ack?.({ error: err.message })
      }
    })

    socket.on('history', async ({ sessionId }, ack) => {
      const [rows] = await pool.query('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at', [sessionId])
      ack?.(rows)
    })

    socket.on('end', async ({ sessionId }) => {
      await endSession(io, sessionId, 'ended_by_user')
    })
  })
}
