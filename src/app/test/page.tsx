'use client'

import { FirebaseTestSuite } from '@/components/admin/FirebaseTestSuite'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <FirebaseTestSuite />
    </div>
  )
}