import AdminCrudList from '../../components/AdminCrudList'

const fields = [
  { key: 'zodiac_sign', label: 'Zodiac sign' },
  { key: 'period', label: 'Period (daily/weekly/monthly)' },
  { key: 'love_text', label: 'Love', type: 'textarea' },
  { key: 'career_text', label: 'Career', type: 'textarea' },
  { key: 'finance_text', label: 'Finance', type: 'textarea' },
  { key: 'health_text', label: 'Health', type: 'textarea' },
  { key: 'travel_text', label: 'Travel', type: 'textarea' },
  { key: 'remedies_text', label: 'Notes', type: 'textarea' },
]

export default function AdminHoroscopes() {
  return <AdminCrudList resource="horoscopes" fields={fields} title="Horoscopes" allowCreate={false} allowDelete={false} />
}
