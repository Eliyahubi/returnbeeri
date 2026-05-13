import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getDaysRemaining(dueDate: Date | string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDaysRemaining(days: number): string {
  if (days > 0) return `${days} ימים נותרו`;
  if (days === 0) return "היום";
  return `${Math.abs(days)} ימים באיחור`;
}

export function getUrgencyFromDays(days: number): "GREEN" | "ORANGE" | "RED" {
  if (days < 0) return "RED";
  if (days <= 3) return "ORANGE";
  return "GREEN";
}

export const urgencyDotColors: Record<string, string> = {
  GREEN: "bg-lime-400",
  ORANGE: "bg-orange-400",
  RED: "bg-red-400",
};

export const statusLabels: Record<string, string> = {
  NOT_STARTED: "לא התחיל",
  IN_PROGRESS: "בתהליך",
  COMPLETED: "הושלם",
  BLOCKED: "חסום",
  LATE: "באיחור",
};

export const urgencyLabels: Record<string, string> = {
  GREEN: "רגיל",
  ORANGE: "דחוף",
  RED: "קריטי",
};

export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "מנהל פרויקט",
  DOMAIN_MANAGER: "ראש צוות",
  TASK_OWNER: "משתמש",
  VIEWER: "צופה בלבד",
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(amount);
}
