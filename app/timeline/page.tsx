'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate, getDaysRemaining, statusLabels } from '@/lib/utils'
import { mockTasks } from '@/lib/mock-data'
import { useAuth } from '@/components/providers/auth-provider'

export default function TimelinePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState(mockTasks)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Filter tasks based on user role
  const filteredTasks = tasks.filter(task => {
    // Regular users only see their own tasks
    if (user?.role === 'TASK_OWNER') {
      return task.assignedToId === user.id
    }
    return true
  })

  // Group tasks by status
  const groupedTasks = {
    NOT_STARTED: filteredTasks.filter(t => t.status === 'NOT_STARTED'),
    IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
    COMPLETED: filteredTasks.filter(t => t.status === 'COMPLETED'),
    BLOCKED: filteredTasks.filter(t => t.status === 'BLOCKED'),
  }

  // Calculate timeline metrics
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED').length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Find milestones
  const milestones = filteredTasks.filter(t => t.isMilestone)

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sand-800">
          ציר זמן ותלויות
        </h1>
        <p className="text-sand-600 mt-1">
          סקירה ויזואלית של כל המשימות והתלויות ביניהן
        </p>
      </div>

      {/* Progress Overview */}
      <div className="calm-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-sand-800">התקדמות הפרויקט</h2>
          <span className="text-2xl font-bold text-sage-700">{progress}%</span>
        </div>
        <div className="w-full bg-sand-200 rounded-full h-3">
          <div 
            className="bg-sage-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-sand-500">
          <span>{completedTasks} הושלמו</span>
          <span>מתוך {totalTasks} משימות</span>
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="calm-card">
          <h2 className="text-lg font-medium text-sand-800 mb-4">אבני דרך</h2>
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id}
                className="flex items-center gap-4 p-3 bg-sage-50 rounded-lg border border-sage-200"
              >
                <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center">
                  <span className="text-sage-700 font-bold">★</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sand-800">{milestone.title}</h3>
                  <p className="text-sm text-sand-500">
                    {milestone.dueDate ? formatDate(milestone.dueDate) : 'ללא תאריך'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  milestone.status === 'COMPLETED' 
                    ? 'bg-sage-100 text-sage-700' 
                    : 'bg-sky-100 text-sky-700'
                }`}>
                  {statusLabels[milestone.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline by Status */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => {
          if (statusTasks.length === 0) return null
          
          return (
            <div key={status} className="calm-card">
              <h2 className="text-lg font-medium text-sand-800 mb-4 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  status === 'COMPLETED' ? 'bg-sage-400' :
                  status === 'IN_PROGRESS' ? 'bg-sky-400' :
                  status === 'BLOCKED' ? 'bg-red-400' :
                  'bg-gray-400'
                }`} />
                {statusLabels[status]}
                <span className="text-sm font-normal text-sand-500">
                  ({statusTasks.length})
                </span>
              </h2>
              
              <div className="space-y-3">
                {statusTasks.map((task) => {
                  const daysRemaining = task.dueDate ? getDaysRemaining(task.dueDate) : null
                  
                  return (
                    <div 
                      key={task.id}
                      className="flex items-center gap-4 p-3 bg-sand-50 rounded-lg"
                    >
                      <div 
                        className="w-3 h-12 rounded-full bg-sage-300"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sand-800 truncate">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-sand-500 mt-1">
                          <span>{task.assignee.name}</span>
                          {task.domain && (
                            <span>{task.domain.name}</span>
                          )}
                          {task.dueDate && (
                            <span className={daysRemaining !== null && daysRemaining < 0 ? 'text-red-600 font-medium' : ''}>
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                        {task.dependencies.length > 0 && (
                          <div className="mt-2 text-xs text-sand-500">
                            תלוי ב: אין תלויות
                          </div>
                        )}
                      </div>

                      {false && (
                        <div className="text-sm text-sand-600">
                          ₪0
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {tasks.length === 0 && (
        <div className="calm-card p-8 text-center">
          <p className="text-sand-500">אין משימות להצגה בציר הזמן</p>
        </div>
      )}
    </div>
  )
}
