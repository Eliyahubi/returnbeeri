import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const task = await db.task.findUnique({
      where: { id: params.id },
      include: {
        domain: true,
        owner: {
          select: { id: true, name: true, email: true, phone: true }
        },
        dependencies: {
          include: {
            dependsOnTask: {
              select: { id: true, title: true, status: true }
            }
          }
        },
        dependents: {
          include: {
            task: {
              select: { id: true, title: true, status: true }
            }
          }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: true,
        subTasks: {
          select: { id: true, title: true, status: true }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user can view this task
    if (session.user.role === 'TASK_OWNER' && task.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' }, 
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const existingTask = await db.task.findUnique({
      where: { id: params.id },
      select: { ownerId: true, status: true, title: true }
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check permissions
    const canEdit = 
      session.user.role === 'SUPER_ADMIN' || 
      session.user.role === 'DOMAIN_MANAGER' ||
      existingTask.ownerId === session.user.id

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status, ...otherData } = body

    // If marking as completed, check dependencies
    if (status === 'COMPLETED') {
      const incompleteDependencies = await db.taskDependency.findMany({
        where: {
          taskId: params.id,
          dependsOnTask: {
            status: { not: 'COMPLETED' }
          }
        }
      })

      if (incompleteDependencies.length > 0) {
        return NextResponse.json(
          { error: 'Cannot complete task - dependencies not finished' }, 
          { status: 400 }
        )
      }
    }

    const task = await db.task.update({
      where: { id: params.id },
      data: {
        ...otherData,
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        domain: true,
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create notification for status change
    if (status && status !== existingTask.status) {
      await db.notification.create({
        data: {
          type: 'STATUS_CHANGED',
          title: 'סטטוס משימה השתנה',
          message: `המשימה "${existingTask.title}" שונתה ל-${status}`,
          userId: task.ownerId,
          taskId: task.id,
        }
      })

      // Notify dependent task owners
      const dependents = await db.taskDependency.findMany({
        where: { dependsOnTaskId: params.id },
        include: { task: { select: { ownerId: true } } }
      })

      if (status === 'COMPLETED') {
        for (const dep of dependents) {
          await db.notification.create({
            data: {
              type: 'DEPENDENCY_RELEASED',
              title: 'תלות שוחררה',
              message: `המשימה "${existingTask.title}" הושלמה - המשימה שלך יכולה להתחיל`,
              userId: dep.task.ownerId,
              taskId: dep.taskId,
            }
          })
        }
      }
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only admins and managers can delete tasks
  if (!['SUPER_ADMIN', 'DOMAIN_MANAGER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await db.task.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' }, 
      { status: 500 }
    )
  }
}
