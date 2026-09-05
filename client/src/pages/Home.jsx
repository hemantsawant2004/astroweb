import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import PackageCard from '../components/PackageCard'
import AstrologerCard from '../components/AstrologerCard'
import TestimonialCard from '../components/TestimonialCard'
import Reveal from '../components/Reveal'
import DecisionConsole from '../components/DecisionConsole'
import { siteConfig } from '../data/siteConfig'
import astrologerPhoto from '../assets/amit-joshi.jpg'

const TRUST_ITEMS = [
  'Scientific astrology, not remedies',
  'Career & relationship focus',
  'Fixed-price consultations',
  'Personal chart review by Amit Joshi',
  'By appointment only',
  'No fear-based claims',
]

const MATRIX = [
  { n: '01', label: 'Pattern', q: 'What keeps repeating?' },
  { n: '02', label: 'Timing', q: 'Why does it feel urgent now?' },
  { n: '03', label: 'Choice', q: 'What are you truly choosing?' },
  { n: '04', label: 'Direction', q: 'What is the intelligent next move?' },
]

const ADVISORY_AREAS = [
  { n: '01', title: 'Relationship & Marriage Intelligence', desc: 'Compatibility, timing and match analysis for two charts.', to: '/kundli-matching', cta: 'Kundli Matching' },
  { n: '02', title: 'Career & Business Intelligence', desc: 'Fixed-price sessions for career moves and business decisions.', to: '/packages', cta: 'Book a Consultation' },
  { n: '03', title: 'Personal Direction Intelligence', desc: 'A numerology-based reading for direction and self-understanding.', to: '/numerology', cta: 'Numerology Report' },
  { n: '04', title: 'Family & Legacy Intelligence', desc: 'A full birth-chart review for family and long-term life questions.', to: '/kundli', cta: 'View Kundli' },
]

const CREDENTIALS = [
  { value: 'B.E. Mechanical', label: 'First Class with Distinction, Shivaji University.' },
  { value: 'Vedic + Outer Planets', label: 'Trained under “Master” Greenstone Lobo; incorporates Pluto, Neptune, Uranus and Chiron.' },
  { value: 'English, Marathi', label: 'Consultations conducted in either language.' },
  { value: 'Private', label: 'Confidential, one-to-one advisory by appointment only.' },
]

const HERO_STATS = [
  { value: '7', label: 'Session formats' },
  { value: '100%', label: 'Confidential, one-to-one' },
  { value: '2', label: 'Languages spoken' },
  { value: '0', label: 'Remedies or rituals' },
]

