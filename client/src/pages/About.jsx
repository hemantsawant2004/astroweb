import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Reveal from '../components/Reveal'

export default function About() {
  const [astrologer, setAstrologer] = useState(null)

  useEffect(() => {
    api.get('/astrologers/amit-joshi').then((r) => setAstrologer(r.data))
  }, [])

  if (!astrologer) return <div className="mx-auto max-w-xl px-4 py-16 text-center text-ink-soft">Loading&hellip;</div>

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20">
      <div className="relative overflow-hidden pt-16 pb-6 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div className="h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <Reveal className="flex flex-col items-center gap-4">
          <div className="gradient-cta flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-black shadow-[0_0_40px_rgba(212,175,55,0.35)]">
            {astrologer.avatar_initials}
          </div>
          <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">About the Consultant</p>
          <h1 className="text-shine text-3xl font-extrabold sm:text-4xl">{astrologer.name}</h1>
          <p className="font-semibold text-gold-400">{astrologer.tagline}</p>
        </Reveal>
      </div>

      <Reveal delay={100}>
        <p className="mt-6 whitespace-pre-line text-center leading-relaxed text-ink-soft">{astrologer.bio}</p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Reveal delay={150}>
          <div className="card-gold h-full rounded-2xl border border-gold-500/20 bg-surface p-6">
            <h2 className="star-dot font-bold text-gold-300">Specializations</h2>
            <p className="mt-2 text-ink-soft">{astrologer.specializations}</p>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div className="card-gold h-full rounded-2xl border border-gold-500/20 bg-surface p-6">
            <h2 className="star-dot font-bold text-gold-300">Languages</h2>
            <p className="mt-2 text-ink-soft">{astrologer.languages}</p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
