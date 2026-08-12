import { Link } from 'react-router-dom'
import { formatPaise } from '../utils/money'

export default function PackageCard({ pkg }) {
  return (
    <div className="card-gold flex h-full flex-col rounded-2xl border border-gold-500/20 bg-surface p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gold-300">{pkg.name}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-soft">{pkg.description}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-gold-400">{formatPaise(pkg.price_paise)}</span>
        <span className="text-sm text-ink-soft">/ {pkg.duration_min} min</span>
      </div>
      <Link
        to={`/book/${pkg.slug}`}
        className="gradient-cta mt-5 rounded-full py-2.5 text-center text-sm font-bold text-black shadow"
      >
        Book Now
      </Link>
    </div>
  )
}
