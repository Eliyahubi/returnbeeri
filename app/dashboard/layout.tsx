'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { UserNav } from '@/components/dashboard/user-nav'
import { useAuth } from '@/components/providers/auth-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-sand-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <DashboardNav userRole={user.role} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-sand-600 hidden sm:inline">
              {user.name}
            </span>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
