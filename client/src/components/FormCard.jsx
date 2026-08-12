export default function FormCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-gold-500/20 bg-surface p-8 shadow-[0_20px_50px_-25px_rgba(212,175,55,0.45)] ${className}`}
    >
      {children}
    </div>
  )
}
