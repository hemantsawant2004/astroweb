import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import PackageCard from '../components/PackageCard'
import AstrologerCard from '../components/AstrologerCard'
import TestimonialCard from '../components/TestimonialCard'
import Reveal from '../components/Reveal'
import { siteConfig } from '../data/siteConfig'
import heroVideo from '../assets/astro-hero.mp4'

export default function Home() {
  const [astrologer, setAstrologer] = useState(null)
  const [packages, setPackages] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    api.get('/astrologers/amit-joshi').then((r) => setAstrologer(r.data))
    api.get('/packages').then((r) => setPackages(r.data.slice(0, 3)))
    api.get('/testimonials').then((r) => setTestimonials(r.data.filter((t) => t.is_featured).slice(0, 3)))
  }, [])

  return (
    <div>
      <section className="gradient-hero relative isolate overflow-hidden px-4 py-28 text-center text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />
        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            <p className="star-dot mb-3 text-sm font-semibold uppercase tracking-widest text-gold-400">
              {siteConfig.tagline}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-shine text-4xl font-extrabold leading-tight sm:text-5xl">
              Learn More About Your Destiny
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Personalized astrology counseling with Amit Joshi &mdash; scientific chart analysis for career,
              relationships and major life decisions. No remedies, no rituals &mdash; just clarity.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/chat" className="gradient-cta rounded-full px-7 py-3 font-bold text-black shadow-lg">
                Chat with Astrologer
              </Link>
              <Link
                to="/packages"
                className="rounded-full border border-gold-500/50 px-7 py-3 font-bold transition hover:bg-gold-500/10"
              >
                Book a Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-4xl px-4">
        {astrologer && (
          <Reveal delay={150}>
            <AstrologerCard astrologer={astrologer} />
          </Reveal>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-gold-300">Popular Sessions</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-soft">
            Fixed-price, appointment-based consultations &mdash; pick what fits your question.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 100}>
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/packages" className="font-semibold text-gold-400 hover:underline">
            View all sessions &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-cosmic-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gold-300">Explore</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/kundli', title: 'View Kundli', desc: 'Request your birth chart for review.' },
              { to: '/kundli-matching', title: 'Kundli Matching', desc: 'Compatibility analysis for two charts.' },
              { to: '/numerology', title: 'Numerology Report', desc: 'Request a numerology-based reading.' },
              { to: '/horoscope', title: 'Daily Horoscope', desc: 'Browse your zodiac sign outlook.' },
            ].map((item, i) => (
              <Reveal key={item.to} delay={i * 100}>
                <Link
                  to={item.to}
                  className="card-gold block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold-400/60 hover:bg-white/10"
                >
                  <h3 className="font-bold text-gold-400">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gold-300">What Clients Say</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 100}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/testimonials" className="font-semibold text-gold-400 hover:underline">
              Read more testimonials &rarr;
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
