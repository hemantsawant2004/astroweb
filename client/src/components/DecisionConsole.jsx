import { useState } from 'react'
import { Link } from 'react-router-dom'

const CHOICES = [
  {
    id: 'marriage',
    label: 'Marriage',
    message: 'Marriage decisions get clearer once the compatibility and timing questions are answered separately from the emotional ones. That split is where Kundli Matching starts.',
  },
  {
    id: 'relationship',
    label: 'Relationship',
    message: 'Most relationship uncertainty is really a pattern that keeps repeating. A chart reading names the pattern so you can decide instead of react.',
  },
  {
    id: 'career',
    label: 'Career',
    message: 'Career questions are rarely about talent — they’re about timing and direction. A consultation maps both against your actual chart, not general advice.',
  },
  {
    id: 'business',
    label: 'Business',
    message: 'Business decisions carry real stakes. This looks at timing, risk windows and partnerships through your chart, alongside the practical facts you already know.',
  },
  {
    id: 'life-direction',
    label: 'Life Direction',
    message: 'When nothing is technically wrong but nothing feels right, that’s a direction question. A full reading gives you a next move, not just reassurance.',
  },
  {
    id: 'family',
    label: 'Family',
    message: 'Family decisions sit at the intersection of duty and desire. A grounded reading helps separate what’s actually yours to decide from what isn’t.',
  },
]

export default function DecisionConsole() {
  const [active, setActive] = useState(null)
  const choice = CHOICES.find((c) => c.id === active)

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gold-500/25 bg-surface/95 p-6 text-left shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)] backdrop-blur sm:p-8">
      <div className="flex items-center justify-between">
        <span className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">
          Confidential intake &middot; 01
        </span>
        <span className="text-xs text-ink/40">Private</span>
      </div>
      <p className="mt-3 font-display text-lg text-ink sm:text-xl">What decision brought you here?</p>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CHOICES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            data-active={active === c.id}
            onClick={() => setActive(c.id)}
            className="console-choice rounded-xl border border-ink/12 bg-ink/[0.04] px-3 py-3.5 text-left text-sm font-semibold text-ink/85"
          >
            <span className="block text-[10px] font-normal text-gold-400/80">{String(i + 1).padStart(2, '0')}</span>
            {c.label}
          </button>
        ))}
      </div>

      {choice && (
        <div className="mt-5 rounded-xl border border-gold-500/20 bg-ink/5 p-4">
          <p className="text-sm leading-relaxed text-ink/75">{choice.message}</p>
          <Link
            to="/packages"
            className="gradient-cta mt-4 inline-block rounded-full px-5 py-2 text-sm font-bold text-black shadow"
          >
            Continue into the advisory process &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
