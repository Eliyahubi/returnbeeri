import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/domains - List domains
export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const domains = await db.domain.findMany({
      include: {
        managers: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(domains)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json(
      { error: 'Failed to fetch domains' }, 
      { status: 500 }
    )
  }
}

// POST /api/domains - Create domain
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only admins and managers can create domains
  if (!['SUPER_ADMIN', 'DOMAIN_MANAGER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name, description, color, managerIds } = body

    const domain = await db.domain.create({
      data: {
        name,
        description,
        color: color || '#84cc16',
        managers: managerIds?.length > 0 ? {
          connect: managerIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        managers: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(domain, { status: 201 })
  } catch (error) {
    console.error('Error creating domain:', error)
    return NextResponse.json(
      { error: 'Failed to create domain' }, 
      { status: 500 }
    )
  }
}
