import AdminCrudList from '../../components/AdminCrudList'

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'specializations', label: 'Specializations' },
  { key: 'experience_years', label: 'Experience (years)', type: 'number' },
  { key: 'languages', label: 'Languages' },
  { key: 'avatar_initials', label: 'Avatar initials' },
  { key: 'is_online', label: 'Online', type: 'boolean' },
]

export default function AdminAstrologer() {
  return (
    <AdminCrudList
      resource="astrologers"
      fields={fields}
      title="Astrologer Profile"
      allowCreate={false}
      allowDelete={false}
    />
  )
}
