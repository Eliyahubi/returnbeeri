'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { TaskList } from '@/components/tasks/task-list'
import { getDaysRemaining, formatDaysRemaining } from '@/lib/utils'
import { mockTasks, mockDomains } from '@/lib/mock-data'
import { useAuth } from '@/components/providers/auth-provider'
import Link from 'next/link'
import { Plus } from 'lucide-react'

function TasksPageContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState(mockTasks)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const statusFilter = searchParams.get('status') as string | undefined
  const domainFilter = searchParams.get('domain') as string | undefined

  // Filter tasks based on user role and filters
  const filteredTasks = tasks.filter(task => {
    // Regular users only see their own tasks
    if (user?.role === 'TASK_OWNER') {
      return task.assignedToId === user.id
    }
    
    // Apply status filter
    if (statusFilter && task.status !== statusFilter) {
      return false
    }
    
    // Apply domain filter
    if (domainFilter && task.domainId !== domainFilter) {
      return false
    }
    
    return true
  })

  // Enhance tasks with computed fields
  const enhancedTasks = filteredTasks.map(task => {
    const daysRemaining = task.dueDate ? getDaysRemaining(task.dueDate) : null
    const isBlocked = false // Mock data doesn't have dependencies
    
    return {
      ...task,
      daysRemaining,
      daysLabel: daysRemaining !== null ? formatDaysRemaining(daysRemaining) : null,
      isBlocked,
    }
  })

  const canCreateTask = user && ['SUPER_ADMIN', 'DOMAIN_MANAGER'].includes(user.role)

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sand-800">כל המשימות</h1>
          <p className="text-sand-600 mt-1">
            {filteredTasks.length} משימות בסה"כ
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
          {mockDomains.map(domain => (
            <option key={domain.id} value={domain.id}>{domain.name}</option>
          ))}
        </select>
      </div>

      <TaskList tasks={enhancedTasks} />
    </div>
  )
}

export default function TasksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    }>
      <TasksPageContent />
    </Suspense>
  )
}
