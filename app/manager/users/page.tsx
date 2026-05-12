import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { roleLabels } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function UsersManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !['SUPER_ADMIN', 'DOMAIN_MANAGER'].includes(session.user.role)) {
    redirect('/dashboard')
  }

  const users = await db.user.findMany({
    include: {
      assignedDomains: { select: { id: true, name: true } },
      _count: {
        select: { ownedTasks: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sand-800">ניהול משתמשים</h1>
          <p className="text-sand-600 mt-1">
            הוספה, עריכה וניהול משתמשי המערכת
          </p>
        </div>
        <Link
          href="/manager/users/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          משתמש חדש
        </Link>
      </div>

      <div className="calm-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-100">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">
                  שם
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">
                  אימייל
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">
                  תפקיד
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">
                  תחומים
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">
                  משימות
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">
                  סטטוס
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-sand-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-sand-800">
                      {user.name}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-sand-500">
                        {user.phone}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sand-600">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-sage-100 text-sage-700 text-xs rounded-full">
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {user.assignedDomains.map((domain) => (
                        <span 
                          key={domain.id}
                          className="text-xs px-2 py-0.5 bg-sand-100 text-sand-600 rounded-full"
                        >
                          {domain.name}
                        </span>
                      ))}
                      {user.assignedDomains.length === 0 && (
                        <span className="text-xs text-sand-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sand-600">
                    {user._count.ownedTasks}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-sage-100 text-sage-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.isActive ? 'bg-sage-500' : 'bg-red-500'
                      }`} />
                      {user.isActive ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
