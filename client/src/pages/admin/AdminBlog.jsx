import AdminCrudList from '../../components/AdminCrudList'

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug (url-friendly)' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { key: 'content', label: 'Content', type: 'textarea' },
  { key: 'cover_image_url', label: 'Cover image URL' },
]

export default function AdminBlog() {
  return <AdminCrudList resource="blog" fields={fields} title="Blog Posts" />
}
