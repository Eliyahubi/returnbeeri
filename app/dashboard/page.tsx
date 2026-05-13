import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { TaskList } from '@/components/tasks/task-list'
import { DashboardStats } from '@/components/dashboard/stats'
import { DashboardFilters } from '@/components/dashboard/filters'
import { getDaysRemaining, formatDaysRemaining, getUrgencyFromDays } from '@/lib/utils'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return null
  }

  const statusFilter = searchParams.status as string | undefined
  const domainFilter = searchParams.domain as string | undefined
  const urgencyFilter = searchParams.urgency as string | undefined

  // Build where clause for tasks
  const where: any = {
    ownerId: session.user.id,
  }

  if (statusFilter && statusFilter !== 'all') {
    where.status = statusFilter
  }

  if (domainFilter && domainFilter !== 'all') {
    where.domainId = domainFilter
  }

  if (urgencyFilter && urgencyFilter !== 'all') {
    where.urgency = urgencyFilter
  }

  // Fetch user's tasks
  const tasks = await db.task.findMany({
    where,
    include: {
      domain: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      dependencies: {
        include: {
          dependsOnTask: {
            select: {
              id: true,
              title: true,
              status: true,
            }
          }
        }
      },
      _count: {
        select: {
          comments: true,
          attachments: true,
        }
      }
    },
    orderBy: [
      { urgency: 'desc' },
      { dueDate: 'asc' },
    ],
  })

  // Fetch all domains for filter
  const domains = await db.domain.findMany({
    orderBy: { name: 'asc' }
  })

  // Calculate stats
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    late: tasks.filter(t => {
      if (!t.dueDate) return false
      const daysRemaining = getDaysRemaining(t.dueDate)
      return daysRemaining < 0 && t.status !== 'COMPLETED'
    }).length,
  }

  // Enhance tasks with computed fields
  const enhancedTasks = tasks.map(task => {
    const daysRemaining = task.dueDate ? getDaysRemaining(task.dueDate) : null
    const isBlocked = task.dependencies.some(d => 
      d.dependsOnTask.status !== 'COMPLETED'
    )
    
    return {
      ...task,
      daysRemaining,
      daysLabel: daysRemaining !== null ? formatDaysRemaining(daysRemaining) : null,
      isBlocked,
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-sand-800">
          שלום, {session.user.name}
        </h1>
        <p className="text-sand-600 mt-1">
          הנה המשימות שלך להיום
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Filters */}
      <DashboardFilters 
        domains={domains}
        currentFilters={{
          status: statusFilter,
          domain: domainFilter,
          urgency: urgencyFilter,
        }}
      />

      {/* Task List */}
      <div>
        <h2 className="text-lg font-medium text-sand-800 mb-4">
          המשימות שלי
        </h2>
        <TaskList 
          tasks={enhancedTasks} 
          emptyMessage="אין משימות להצגה"
        />
      </div>
    </div>
  )
}
