import { useEffect, useState } from 'react'
import { adminApi } from '../../api/client'

const SECTIONS = {
  bookings: { statuses: ['pending', 'confirmed', 'completed', 'cancelled'] },
  'chart-requests': { statuses: ['new', 'reviewed', 'contacted', 'closed'] },
  enquiries: { statuses: null },
}

function StatusSelect({ item, resource, statuses, onUpdated, className = '' }) {
  async function updateStatus(e) {
    await adminApi.patch(`/${resource}/${item.id}`, { status: e.target.value })
    onUpdated()
  }
  return (
    <select value={item.status} onChange={updateStatus} className={`input py-1 ${className}`}>
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}

function Row({ item, resource, statuses, onUpdated }) {
  return (
    <tr className="border-b border-gold-500/10 text-sm">
      <td className="py-2 pr-4">{item.name}</td>
      <td className="py-2 pr-4">{item.email || item.phone}</td>
      <td className="py-2 pr-4">{item.package_name || item.type?.replace('_', ' ') || item.message}</td>
      <td className="py-2 pr-4 text-ink-soft">{new Date(item.created_at).toLocaleString()}</td>
      {statuses && (
        <td className="py-2">
          <StatusSelect item={item} resource={resource} statuses={statuses} onUpdated={onUpdated} />
        </td>
      )}
    </tr>
  )
}

function Card({ item, resource, statuses, onUpdated }) {
  return (
    <div className="rounded-xl border border-gold-500/20 bg-cosmic-900 p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="font-semibold text-gold-300">{item.name}</span>
        <span className="shrink-0 text-xs text-ink-soft">{new Date(item.created_at).toLocaleDateString()}</span>
      </div>
      <p className="mt-1 text-ink-soft">{item.email || item.phone}</p>
      <p className="mt-1">{item.package_name || item.type?.replace('_', ' ') || item.message}</p>
      {statuses && <StatusSelect item={item} resource={resource} statuses={statuses} onUpdated={onUpdated} className="mt-3 w-full capitalize" />}
    </div>
  )
}

export default function AdminLeads() {
  const [tab, setTab] = useState('bookings')
  const [items, setItems] = useState([])

  function load() {
    adminApi.get(`/${tab}`).then((r) => setItems(r.data))
  }

  useEffect(load, [tab])

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(SECTIONS).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
              tab === key ? 'bg-cosmic-900 text-white' : 'bg-gold-500/10 text-gold-300'
            }`}
          >
            {key.replace('-', ' ')}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-gold-500/20 bg-surface p-4">
          <p className="text-sm text-ink-soft">Nothing here yet.</p>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards so no column ever hides off-screen */}
          <div className="mt-6 space-y-3 sm:hidden">
            {items.map((item) => (
              <Card key={item.id} item={item} resource={tab} statuses={SECTIONS[tab].statuses} onUpdated={load} />
            ))}
          </div>

          {/* Desktop: full table */}
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-gold-500/20 bg-surface p-4 sm:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold-500/20 text-xs uppercase text-ink-soft">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Contact</th>
                  <th className="py-2 pr-4">Detail</th>
                  <th className="py-2 pr-4">Received</th>
                  {SECTIONS[tab].statuses && <th className="py-2">Status</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <Row key={item.id} item={item} resource={tab} statuses={SECTIONS[tab].statuses} onUpdated={load} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
