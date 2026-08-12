import Reveal from './Reveal'

export default function PageHero({ eyebrow, title, subtitle, shine = false, align = 'center' }) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`relative overflow-hidden px-4 pb-8 pt-16 ${alignment} flex flex-col`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-64 w-64 rounded-full bg-gold-500/10 blur-3xl sm:h-80 sm:w-80" />
      </div>
      <Reveal className={`flex flex-col ${alignment}`}>
        {eyebrow && (
          <p className="star-dot mb-2 text-xs font-semibold uppercase tracking-widest text-gold-400">{eyebrow}</p>
        )}
        <h1 className={`text-3xl font-extrabold sm:text-4xl ${shine ? 'text-shine' : 'text-gold-300'}`}>{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-xl text-ink-soft">{subtitle}</p>}
      </Reveal>
    </div>
  )
}
