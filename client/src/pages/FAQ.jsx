import { useEffect, useState } from 'react'
import { api } from '../api/client'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])

  useEffect(() => {
    api.get('/faqs').then((r) => setFaqs(r.data))
  }, [])

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Good to Know"
        title="Frequently Asked Questions"
        subtitle="Everything you should know before booking a session."
      />
      <div className="mx-auto mt-6 max-w-3xl px-4">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={faq.id} delay={(i % 5) * 60}>
              <details className="faq-item card-gold rounded-xl border border-gold-500/20 bg-surface p-5 shadow-sm">
                <summary className="flex items-center justify-between gap-4 font-semibold text-gold-300">
                  {faq.question}
                  <span className="faq-icon shrink-0 text-xl text-gold-400">+</span>
                </summary>
                <p className="mt-3 text-ink-soft">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
