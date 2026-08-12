import AdminCrudList from '../../components/AdminCrudList'

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug (url-friendly)' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'price_paise', label: 'Price (paise)', type: 'number' },
  { key: 'duration_min', label: 'Duration (min)', type: 'number' },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
  { key: 'is_active', label: 'Active', type: 'boolean' },
]

export default function AdminPackages() {
  return <AdminCrudList resource="packages" fields={fields} title="Packages" allowCreate={false} />
}
