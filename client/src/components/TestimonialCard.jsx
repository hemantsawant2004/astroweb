export default function TestimonialCard({ testimonial }) {
  return (
    <div className="card-gold flex h-full flex-col rounded-2xl bg-surface p-6 shadow-sm border border-gold-500/20">
      <div className="mb-3 text-gold-500">{'★'.repeat(testimonial.rating || 5)}</div>
      <p className="flex-1 text-sm italic text-ink-soft">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-4">
        <div className="font-semibold text-gold-300">{testimonial.name}</div>
        {testimonial.location && <div className="text-xs text-ink-soft">{testimonial.location}</div>}
      </div>
    </div>
  )
}
