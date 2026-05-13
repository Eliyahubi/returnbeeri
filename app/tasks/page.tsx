import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { TaskList } from '@/components/tasks/task-list'
import { getDaysRemaining, formatDaysRemaining } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const statusFilter = searchParams.status as string | undefined
  const domainFilter = searchParams.domain as string | undefined

  const where: any = {}
  
  // Regular users only see their own tasks
  if (session.user.role === 'TASK_OWNER') {
    where.ownerId = session.user.id
  }

  if (statusFilter && statusFilter !== 'all') {
    where.status = statusFilter
  }

  if (domainFilter && domainFilter !== 'all') {
    where.domainId = domainFilter
  }

  const tasks = await db.task.findMany({
    where,
    include: {
      domain: true,
      owner: { select: { id: true, name: true, email: true } },
      dependencies: {
        include: {
          dependsOnTask: { select: { id: true, title: true, status: true } }
        }
      },
      _count: { select: { comments: true, attachments: true } }
    },
    orderBy: [{ urgency: 'desc' }, { dueDate: 'asc' }]
  })

  const domains = await db.domain.findMany({ orderBy: { name: 'asc' } })

  // Enhance tasks with computed fields
  const enhancedTasks = tasks.map(task => {
    const daysRemaining = task.dueDate ? getDaysRemaining(task.dueDate) : null
    const isBlocked = task.dependencies.some(d => d.dependsOnTask.status !== 'COMPLETED')
    
    return {
      ...task,
      daysRemaining,
      daysLabel: daysRemaining !== null ? formatDaysRemaining(daysRemaining) : null,
      isBlocked,
    }
  })

  const canCreateTask = ['SUPER_ADMIN', 'DOMAIN_MANAGER'].includes(session.user.role)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sand-800">כל המשימות</h1>
          <p className="text-sand-600 mt-1">
            {tasks.length} משימות בסה"כ
          </p>
        </div>
        {canCreateTask && (
          <Link
            href="/tasks/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            משימה חדשה
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter || 'all'}
          onChange={(e) => {
            const value = e.target.value
            const url = new URL('/tasks', window.location.origin)
            if (value !== 'all') url.searchParams.set('status', value)
            if (domainFilter && domainFilter !== 'all') url.searchParams.set('domain', domainFilter)
            window.location.href = url.toString()
          }}
          className="px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="NOT_STARTED">לא התחיל</option>
          <option value="IN_PROGRESS">בתקופה</option>
          <option value="COMPLETED">הושלם</option>
          <option value="BLOCKED">חסום</option>
        </select>

        <select
          value={domainFilter || 'all'}
          onChange={(e) => {
            const value = e.target.value
            const url = new URL('/tasks', window.location.origin)
            if (statusFilter && statusFilter !== 'all') url.searchParams.set('status', statusFilter)
            if (value !== 'all') url.searchParams.set('domain', value)
            window.location.href = url.toString()
          }}
          className="px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
        >
          <option value="all">כל התחומים</option>
          {domains.map(domain => (
            <option key={domain.id} value={domain.id}>{domain.name}</option>
          ))}
        </select>
      </div>

      <TaskList tasks={enhancedTasks} />
    </div>
  )
}
