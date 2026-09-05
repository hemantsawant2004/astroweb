// Fully client-side mock of the real Express API, used only when the app is built
// in demo mode (VITE_DEMO_MODE=true). Mirrors the shape of every endpoint the real
// backend exposes so every page/component works completely unmodified -- the only
// difference is data lives in memory instead of MySQL, and resets on page refresh.
import {
  astrologer,
  packages as seedPackages,
  testimonials as seedTestimonials,
  faqs as seedFaqs,
  horoscopes as seedHoroscopes,
  blogPosts as seedBlogPosts,
} from './mockData'

const store = {
  astrologers: [{ ...astrologer }],
  packages: seedPackages.map((p) => ({ ...p })),
  testimonials: seedTestimonials.map((t) => ({ ...t })),
  faqs: seedFaqs.map((f) => ({ ...f })),
  horoscopes: seedHoroscopes.map((h) => ({ ...h })),
  blog: seedBlogPosts.map((b) => ({ ...b })),
  bookings: [],
  chartRequests: [],
  enquiries: [],
}

let nextId = 1000
const newId = () => nextId++

let currentUser = null // { id, name, email, phone }

function delay(ms = 350 + Math.random() * 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function ok(data) {
  return { data }
}

function fail(message, status = 400) {
  const err = new Error(message)
  err.response = { status, data: { error: message } }
  throw err
}

function findBySlug(list, slug) {
  return list.find((x) => x.slug === slug)
}

// ---- generic admin CRUD over a named collection ----
function crud(collection) {
  return {
    list: async () => ok([...store[collection]]),
    get: async (id) => {
      const item = store[collection].find((x) => String(x.id) === String(id))
      if (!item) fail('Not found', 404)
      return ok(item)
    },
    create: async (body) => {
      const item = { id: newId(), ...body }
      store[collection].push(item)
      return ok({ id: item.id })
    },
    update: async (id, body) => {
      const idx = store[collection].findIndex((x) => String(x.id) === String(id))
      if (idx === -1) fail('Not found', 404)
      store[collection][idx] = { ...store[collection][idx], ...body }
      return ok({ ok: true })
    },
    remove: async (id) => {
      store[collection] = store[collection].filter((x) => String(x.id) !== String(id))
      return ok({ ok: true })
    },
  }
}

const adminCollections = ['testimonials', 'faqs', 'horoscopes', 'blog', 'packages', 'astrologers']
const leadCollections = { bookings: 'bookings', 'chart-requests': 'chartRequests', enquiries: 'enquiries' }

function parsePath(url) {
  const clean = url.split('?')[0].replace(/^\/+/, '')
  return clean.split('/').filter(Boolean)
}

// ---- public + user API ----
export const mockApi = {
  async get(url) {
    await delay()
    const parts = parsePath(url)

    if (url.startsWith('/astrologers/')) {
      const found = findBySlug(store.astrologers, parts[1])
      if (!found) fail('Astrologer not found', 404)
      return ok(found)
    }
    if (url === '/packages') return ok(store.packages.filter((p) => p.is_active))
    if (url.startsWith('/packages/')) {
      const found = findBySlug(store.packages, parts[1])
      if (!found) fail('Package not found', 404)
      return ok(found)
    }
    if (url === '/testimonials') return ok(store.testimonials)
    if (url === '/faqs') return ok(store.faqs)
    if (url === '/blog') return ok(store.blog)
    if (url.startsWith('/blog/')) {
      const found = findBySlug(store.blog, parts[1])
      if (!found) fail('Post not found', 404)
      return ok(found)
    }
    if (url.startsWith('/horoscopes/')) {
      const found = store.horoscopes.find((h) => h.zodiac_sign.toLowerCase() === parts[1].toLowerCase())
      if (!found) fail('Horoscope not found', 404)
      return ok(found)
    }
    if (url === '/horoscopes') return ok(store.horoscopes)

    if (url === '/account/bookings') {
      if (!currentUser) fail('Missing token', 401)
      return ok(store.bookings.filter((b) => b.user_id === currentUser.id))
    }
    if (url === '/account/chart-requests') {
      if (!currentUser) fail('Missing token', 401)
      return ok(store.chartRequests.filter((c) => c.user_id === currentUser.id))
    }

    fail(`(demo) No mock route for GET ${url}`, 404)
  },

  async post(url, body = {}) {
    await delay()

    if (url === '/auth/signup') {
      currentUser = {
        id: newId(),
        name: body.name,
        email: body.email,
        phone: body.phone || '',
      }
      return ok({ token: 'demo-user-token', user: currentUser })
    }
    if (url === '/auth/login') {
      currentUser = currentUser || { id: newId(), name: body.email.split('@')[0], email: body.email, phone: '' }
      return ok({ token: 'demo-user-token', user: currentUser })
    }
    if (url === '/admin/auth/login') {
      if (!body.password) fail('Incorrect password', 401)
      return ok({ token: 'demo-admin-token' })
    }
    if (url === '/enquiries') {
      const item = { id: newId(), created_at: new Date().toISOString(), ...body }
      store.enquiries.push(item)
      return ok({ id: item.id })
    }
    if (url === '/chart-requests') {
      const item = { id: newId(), status: 'new', created_at: new Date().toISOString(), user_id: currentUser?.id || null, ...body }
      store.chartRequests.push(item)
      return ok({ id: item.id })
    }
    if (url === '/bookings') {
      const pkg = store.packages.find((p) => p.id === body.packageId)
      const item = {
        id: newId(),
        package_id: body.packageId,
        package_name: pkg?.name,
        price_paise: pkg?.price_paise,
        status: 'pending',
        payment_status: 'unpaid',
        created_at: new Date().toISOString(),
        user_id: currentUser?.id || null,
        ...body,
      }
      store.bookings.push(item)
      return ok({ id: item.id })
    }
    if (url === '/payments/create-order') {
      return ok({ orderId: `demo_order_${newId()}`, amount: body.amountPaise || 0, currency: 'INR', keyId: 'demo' })
    }
    if (url === '/payments/verify') {
      const b = store.bookings.find((x) => x.id === body.bookingId)
      if (b) {
        b.status = 'confirmed'
        b.payment_status = 'paid'
      }
      return ok({ ok: true })
    }

    fail(`(demo) No mock route for POST ${url}`, 404)
  },

  async patch() {
    await delay()
    fail('(demo) Not supported', 404)
  },
  async delete() {
    await delay()
    fail('(demo) Not supported', 404)
  },
}

// ---- admin API ----
export const mockAdminApi = {
  async get(url) {
    await delay()
    const parts = parsePath(url)
    const resource = parts[0]

    if (adminCollections.includes(resource) && parts.length === 1) {
      return ok([...store[resource]])
    }
    if (leadCollections[resource] && parts.length === 1) {
      return ok([...store[leadCollections[resource]]].reverse())
    }
    fail(`(demo) No mock admin route for GET ${url}`, 404)
  },

  async post(url, body = {}) {
    await delay()
    const parts = parsePath(url)
    const resource = parts[0]
    if (adminCollections.includes(resource) && parts.length === 1) {
      return crud(resource).create(body)
    }
    fail(`(demo) No mock admin route for POST ${url}`, 404)
  },

  async patch(url, body = {}) {
    await delay()
    const parts = parsePath(url)
    const resource = parts[0]
    const id = parts[1]
    if (adminCollections.includes(resource) && id) {
      return crud(resource).update(id, body)
    }
    if (leadCollections[resource] && id) {
      const collection = leadCollections[resource]
      const item = store[collection].find((x) => String(x.id) === String(id))
      if (!item) fail('Not found', 404)
      Object.assign(item, body)
      return ok({ ok: true })
    }
    fail(`(demo) No mock admin route for PATCH ${url}`, 404)
  },

  async delete(url) {
    await delay()
    const parts = parsePath(url)
    const resource = parts[0]
    const id = parts[1]
    if (adminCollections.includes(resource) && id) {
      return crud(resource).remove(id)
    }
    fail(`(demo) No mock admin route for DELETE ${url}`, 404)
  },
}

export function isDemoMode() {
  return import.meta.env.VITE_DEMO_MODE === 'true'
}
