import { Link } from 'react-router-dom'
import astrologerPhoto from '../assets/amit-joshi.jpg'

export default function AstrologerCard({ astrologer }) {
  return (
    <div className="card-gold flex flex-col items-center gap-4 rounded-2xl border border-gold-500/40 bg-surface p-8 text-center shadow-[0_25px_60px_-15px_rgba(202,177,120,0.35)] sm:flex-row sm:text-left">
      <img
        src={astrologerPhoto}
        alt={astrologer.name}
        className="h-24 w-24 shrink-0 rounded-full border-2 border-gold-500/40 object-cover object-top"
      />
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
        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
          <Link to="/packages" className="gradient-cta rounded-full px-5 py-2 text-sm font-bold text-black shadow">
            Book a Consultation
          </Link>
        </div>
      </div>
    </div>
  )
}
