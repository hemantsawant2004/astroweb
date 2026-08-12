import AdminCrudList from '../../components/AdminCrudList'

const fields = [
  { key: 'question', label: 'Question', type: 'textarea' },
  { key: 'answer', label: 'Answer', type: 'textarea' },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
]

export default function AdminFaqs() {
  return <AdminCrudList resource="faqs" fields={fields} title="FAQs" />
}
