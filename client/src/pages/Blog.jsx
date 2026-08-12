import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.get('/blog').then((r) => setPosts(r.data))
  }, [])

  return (
    <div className="pb-20">
      <PageHero eyebrow="Insights" title="Blog" subtitle="Notes and reflections from Amit's practice." />
      <div className="mx-auto mt-6 max-w-4xl px-4">
        {posts.length === 0 ? (
          <p className="mt-8 text-center text-ink-soft">No posts published yet &mdash; check back soon.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 80}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="card-gold block rounded-2xl border border-gold-500/20 bg-surface p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-gold-300">{post.title}</h2>
                  <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-gold-400">Read more &rarr;</span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
