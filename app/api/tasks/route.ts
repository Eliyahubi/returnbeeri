import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'

// GET /api/tasks - List tasks
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const domain = searchParams.get('domain')
  const owner = searchParams.get('owner')

  const where: any = {}
  
  if (status) where.status = status
  if (domain) where.domainId = domain
  if (owner) where.ownerId = owner

  // Regular users can only see their own tasks or tasks in their domains
  if (session.user.role === 'TASK_OWNER') {
    where.ownerId = session.user.id
  }

  try {
    const tasks = await db.task.findMany({
      where,
      include: {
        domain: true,
        owner: {
          select: { id: true, name: true, email: true }
        },
        dependencies: {
          include: {
            dependsOnTask: {
              select: { id: true, title: true, status: true }
            }
          }
        },
        _count: {
          select: { comments: true, attachments: true }
        }
      },
      orderBy: [
        { urgency: 'desc' },
        { dueDate: 'asc' }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' }, 
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only admins and managers can create tasks
  if (!['SUPER_ADMIN', 'DOMAIN_MANAGER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      title,
      description,
      ownerId,
      domainId,
      status,
      urgency,
      startDate,
      dueDate,
      budget,
      isMilestone,
      dependencyIds,
    } = body

    const task = await db.task.create({
      data: {
        title,
        description,
        ownerId,
        domainId,
        status: status || 'NOT_STARTED',
        urgency: urgency || 'GREEN',
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        budget,
        isMilestone: isMilestone || false,
        createdBy: session.user.id,
        dependencies: dependencyIds?.length > 0 ? {
          create: dependencyIds.map((depId: string) => ({
            dependsOnTaskId: depId
          }))
        } : undefined
      },
      include: {
        domain: true,
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create notification for task owner
    await db.notification.create({
      data: {
        type: 'TASK_ASSIGNED',
        title: 'משימה חדשה הוקצתה אליך',
        message: `המשימה "${title}" הוקצתה אליך`,
        userId: ownerId,
        taskId: task.id,
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' }, 
      { status: 500 }
    )
  }
}
