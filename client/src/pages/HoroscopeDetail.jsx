import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import Reveal from '../components/Reveal'
import { zodiacSymbol } from '../data/zodiac'

const FIELDS = [
  ['love_text', 'Love'],
  ['career_text', 'Career'],
  ['finance_text', 'Finance'],
  ['health_text', 'Health'],
  ['travel_text', 'Travel'],
  ['remedies_text', 'Notes'],
]

export default function HoroscopeDetail() {
  const { sign } = useParams()
  const [data, setData] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setData(null)
    setNotFound(false)
    api
      .get(`/horoscopes/${sign.toLowerCase()}`)
      .then((r) => setData(r.data))
      .catch(() => setNotFound(true))
  }, [sign])

  if (notFound) return <div className="mx-auto max-w-xl px-4 py-16 text-center text-ink-soft">Sign not found.</div>
  if (!data) return <div className="mx-auto max-w-xl px-4 py-16 text-center text-ink-soft">Loading&hellip;</div>

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20">
      <div className="relative overflow-hidden pt-16 pb-4 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <Reveal className="flex flex-col items-center">
          <Link to="/horoscope" className="self-start text-sm text-gold-400 hover:underline">&larr; All signs</Link>
          <span className="mt-2 text-5xl text-gold-400">{zodiacSymbol(data.zodiac_sign)}</span>
          <h1 className="mt-2 font-display text-3xl font-normal capitalize">{data.zodiac_sign}</h1>
          <p className="mt-1 text-sm capitalize text-ink-soft">{data.period} outlook</p>
        </Reveal>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map(([key, label], i) =>
          data[key] ? (
            <Reveal key={key} delay={i * 80}>
              <div className="card-gold h-full rounded-2xl border border-gold-500/20 bg-surface p-5">
                <h2 className="star-dot font-bold text-gold-300">{label}</h2>
                <p className="mt-1 text-ink-soft">{data[key]}</p>
              </div>
            </Reveal>
          ) : null
        )}
      </div>
    </div>
  )
}
