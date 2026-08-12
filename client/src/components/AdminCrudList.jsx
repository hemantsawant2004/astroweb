import { useEffect, useState } from 'react'
import { adminApi } from '../api/client'

function emptyItem(fields) {
  const obj = {}
  fields.forEach((f) => {
    obj[f.key] = f.type === 'boolean' ? false : ''
  })
  return obj
}

function Field({ field, value, onChange }) {
  const commonProps = {
    value: value ?? '',
    onChange: (e) => onChange(field.type === 'boolean' ? e.target.checked : e.target.value),
    className: 'input',
  }
  if (field.type === 'textarea') return <textarea rows={3} {...commonProps} placeholder={field.label} />
  if (field.type === 'boolean')
    return (
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    )
  if (field.type === 'number') return <input type="number" {...commonProps} placeholder={field.label} />
  return <input type="text" {...commonProps} placeholder={field.label} />
}

export default function AdminCrudList({ resource, fields, title, allowCreate = true, allowDelete = true }) {
  const [items, setItems] = useState([])
  const [drafts, setDrafts] = useState({})
  const [newItem, setNewItem] = useState(emptyItem(fields))
  const [message, setMessage] = useState('')

  function load() {
    adminApi.get(`/${resource}`).then((r) => {
      setItems(r.data)
      const d = {}
      r.data.forEach((item) => (d[item.id] = { ...item }))
      setDrafts(d)
    })
  }

  useEffect(load, [resource])

  function updateDraft(id, key, value) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [key]: value } }))
  }

  async function save(id) {
    setMessage('')
    try {
      await adminApi.patch(`/${resource}/${id}`, drafts[id])
      setMessage('Saved.')
      load()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Save failed')
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this item?')) return
    await adminApi.delete(`/${resource}/${id}`)
    load()
  }

  async function create() {
    setMessage('')
    try {
      await adminApi.post(`/${resource}`, newItem)
      setNewItem(emptyItem(fields))
      setMessage('Created.')
      load()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Create failed')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gold-300">{title}</h2>
      {message && <p className="mt-2 text-sm text-gold-400">{message}</p>}

      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-gold-500/20 bg-surface p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <Field field={f} value={drafts[item.id]?.[f.key]} onChange={(v) => updateDraft(item.id, f.key, v)} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-3">
              <button onClick={() => save(item.id)} className="rounded-full bg-cosmic-900 px-4 py-1.5 text-sm font-semibold text-white">
                Save
              </button>
              {allowDelete && (
                <button onClick={() => remove(item.id)} className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm font-semibold text-red-400">
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {allowCreate && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-gold-500/30 p-4">
          <p className="mb-3 text-sm font-semibold text-gold-300">Add new</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <Field field={f} value={newItem[f.key]} onChange={(v) => setNewItem((n) => ({ ...n, [f.key]: v }))} />
              </div>
            ))}
          </div>
          <button onClick={create} className="gradient-cta mt-3 rounded-full px-5 py-1.5 text-sm font-bold text-black">
            Create
          </button>
        </div>
      )}
    </div>
  )
}
