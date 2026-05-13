// Mock data for static deployment
export const mockTasks = [
  {
    id: '1',
    title: 'התקנת מזגן בסלון',
    description: 'יש להתקין מזגן חדש בסלון הראשי',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: new Date('2024-12-20'),
    assignedToId: '1',
    domainId: '1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    isBlocked: false,
    isMilestone: false,
    assignee: {
      id: '1',
      name: 'מנהל מערכת',
      email: 'admin@example.com'
    },
    domain: {
      id: '1',
      name: 'תחזוקה'
    },
    dependencies: [],
    comments: []
  },
  {
    id: '2',
    title: 'תיקון ברז במטבח',
    description: 'הברז במטבח דולף וצריך תיקון',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: new Date('2024-12-18'),
    assignedToId: '2',
    domainId: '1',
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-10'),
    isBlocked: false,
    isMilestone: false,
    assignee: {
      id: '2',
      name: 'דני כהן',
      email: 'dani@example.com'
    },
    domain: {
      id: '1',
      name: 'תחזוקה'
    },
    dependencies: [],
    comments: []
  },
  {
    id: '3',
    title: 'ארגון אירוע קהילתי',
    description: 'ארגון אירוע חג לדיירי הבניין',
    status: 'TODO',
    priority: 'LOW',
    dueDate: new Date('2024-12-25'),
    assignedToId: '3',
    domainId: '2',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    isBlocked: true,
    isMilestone: true,
    assignee: {
      id: '3',
      name: 'שרה לוי',
      email: 'sara@example.com'
    },
    domain: {
      id: '2',
      name: 'אירועים'
    },
    dependencies: [],
    comments: []
  }
]

export const mockDomains = [
  {
    id: '1',
    name: 'תחזוקה',
    description: 'עבודות תחזוקה שוטפות',
    isActive: true,
    color: '#10b981',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '2',
    name: 'אירועים',
    description: 'ארגון אירועים קהילתיים',
    isActive: true,
    color: '#3b82f6',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '3',
    name: 'ניקיון',
    description: 'עבודות ניקיון כלליות',
    isActive: true,
    color: '#f59e0b',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  }
]

export const mockUsers = [
  {
    id: '1',
    name: 'מנהל מערכת',
    email: 'admin@example.com',
    role: 'SUPER_ADMIN',
    isActive: true,
    phone: '0501234567',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '2',
    name: 'דני כהן',
    email: 'dani@example.com',
    role: 'DOMAIN_MANAGER',
    isActive: true,
    phone: '0507654321',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '3',
    name: 'שרה לוי',
    email: 'sara@example.com',
    role: 'VOLUNTEER',
    isActive: true,
    phone: '0509876543',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  }
]
