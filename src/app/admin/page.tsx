'use client'

import { AuthGuard } from '@/components/admin/AuthGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DashboardOverview } from '@/components/admin/DashboardOverview'

export default function AdminDashboardPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <DashboardOverview />
      </AdminLayout>
    </AuthGuard>
  )
}