export default function Home() {
  const [astrologer, setAstrologer] = useState(null)
  const [packages, setPackages] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [activePackage, setActivePackage] = useState(0)
  const [activeAdvisory, setActiveAdvisory] = useState(0)

  useEffect(() => {
    api.get('/astrologers/amit-joshi').then((r) => setAstrologer(r.data))
    api.get('/packages').then((r) => setPackages(r.data.slice(0, 3)))
    api.get('/testimonials').then((r) => setTestimonials(r.data.filter((t) => t.is_featured).slice(0, 3)))
  }, [])

  const featuredQuote = testimonials[0]

  return (
    <div>
      <section className="gradient-hero relative isolate overflow-hidden px-4 pb-20 pt-6 text-ink sm:pt-12 lg:pt-28">
        <div
          className="pointer-events-none absolute -right-40 top-16 hidden h-[420px] w-[420px] rounded-full lg:block hero-ring"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 text-center lg:grid-cols-[1.1fr_0.9fr] lg:text-left">
            <div>
              {astrologer && (
                <Reveal>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-1.5 text-xs font-semibold text-ink/80">
                    <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                    {astrologer.name} is online now
                  </div>
                </Reveal>
              )}
              <Reveal delay={50}>
                <p className="star-dot mb-3 text-sm font-semibold uppercase tracking-widest text-gold-400">
                  {siteConfig.tagline}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="text-shine text-4xl font-normal leading-tight sm:text-6xl">
                  Some decisions change everything.
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mx-auto mt-4 max-w-xl text-ink/70 lg:mx-0">
                  Personalized astrology counseling with Amit Joshi &mdash; scientific chart analysis for career,
                  relationships and major life decisions. No remedies, no rituals &mdash; just clarity.
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="mx-auto mt-5 flex max-w-xl flex-col gap-2 lg:mx-0">
                  {['Personal chart review by Amit himself, not automated', 'Appointment-based, no wait queues'].map((item) => (
                    <div key={item} className="flex items-center justify-center gap-2 text-sm text-ink/75 lg:justify-start">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400">
                        &#10003;
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
                  <Link to="/packages" className="gradient-cta cta-blink rounded-full px-7 py-3 font-bold text-black shadow-lg">
                    Book a Consultation
                  </Link>
                </div>
              </Reveal>
            </div>

            {astrologer && (
              <Reveal delay={150} className="order-first mx-auto w-full max-w-[220px] lg:order-none lg:mx-0 lg:w-full lg:max-w-sm lg:justify-self-end">
                <div className="relative aspect-[3/4] overflow-hidden rounded-full border-4 border-gold-500/50 shadow-[0_35px_80px_-25px_rgba(202,177,120,0.35)]">
                  <img
                    src={astrologerPhoto}
                    alt={astrologer.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={350} className="relative mt-14 grid grid-cols-2 gap-x-4 gap-y-8 border-y border-ink/10 py-8 sm:grid-cols-4 sm:gap-x-8">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="font-display text-3xl font-normal text-gold-300 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-xs text-ink/60 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={400} className="relative mt-12">
            <DecisionConsole />
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-4xl px-4">
        {astrologer && (
          <Reveal delay={150}>
            <AstrologerCard astrologer={astrologer} />
          </Reveal>
        )}
      </section>

      <div className="overflow-hidden border-y border-white/5 bg-cosmic-950">
        <div className="ticker-track flex w-max flex-nowrap items-center py-4">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-4 text-sm font-medium text-white/55">
              <span className="mr-4 text-gold-500/50">&#10022;</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <Reveal>
          <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">The Approach</p>
          <h2 className="mt-4 text-3xl font-normal sm:text-5xl">
            This is not a horoscope website.
            <br />
            It is a space for <span className="text-gold-400">better decisions.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-display text-xl italic text-ink-soft sm:text-2xl">
            &ldquo;The objective is not certainty. It is better judgement.&rdquo;
          </p>
        </Reveal>
      </section>

      <section className="border-y border-white/5 bg-cosmic-900 px-4 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="star-dot text-center text-xs font-semibold uppercase tracking-widest text-gold-400">
              The Method
            </p>
            <h2 className="mt-3 text-center text-3xl font-normal sm:text-4xl">The Structured Advisory System</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MATRIX.map((m, i) => (
              <Reveal key={m.n} delay={i * 100}>
                <div className="card-gold h-full rounded-2xl border border-gold-500/15 bg-surface p-7">
                  <span className="font-display text-3xl text-gold-500/70">{m.n}</span>
                  <h3 className="mt-3 font-bold uppercase tracking-wide text-gold-400">{m.label}</h3>
                  <p className="mt-2 text-sm text-ink/65">{m.q}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-24">
        <Reveal>
          <p className="star-dot text-center text-xs font-semibold uppercase tracking-widest text-gold-400">
            Advisory Areas
          </p>
          <h2 className="mt-3 text-center text-3xl font-normal sm:text-4xl">Where clarity is most needed</h2>
        </Reveal>
        <div className="mt-10 sm:hidden">
          <div className="overflow-hidden" aria-live="polite">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeAdvisory * 100}%)` }}
            >
              {ADVISORY_AREAS.map((area) => (
                <div key={area.n} className="w-full shrink-0 px-0.5">
                  <Link
                    to={area.to}
                    className="row-hover group flex min-h-52 flex-col items-start justify-between gap-5 rounded-2xl border border-ink/10 px-6 py-7"
                  >
                    <div className="flex items-start gap-5">
                      <span className="font-display text-4xl text-gold-500/40">{area.n}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gold-300">{area.title}</h3>
                        <p className="mt-1 text-sm text-ink-soft">{area.desc}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-gold-500/40 px-4 py-1.5 text-xs font-semibold text-gold-400">
                      {area.cta} &rarr;
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-2" aria-label="Advisory area carousel controls">
            {ADVISORY_AREAS.map((area, index) => (
              <button
                key={area.n}
                type="button"
                onClick={() => setActiveAdvisory(index)}
                aria-label={`Show ${area.title}`}
                aria-current={index === activeAdvisory ? 'true' : undefined}
                className={`h-2 rounded-full transition-all ${
                  index === activeAdvisory ? 'w-6 bg-gold-400' : 'w-2 bg-gold-500/30'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="mt-12 hidden flex-col gap-3 sm:flex">
          {ADVISORY_AREAS.map((area, i) => (
            <Reveal key={area.n} delay={i * 80}>
              <Link
                to={area.to}
                className="row-hover group flex flex-col items-start justify-between gap-4 rounded-2xl border border-ink/10 px-6 py-7 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-5 sm:items-center">
                  <span className="font-display text-4xl text-gold-500/40">{area.n}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gold-300">{area.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{area.desc}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-gold-500/40 px-4 py-1.5 text-xs font-semibold text-gold-400 transition group-hover:bg-gold-500/10">
                  {area.cta} &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-normal text-gold-300 sm:text-4xl">Popular Sessions</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-soft">
            Fixed-price, appointment-based consultations &mdash; pick what fits your question.
          </p>
        </Reveal>
        <div className="mt-10 sm:hidden">
          <div className="overflow-hidden" aria-live="polite">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activePackage * 100}%)` }}
            >
              {packages.map((pkg) => (
                <div key={pkg.id} className="w-full shrink-0 px-0.5">
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>
          {packages.length > 1 && (
            <div className="mt-4 flex justify-center gap-2" aria-label="Session carousel controls">
              {packages.map((pkg, index) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setActivePackage(index)}
                  aria-label={`Show ${pkg.name}`}
                  aria-current={index === activePackage ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all ${
                    index === activePackage ? 'w-6 bg-gold-400' : 'w-2 bg-gold-500/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-12 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 100}>
              <PackageCard pkg={pkg} index={i} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/packages" className="font-semibold text-gold-400 hover:underline">
            View all sessions &rarr;
          </Link>
        </div>
      </section>

      {astrologer && (
        <section className="px-4 py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-[88px]">
            <Reveal>
              <div className="relative aspect-[3/4] max-h-[680px] overflow-hidden rounded-2xl bg-cosmic-900 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.7)]">
                <img
                  src={astrologerPhoto}
                  alt={astrologer.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="pointer-events-none absolute inset-[22px] border border-white/[0.14]" />
                <p className="absolute bottom-[42px] left-[44px] right-[44px] text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/55">
                  {astrologer.name} &middot; {siteConfig.name} &middot; Miraj, Maharashtra
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">The Advisor</p>
              <h2 className="mt-4 font-display text-[clamp(3rem,4.8vw,5.5rem)] font-normal leading-[0.97]">
                Amit
                <br />
                Joshi
              </h2>
              <p className="mt-[26px] font-display text-[1.65rem] leading-[1.45] text-gold-300">{astrologer.tagline}</p>
              <p className="mt-[22px] text-[0.94rem] leading-[1.9] text-ink-soft">{astrologer.bio}</p>
              <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-[34px]">
                {CREDENTIALS.map((c) => (
                  <div key={c.value} className="border-t border-gold-500/25 pt-[14px]">
                    <strong className="block font-display text-[1.4rem] font-normal text-gold-300">{c.value}</strong>
                    <span className="mt-1 block text-[0.7rem] leading-[1.55] text-ink-soft">{c.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="mt-9 inline-block font-semibold text-gold-400 hover:underline">
                Read more about Amit &rarr;
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {featuredQuote && (
        <section className="border-y border-white/5 bg-cosmic-900 px-4 py-24 text-center text-white">
          <Reveal className="mx-auto max-w-2xl">
            <div className="mb-4 text-gold-500">{'★'.repeat(featuredQuote.rating || 5)}</div>
            <p className="font-display text-2xl italic text-white/90 sm:text-4xl">&ldquo;{featuredQuote.quote}&rdquo;</p>
            <p className="mt-5 text-sm font-semibold text-gold-400">
              {featuredQuote.name}
              {featuredQuote.location && <span className="font-normal text-white/50"> &middot; {featuredQuote.location}</span>}
            </p>
          </Reveal>
        </section>
      )}

      {testimonials.length > 1 && (
        <section className="mx-auto max-w-7xl px-4 py-24">
          <Reveal>
            <h2 className="text-center text-3xl font-normal text-gold-300 sm:text-4xl">What Clients Say</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 100}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/testimonials" className="font-semibold text-gold-400 hover:underline">
              Read more testimonials &rarr;
            </Link>
          </div>
        </section>
      )}

      <section className="px-4 py-28 text-center">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-normal sm:text-5xl">
            Clarity at the right time
            <br />
            can <span className="text-gold-400">change everything.</span>
          </h2>
          <p className="mt-4 text-ink-soft">Don&apos;t let uncertainty hold you back. Get the clarity you deserve.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            {/* <Link to="/book/the-decision-room" className="gradient-cta rounded-full px-7 py-3 font-bold text-black shadow-lg">
              Enter the Decision Room
            </Link> */}
            <Link to="/packages" className="rounded-full border border-gold-500/40 px-7 py-3 font-bold text-gold-400 hover:bg-gold-500/10">
              Book Your Session Now
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
