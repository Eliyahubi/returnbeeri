import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { DashboardNav } from '@/components/dashboard/nav'
import { UserNav } from '@/components/dashboard/user-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-sand-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <DashboardNav userRole={session.user.role} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-sand-600 hidden sm:inline">
              {session.user.name}
            </span>
            <UserNav user={session.user} />
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
