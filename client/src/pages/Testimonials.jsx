import { useEffect, useState } from 'react'
import { api } from '../api/client'
import TestimonialCard from '../components/TestimonialCard'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    api.get('/testimonials').then((r) => setTestimonials(r.data))
  }, [])

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Client Stories"
        title="Client Testimonials"
        subtitle="Real feedback from people Amit has worked with."
      />
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 100}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
