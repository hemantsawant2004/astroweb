import { Link } from 'react-router-dom'
import { formatPaise } from '../utils/money'

export default function AstrologerCard({ astrologer }) {
  return (
    <div className="card-gold flex flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center shadow-[0_15px_40px_-15px_rgba(212,175,55,0.3)] border border-gold-500/25 sm:flex-row sm:text-left">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full gradient-cta text-3xl font-bold text-black">
        {astrologer.avatar_initials}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <h3 className="text-xl font-bold text-gold-300">{astrologer.name}</h3>
          {astrologer.is_online ? (
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
              <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
              Online
            </span>
          ) : (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/50">Offline</span>
          )}
        </div>
        <p className="mt-1 text-sm text-ink-soft">{astrologer.tagline}</p>
        <p className="mt-1 text-xs text-ink-soft">{astrologer.specializations}</p>
        <p className="mt-1 text-xs font-semibold text-gold-400">
          Chat: {formatPaise(astrologer.chat_rate_paise_per_min)}/min
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
          <Link to="/chat" className="gradient-cta rounded-full px-5 py-2 text-sm font-bold text-black shadow">
            Chat Now
          </Link>
          <Link
            to="/callback"
            className="rounded-full border border-gold-500 px-5 py-2 text-sm font-bold text-gold-300 hover:bg-gold-500/10"
          >
            Request Callback
          </Link>
        </div>
      </div>
    </div>
  )
}
