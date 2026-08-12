import AdminCrudList from '../../components/AdminCrudList'

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'location', label: 'Location' },
  { key: 'quote', label: 'Quote', type: 'textarea' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
  { key: 'is_featured', label: 'Featured on homepage', type: 'boolean' },
]

export default function AdminTestimonials() {
  return <AdminCrudList resource="testimonials" fields={fields} title="Testimonials" />
}
