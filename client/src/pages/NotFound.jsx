import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-gold-300">Page not found</h1>
      <Link to="/" className="mt-4 inline-block font-semibold text-gold-400 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}
