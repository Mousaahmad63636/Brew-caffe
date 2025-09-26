'use client'

import { AuthGuard } from '@/components/admin/AuthGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MenuItemForm } from '@/components/admin/MenuItemForm'

export default function AddMenuItemPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-slate-900 mb-2">
              Add New Menu Item
            </h1>
            <p className="text-slate-600">
              Create a new menu item for your restaurant
            </p>
          </div>
          
          <MenuItemForm />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}