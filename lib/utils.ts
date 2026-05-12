import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to Hebrew locale
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Calculate days remaining (positive = days left, negative = days late)
export function getDaysRemaining(dueDate: Date | string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Format days remaining for display
export function formatDaysRemaining(days: number): string {
  if (days > 0) {
    return `${days} ימים נותרו`
  } else if (days === 0) {
    return 'היום'
  } else {
    return `${Math.abs(days)} ימים באיחור`
  }
}

// Get urgency based on days remaining
export function getUrgencyFromDays(days: number): 'GREEN' | 'ORANGE' | 'RED' {
  if (days < 0) return 'RED'
  if (days <= 3) return 'ORANGE'
  return 'GREEN'
}

// Color mapping for urgency
export const urgencyColors = {
  GREEN: 'bg-lime-100 text-lime-800 border-lime-200',
  ORANGE: 'bg-orange-100 text-orange-800 border-orange-200',
  RED: 'bg-red-100 text-red-800 border-red-200',
}

export const urgencyDotColors = {
  GREEN: 'bg-lime-400',
  ORANGE: 'bg-orange-400',
  RED: 'bg-red-400',
}

// Color mapping for status
export const statusColors = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-700',
  COMPLETED: 'bg-sage-100 text-sage-700',
  BLOCKED: 'bg-red-100 text-red-700',
  LATE: 'bg-red-100 text-red-700',
}

// Status labels in Hebrew
export const statusLabels: Record<string, string> = {
  NOT_STARTED: 'לא התחיל',
  IN_PROGRESS: 'בתקופה',
  COMPLETED: 'הושלם',
  BLOCKED: 'חסום',
  LATE: 'באיחור',
}

export const urgencyLabels: Record<string, string> = {
  GREEN: 'רגיל',
  ORANGE: 'דחוף',
  RED: 'קריטי',
}

// Role labels in Hebrew
export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'מנהל פרויקט',
  DOMAIN_MANAGER: 'ראש צוות',
  TASK_OWNER: 'משתמש',
  VIEWER: 'צופה בלבד',
}

// Format currency (Shekels)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(amount)
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
