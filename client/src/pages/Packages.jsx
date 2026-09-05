import { useEffect, useState } from 'react'
import { api } from '../api/client'
import PackageCard from '../components/PackageCard'
import PageHero from '../components/PageHero'

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [dealing, setDealing] = useState(false)

  useEffect(() => {
    api
      .get('/packages')
      .then((r) => {
        setPackages(r.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const revealSessions = () => {
    setDealing(true)
    window.requestAnimationFrame(() => setRevealed(true))
  }

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Sessions & Pricing"
        title="Book a Consultation"
        subtitle="Every session is appointment-based, one-on-one with Amit Joshi. Pick the format that fits your question."
      />

      <div className="mx-auto mt-10 max-w-7xl px-4">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {/* The "deck" -- same size and style as a real package card, sitting in the
              grid's first slot, so the rest of the hand deals out around it in place. */}
          <div className="card-gold flex h-full flex-col items-center justify-center rounded-2xl border border-gold-500/25 bg-surface p-6 text-center">
            <span className="text-3xl text-gold-400">&#10022;</span>
            <h3 className="mt-3 text-lg font-bold text-gold-300">
              {loading ? 'Loading Sessions' : revealed ? 'Sessions Ready' : 'Book Your Session'}
            </h3>
            <p className="mt-2 flex-1 text-sm text-ink-soft">
              {loading
                ? 'Finding the available consultation formats for you.'
                : revealed
                  ? `All ${packages.length} formats are laid out below.`
                  : 'Seven fixed-price formats, one-on-one with Amit.'}
            </p>
            {!revealed && !dealing && (
              <button
                onClick={revealSessions}
                disabled={packages.length === 0}
                className="gradient-cta mt-5 w-full rounded-full py-2.5 text-sm font-bold text-black shadow disabled:opacity-60"
              >
                {packages.length === 0 ? 'Loading…' : 'Reveal Sessions →'}
              </button>
            )}
          </div>

          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`package-skeleton-${i}`}
                className="h-[250px] animate-pulse rounded-2xl border border-gold-500/15 bg-surface p-6"
                aria-hidden="true"
              >
                <div className="h-5 w-3/5 rounded bg-white/10" />
                <div className="mt-5 h-3 w-full rounded bg-white/5" />
                <div className="mt-2 h-3 w-4/5 rounded bg-white/5" />
                <div className="mt-12 h-7 w-2/5 rounded bg-white/10" />
                <div className="mt-5 h-10 rounded-full bg-gold-500/15" />
              </div>
            ))}

          {dealing && packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className="transition-all duration-700 ease-out"
              style={{
                transitionDelay: `${i * 150}ms`,
                opacity: revealed ? 1 : 0,
                transform: revealed
                  ? 'translate(0, 0) rotate(0deg) scale(1)'
                  : 'translate(-60px, -30px) rotate(-14deg) scale(0.7)',
              }}
            >
              <PackageCard pkg={pkg} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
