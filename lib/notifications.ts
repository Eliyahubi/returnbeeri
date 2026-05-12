import twilio from 'twilio'
import { db } from './db'

// Initialize Twilio client (if credentials are available)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

const twilioPhone = process.env.TWILIO_PHONE_NUMBER

interface NotificationPayload {
  type: string
  title: string
  message: string
  userId: string
  taskId?: string
}

// Send notification (WhatsApp preferred, with in-app fallback)
export async function sendNotification(payload: NotificationPayload) {
  // Always create in-app notification
  const notification = await db.notification.create({
    data: {
      type: payload.type as any,
      title: payload.title,
      message: payload.message,
      userId: payload.userId,
      taskId: payload.taskId,
      sentVia: 'in_app',
    }
  })

  // Try to send WhatsApp if user has phone and Twilio is configured
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { phone: true, name: true }
  })

  if (user?.phone && twilioClient && twilioPhone) {
    try {
      await twilioClient.messages.create({
        body: `🏠 פרויקט החזרה הביתה\n\n${payload.title}\n\n${payload.message}`,
        from: `whatsapp:${twilioPhone}`,
        to: `whatsapp:${user.phone}`,
      })

      // Update notification as sent via WhatsApp
      await db.notification.update({
        where: { id: notification.id },
        data: { 
          sentVia: 'whatsapp',
          sentAt: new Date()
        }
      })
    } catch (error) {
      console.error('WhatsApp notification failed:', error)
      // Notification remains as in-app only
    }
  }

  return notification
}

// Send bulk notification to multiple users
export async function sendBulkNotification(
  userIds: string[],
  payload: Omit<NotificationPayload, 'userId'>
) {
  const notifications = await Promise.all(
    userIds.map(userId =>
      sendNotification({ ...payload, userId })
    )
  )
  return notifications
}

// Send notification to all users in a domain
export async function sendDomainNotification(
  domainId: string,
  payload: Omit<NotificationPayload, 'userId'>
) {
  const domain = await db.domain.findUnique({
    where: { id: domainId },
    include: {
      managers: { select: { id: true } }
    }
  })

  if (!domain) return []

  const userIds = domain.managers.map(m => m.id)
  return sendBulkNotification(userIds, payload)
}

// Send notification to all users
export async function sendGlobalNotification(
  payload: Omit<NotificationPayload, 'userId'>
) {
  const users = await db.user.findMany({
    where: { isActive: true },
    select: { id: true }
  })

  const userIds = users.map(u => u.id)
  return sendBulkNotification(userIds, payload)
}

// Check for approaching deadlines and send reminders
export async function checkDeadlineReminders() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  // Find tasks due tomorrow that aren't completed
  const tasksDueTomorrow = await db.task.findMany({
    where: {
      dueDate: {
        gte: tomorrow,
        lt: dayAfterTomorrow
      },
      status: { not: 'COMPLETED' }
    },
    include: {
      owner: { select: { id: true, name: true, phone: true } }
    }
  })

  // Send reminders
  for (const task of tasksDueTomorrow) {
    await sendNotification({
      type: 'DEADLINE_APPROACHING',
      title: 'תזכורת: המשימה נכנסת למחר',
      message: `המשימה "${task.title}" צריכה להיות מושלמת מחר`,
      userId: task.ownerId,
      taskId: task.id,
    })
  }

  return tasksDueTomorrow.length
}
