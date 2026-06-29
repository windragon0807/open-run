import AdminPage from '@components/admin/AdminPage'
import AdminAuthGuard from '@components/admin/AdminAuthGuard'

export default function Page() {
  return (
    <AdminAuthGuard>
      <AdminPage />
    </AdminAuthGuard>
  )
}
