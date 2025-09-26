'use client'

import { AuthGuard } from '@/components/admin/AuthGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MenuItemsManager } from '@/components/admin/MenuItemsManager'

export default function MenuItemsPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <MenuItemsManager />
      </AdminLayout>
    </AuthGuard>
  )
}