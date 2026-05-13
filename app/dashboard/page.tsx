'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { TaskList } from '@/components/tasks/task-list'
import { DashboardStats } from '@/components/dashboard/stats'
import { DashboardFilters } from '@/components/dashboard/filters'
import { getDaysRemaining, formatDaysRemaining, getUrgencyFromDays } from '@/lib/utils'
import { mockTasks, mockDomains } from '@/lib/mock-data'
import { useAuth } from '@/components/providers/auth-provider'

export default function DashboardPage() {
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
  const urgencyFilter = searchParams.get('urgency') as string | undefined

  // Filter tasks based on user role and filters
  const filteredTasks = tasks.filter(task => {
    // Users only see their own tasks
    if (task.assignedToId !== user?.id) {
      return false
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all' && task.status !== statusFilter) {
      return false
    }
    
    // Apply domain filter
    if (domainFilter && domainFilter !== 'all' && task.domainId !== domainFilter) {
      return false
    }
    
    // Apply urgency filter
    if (urgencyFilter && urgencyFilter !== 'all') {
      const daysRemaining = task.dueDate ? getDaysRemaining(task.dueDate) : null
      const urgency = daysRemaining !== null ? getUrgencyFromDays(daysRemaining) : null
      if (urgency !== urgencyFilter) {
        return false
      }
    }
    
    return true
  })

  // Calculate stats
  const stats = {
    total: filteredTasks.length,
    inProgress: filteredTasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: filteredTasks.filter(t => t.status === 'COMPLETED').length,
    late: filteredTasks.filter(t => {
      if (!t.dueDate) return false
      const daysRemaining = getDaysRemaining(t.dueDate)
      return daysRemaining < 0 && t.status !== 'COMPLETED'
    }).length,
  }

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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-sand-800">
          שלום, {user.name}
        </h1>
        <p className="text-sand-600 mt-1">
          הנה המשימות שלך להיום
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Filters */}
      <DashboardFilters 
        domains={mockDomains}
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
