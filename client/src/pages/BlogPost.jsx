import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import Reveal from '../components/Reveal'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api
      .get(`/blog/${slug}`)
      .then((r) => setPost(r.data))
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) return <div className="mx-auto max-w-xl px-4 py-16 text-center text-ink-soft">Post not found.</div>
  if (!post) return <div className="mx-auto max-w-xl px-4 py-16 text-center text-ink-soft">Loading&hellip;</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Reveal>
        <Link to="/blog" className="text-sm text-gold-400 hover:underline">&larr; Back to blog</Link>
        <h1 className="mt-3 text-3xl font-extrabold text-gold-300 sm:text-4xl">{post.title}</h1>
        <div className="mt-8 whitespace-pre-line leading-relaxed text-ink-soft">{post.content}</div>
      </Reveal>
    </div>
  )
}
