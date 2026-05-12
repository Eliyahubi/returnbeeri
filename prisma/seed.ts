import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await db.user.create({
    data: {
      email: 'admin@example.com',
      name: 'מנהל מערכת',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      phone: '+972501234567',
      isActive: true,
    }
  })
  console.log('Created admin user:', admin.email)

  // Create domain manager
  const managerPassword = await bcrypt.hash('manager123', 10)
  const manager = await db.user.create({
    data: {
      email: 'manager@example.com',
      name: 'ראש צוות',
      password: managerPassword,
      role: 'DOMAIN_MANAGER',
      phone: '+972502345678',
      isActive: true,
    }
  })
  console.log('Created domain manager:', manager.email)

  // Create regular users
  const userPassword = await bcrypt.hash('user123', 10)
  const users = await Promise.all([
    db.user.create({
      data: {
        email: 'user1@example.com',
        name: 'יוסי כהן',
        password: userPassword,
        role: 'TASK_OWNER',
        phone: '+972503456789',
        isActive: true,
      }
    }),
    db.user.create({
      data: {
        email: 'user2@example.com',
        name: 'שרה לוי',
        password: userPassword,
        role: 'TASK_OWNER',
        phone: '+972504567890',
        isActive: true,
      }
    }),
    db.user.create({
      data: {
        email: 'user3@example.com',
        name: 'דוד ישראלי',
        password: userPassword,
        role: 'TASK_OWNER',
        isActive: true,
      }
    })
  ])
  console.log('Created', users.length, 'regular users')

  // Create domains
  const domains = await Promise.all([
    db.domain.create({
      data: {
        name: 'לוגיסטיקה',
        description: 'ניהול שינוע ולוגיסטיקה',
        color: '#84cc16',
        managers: { connect: [{ id: manager.id }] }
      }
    }),
    db.domain.create({
      data: {
        name: 'דיור',
        description: 'סידור דיור זמני וקבוע',
        color: '#0ea5e9',
        managers: { connect: [{ id: manager.id }] }
      }
    }),
    db.domain.create({
      data: {
        name: 'רווחה',
        description: 'שירותי רווחה ותמיכה',
        color: '#f59e0b',
        managers: { connect: [{ id: admin.id }] }
      }
    }),
    db.domain.create({
      data: {
        name: 'חינוך',
        description: 'מערכת חינוך ומסגרות',
        color: '#8b5cf6',
        managers: { connect: [{ id: admin.id }] }
      }
    })
  ])
  console.log('Created', domains.length, 'domains')

  // Create sample tasks
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const twoWeeks = new Date(today)
  twoWeeks.setDate(twoWeeks.getDate() + 14)

  const tasks = await Promise.all([
    // High urgency tasks
    db.task.create({
      data: {
        title: 'סידור אבטחה למקומות הלינה',
        description: 'לוודא שכל מתחמי הלינה מאובטחים ויש שמירה 24/7',
        status: 'IN_PROGRESS',
        urgency: 'RED',
        dueDate: tomorrow,
        ownerId: users[0].id,
        domainId: domains[0].id,
        createdBy: admin.id,
        budget: 50000,
      }
    }),
    db.task.create({
      data: {
        title: 'הכנת מזון ל-1000 איש',
        description: 'לתאם עם ספקי מזון והתנדבות להכנת ארוחות',
        status: 'NOT_STARTED',
        urgency: 'RED',
        dueDate: tomorrow,
        ownerId: users[1].id,
        domainId: domains[0].id,
        createdBy: admin.id,
        budget: 25000,
      }
    }),
    
    // Medium urgency tasks
    db.task.create({
      data: {
        title: 'רישום ילדים למסגרות חינוך',
        description: 'לאסוף פרטים על ילדים ולרשום אותם למסגרות מתאימות',
        status: 'IN_PROGRESS',
        urgency: 'ORANGE',
        dueDate: nextWeek,
        ownerId: users[2].id,
        domainId: domains[3].id,
        createdBy: manager.id,
        budget: 10000,
      }
    }),
    db.task.create({
      data: {
        title: 'הקמת מרכזי תמיכה נפשית',
        description: 'לארגן צוותי תמיכה ולהכין מתחמי ייעוץ',
        status: 'NOT_STARTED',
        urgency: 'ORANGE',
        dueDate: nextWeek,
        ownerId: users[0].id,
        domainId: domains[2].id,
        createdBy: admin.id,
        budget: 30000,
      }
    }),

    // Regular tasks
    db.task.create({
      data: {
        title: 'תכנון דיור קבוע ל-50 משפחות',
        description: 'לאתר דירות מתאימות ולתאם מעבר',
        status: 'NOT_STARTED',
        urgency: 'GREEN',
        dueDate: twoWeeks,
        ownerId: users[1].id,
        domainId: domains[1].id,
        createdBy: admin.id,
        budget: 100000,
      }
    }),
    db.task.create({
      data: {
        title: 'הכנת מצגת למשקיעים',
        description: 'לסכם את פעילות הפרויקט והישגים',
        status: 'IN_PROGRESS',
        urgency: 'GREEN',
        dueDate: twoWeeks,
        ownerId: users[2].id,
        domainId: domains[2].id,
        createdBy: manager.id,
        budget: 5000,
      }
    }),

    // Completed task
    db.task.create({
      data: {
        title: 'רכישת ציוד רפואי בסיסי',
        description: 'רכישת ערכות עזרה ראשונה וציוד חירום',
        status: 'COMPLETED',
        urgency: 'GREEN',
        dueDate: today,
        completedAt: today,
        ownerId: users[0].id,
        domainId: domains[0].id,
        createdBy: admin.id,
        budget: 15000,
      }
    })
  ])
  console.log('Created', tasks.length, 'tasks')

  // Create task dependencies
  // Make "Planning housing" depend on "Security arrangement"
  await db.taskDependency.create({
    data: {
      taskId: tasks[4].id, // Planning housing
      dependsOnTaskId: tasks[0].id, // Security
    }
  })
  console.log('Created task dependency')

  // Create comments
  await Promise.all([
    db.comment.create({
      data: {
        content: 'התקדמנו ב-80%, נשאר רק לאשר את הספק האחרון',
        taskId: tasks[0].id,
        authorId: users[0].id,
      }
    }),
    db.comment.create({
      data: {
        content: 'ממתין לאישור תקציב',
        taskId: tasks[1].id,
        authorId: users[1].id,
      }
    }),
    db.comment.create({
      data: {
        content: 'נפגשנו עם רכזי החינוך, מתקדמים לפי לו"ז',
        taskId: tasks[2].id,
        authorId: users[2].id,
      }
    })
  ])
  console.log('Created comments')

  // Create notifications
  await Promise.all([
    db.notification.create({
      data: {
        type: 'TASK_ASSIGNED',
        title: 'משימה חדשה הוקצתה לך',
        message: 'הוקצתה לך משימה: סידור אבטחה למקומות הלינה',
        userId: users[0].id,
        taskId: tasks[0].id,
      }
    }),
    db.notification.create({
      data: {
        type: 'DEADLINE_APPROACHING',
        title: 'דeadline מתקרב',
        message: 'המשימה "הכנת מזון" צריכה להסתיים מחר',
        userId: users[1].id,
        taskId: tasks[1].id,
      }
    })
  ])
  console.log('Created notifications')

  // Create system settings
  await Promise.all([
    db.systemSetting.create({
      data: {
        key: 'notification_enabled',
        value: 'true'
      }
    }),
    db.systemSetting.create({
      data: {
        key: 'maintenance_mode',
        value: 'false'
      }
    })
  ])
  console.log('Created system settings')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
