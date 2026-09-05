import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import Reveal from '../components/Reveal'
import astrologerPhoto from '../assets/amit-joshi.jpg'

const CREDENTIALS = [
  { value: 'B.E. Mechanical', label: 'First Class with Distinction, Shivaji University.' },
  { value: 'Greenstone Lobo', label: 'Trained in astrology under "Master" Greenstone Lobo.' },
  { value: 'Rishi Parashar', label: "Methodology rooted in Rishi Parashar's traditions." },
  { value: 'Outer Planets', label: 'Also reads Pluto, Neptune, Uranus, Chiron and hypothetical points.' },
  { value: 'No Remedies', label: 'Chart analysis only -- no remedies or rituals prescribed.' },
  { value: 'English, Marathi', label: 'Consultations conducted in either language.' },
]

export default function About() {
  const [astrologer, setAstrologer] = useState(null)

  useEffect(() => {
    api.get('/astrologers/amit-joshi').then((r) => setAstrologer(r.data))
  }, [])

  if (!astrologer) return <div className="mx-auto max-w-xl px-4 py-16 text-center text-ink-soft">Loading&hellip;</div>

  return (
    <div className="pb-20">
      <section className="px-4 pb-16 pt-16 sm:pt-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-3xl border border-gold-500/30 shadow-[0_35px_80px_-25px_rgba(202,177,120,0.35)]">
              <img
                src={astrologerPhoto}
                alt={astrologer.name}
                className="h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              <div className="pointer-events-none absolute inset-[14px] border border-white/15" />
              <div className="absolute bottom-6 left-6 right-6">
                {astrologer.is_online ? (
                  <span className="flex w-fit items-center gap-1.5 rounded-full border border-gold-500/30 bg-cosmic-950/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">
                    <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                    Online now
                  </span>
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">The Advisor</p>
            <h1 className="mt-3 whitespace-nowrap font-display text-4xl font-normal leading-[0.97] sm:text-6xl lg:text-4xl">{astrologer.name}</h1>
            <p className="mt-5 font-display text-xl leading-snug text-gold-300 sm:text-2xl">{astrologer.tagline}</p>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-loose text-ink-soft">{astrologer.bio}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/packages" className="gradient-cta rounded-full px-7 py-3 font-bold text-black shadow-lg">
                Book a Consultation
              </Link>
              <Link
                to="/faq"
                className="rounded-full border border-gold-500/40 px-7 py-3 font-bold text-gold-400 hover:bg-gold-500/10"
              >
                Read the FAQ
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-gold-500/10 bg-cosmic-900 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="star-dot text-center text-xs font-semibold uppercase tracking-widest text-gold-400">
              Background &amp; Method
            </p>
          </Reveal>
          <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c.value} delay={i * 80}>
                <div className="border-t border-gold-500/25 pt-4">
                  <strong className="block font-display text-2xl font-normal text-gold-300">{c.value}</strong>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{c.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="card-gold h-full rounded-2xl border border-gold-500/20 bg-surface p-6">
              <h2 className="star-dot font-bold text-gold-300">Specializations</h2>
              <p className="mt-2 text-ink-soft">{astrologer.specializations}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card-gold h-full rounded-2xl border border-gold-500/20 bg-surface p-6">
              <h2 className="star-dot font-bold text-gold-300">Beyond Astrology</h2>
              <p className="mt-2 text-ink-soft">
                Ventures in PVC manufacturing, pharmaceuticals and interior design; currently manages pharmaceutical
                businesses and hospital consultancy alongside his astrology practice.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-gold-500/10 bg-cosmic-950 px-4 py-16 text-center text-white">
        <Reveal className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-normal sm:text-3xl">
            No remedies. No rituals.
            <br />
            Just a <span className="text-gold-400">clear read</span> of your chart.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/packages" className="gradient-cta rounded-full px-7 py-3 font-bold text-black shadow-lg">
              Book a Consultation
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
