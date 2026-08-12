import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatPaise } from '../utils/money'
import { isDemoMode } from '../demo/mockApi'
import { createDemoChatSocket } from '../demo/demoChat'

export default function Chat() {
  const { user, ready } = useAuth()
  const [astrologer, setAstrologer] = useState(null)
  const [socket, setSocket] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [balancePaise, setBalancePaise] = useState(null)
  const [draft, setDraft] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [ended, setEnded] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    api.get('/astrologers/amit-joshi').then((r) => setAstrologer(r.data))
  }, [])

  useEffect(() => {
    return () => socket?.disconnect()
  }, [socket])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  function startChat() {
    if (!astrologer) return
    setStatusMsg('Connecting…')

    if (isDemoMode()) {
      const s = createDemoChatSocket()
      s.emit('join', { astrologerId: astrologer.id }, (res) => {
        if (res.error) {
          setStatusMsg(res.error)
          return
        }
        setSessionId(res.sessionId)
        setBalancePaise(res.balancePaise)
        setStatusMsg('')
      })
      s.on('message', (msg) => setMessages((m) => [...m, msg]))
      s.on('wallet:update', ({ balancePaise }) => setBalancePaise(balancePaise))
      s.on('chat:ended', ({ reason }) => {
        setEnded(true)
        setStatusMsg(reason === 'insufficient_balance' ? 'Chat ended — wallet balance ran out.' : 'Chat ended.')
      })
      setSocket(s)
      return
    }

    const token = localStorage.getItem('myastroreader_token')
    const s = io('/chat', { path: '/socket.io', auth: { token } })

    s.on('connect', () => {
      s.emit('join', { astrologerId: astrologer.id }, (res) => {
        if (res.error) {
          setStatusMsg(res.error)
          s.disconnect()
          return
        }
        setSessionId(res.sessionId)
        setBalancePaise(res.balancePaise)
        setStatusMsg('')
      })
    })

    s.on('message', (msg) => setMessages((m) => [...m, msg]))
    s.on('wallet:update', ({ balancePaise }) => setBalancePaise(balancePaise))
    s.on('chat:ended', ({ reason }) => {
      setEnded(true)
      setStatusMsg(reason === 'insufficient_balance' ? 'Chat ended — wallet balance ran out.' : 'Chat ended.')
    })

    setSocket(s)
  }

  function sendMessage(e) {
    e.preventDefault()
    if (!draft.trim() || !socket || !sessionId) return
    socket.emit('message', { sessionId, message: draft }, (res) => {
      if (res?.error) setStatusMsg(res.error)
    })
    setDraft('')
  }

  function endChat() {
    socket?.emit('end', { sessionId })
  }

  if (!ready) return null

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gold-300">Log in to chat</h1>
        <p className="mt-3 text-ink-soft">Live chat is metered from your wallet, so you&apos;ll need an account.</p>
        <Link to="/login" className="gradient-cta mt-6 inline-block rounded-full px-6 py-2 font-bold text-black">
          Log In
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-10" style={{ minHeight: '70vh' }}>
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-gold-500/20 bg-surface px-5 py-4">
        <div>
          <h1 className="font-bold text-gold-300">{astrologer?.name || 'Astrologer'}</h1>
          <p className="text-xs text-ink-soft">
            {sessionId ? `Rate: ${formatPaise(astrologer.chat_rate_paise_per_min)}/min` : astrologer?.tagline}
          </p>
        </div>
        {balancePaise !== null && (
          <div className="text-right text-sm">
            <div className="font-semibold text-gold-400">{formatPaise(balancePaise)}</div>
            <div className="text-xs text-ink-soft">{isDemoMode() ? 'wallet balance (demo billing, sped up)' : 'wallet balance'}</div>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto border-x border-gold-500/20 bg-cream p-5" style={{ minHeight: 320 }}>
        {!sessionId && !ended && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-ink-soft">Start a live chat session with {astrologer?.name}.</p>
            <button
              onClick={startChat}
              disabled={!astrologer}
              className="gradient-cta rounded-full px-6 py-2 font-bold text-black shadow disabled:opacity-60"
            >
              {astrologer ? 'Start Chat' : 'Loading…'}
            </button>
            {statusMsg && <p className="text-sm text-red-400">{statusMsg}</p>}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                m.sender === 'user' ? 'gradient-cta text-black' : 'bg-surface text-ink shadow'
              }`}
            >
              {m.message}
            </div>
          </div>
        ))}
        {ended && <p className="text-center text-sm text-ink-soft">{statusMsg}</p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 rounded-b-2xl border border-t-0 border-gold-500/20 bg-surface p-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={!sessionId || ended}
          placeholder={sessionId ? 'Type a message…' : 'Start the chat to send messages'}
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={!sessionId || ended}
          className="gradient-cta rounded-full px-5 py-2 text-sm font-bold text-black shadow disabled:opacity-60"
        >
          Send
        </button>
        {sessionId && !ended && (
          <button type="button" onClick={endChat} className="rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400">
            End
          </button>
        )}
      </form>
    </div>
  )
}
