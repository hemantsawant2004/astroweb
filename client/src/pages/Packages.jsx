import { useEffect, useState } from 'react'
import { api } from '../api/client'
import PackageCard from '../components/PackageCard'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

export default function Packages() {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    api.get('/packages').then((r) => setPackages(r.data))
  }, [])

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Sessions & Pricing"
        title="Book a Consultation"
        subtitle="Every session is appointment-based, one-on-one with Amit Joshi. Pick the format that fits your question."
      />
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={(i % 3) * 100}>
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
