import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { ZODIAC_SIGNS } from '../data/zodiac'

export default function Horoscope() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Zodiac Outlook"
        title="Daily Horoscope"
        subtitle="Pick your zodiac sign for today's outlook."
      />
      <div className="mx-auto mt-6 max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ZODIAC_SIGNS.map((sign, i) => (
            <Reveal key={sign.name} delay={(i % 4) * 80}>
              <Link
                to={`/horoscope/${sign.name.toLowerCase()}`}
                className="card-gold flex h-full flex-col items-center gap-1 rounded-2xl border border-gold-500/20 bg-surface p-6 text-center shadow-sm"
              >
                <span className="text-3xl text-gold-400">{sign.symbol}</span>
                <span className="font-semibold text-gold-300">{sign.name}</span>
                <span className="text-xs text-ink-soft">{sign.dates}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
