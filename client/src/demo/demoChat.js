// Scripted stand-in for the real Socket.io chat connection, used only in the demo
// build (no real server is reachable from a double-clicked HTML file). Mimics just
// enough of the socket.io-client interface (on/emit/disconnect) that Chat.jsx needs
// no branching logic beyond choosing which implementation to construct.
import { getDemoUser, debitDemoWallet } from './mockApi'

const REPLIES = [
  "Thanks for sharing that. Could you confirm your exact time of birth so I can check this against your chart?",
  "That lines up with what I'm seeing in your chart around this period.",
  "I'd want to look at the relevant transit before saying more definitively -- can we cover this in a full session?",
  "That's a fair question. Based on the placements here, the pattern does show up around that time frame.",
  "Noted. I don't prescribe remedies, but I can walk you through what the chart is indicating.",
]

// Sped up vs. the real per-minute billing cadence so wallet metering is visible
// within a short demo walkthrough instead of requiring a full 60 seconds per tick.
const DEMO_TICK_MS = 12000

export function createDemoChatSocket() {
  const listeners = {}
  let timer = null
  let replyIndex = 0

  function on(event, cb) {
    listeners[event] = listeners[event] || []
    listeners[event].push(cb)
  }
  function emitLocal(event, payload) {
    ;(listeners[event] || []).forEach((cb) => cb(payload))
  }

  function stopTimer() {
    if (timer) clearInterval(timer)
    timer = null
  }

  function emit(event, payload, ack) {
    if (event === 'join') {
      const user = getDemoUser()
      const rate = 20000 // paise/min, matches Amit Joshi's seeded chat rate
      if (!user || user.wallet_balance_paise < rate) {
        ack?.({ error: 'Insufficient wallet balance to start chat. Please top up first.' })
        return
      }
      const balancePaise = debitDemoWallet(rate)
      ack?.({ sessionId: 'demo-session', ratePerMinPaise: rate, balancePaise })

      timer = setInterval(() => {
        const current = getDemoUser()
        if (!current || current.wallet_balance_paise < rate) {
          stopTimer()
          emitLocal('chat:ended', { reason: 'insufficient_balance' })
          return
        }
        const newBalance = debitDemoWallet(rate)
        emitLocal('wallet:update', { balancePaise: newBalance })
      }, DEMO_TICK_MS)
      return
    }

    if (event === 'message') {
      ack?.({ ok: true })
      emitLocal('message', { sender: 'user', message: payload.message, createdAt: new Date().toISOString() })
      setTimeout(() => {
        emitLocal('message', {
          sender: 'astrologer',
          message: REPLIES[replyIndex % REPLIES.length],
          createdAt: new Date().toISOString(),
        })
        replyIndex += 1
      }, 1200 + Math.random() * 900)
      return
    }

    if (event === 'end') {
      stopTimer()
      emitLocal('chat:ended', { reason: 'ended_by_user' })
      return
    }
  }

  function disconnect() {
    stopTimer()
  }

  return { on, emit, disconnect }
}
