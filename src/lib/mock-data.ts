// Mock data — used until Lovable Cloud DB is wired up.
import { getDaysRemaining, getUrgencyFromDays } from "./utils";

const buildTask = (t: {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate: Date;
  ownerId: string;
  ownerName: string;
  domainId: string;
  domainName: string;
  domainColor: string;
  isMilestone?: boolean;
}) => {
  const days = getDaysRemaining(t.dueDate);
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? "",
    status: t.status,
    urgency: getUrgencyFromDays(days),
    dueDate: t.dueDate,
    assignedToId: t.ownerId,
    domainId: t.domainId,
    isMilestone: t.isMilestone ?? false,
    owner: { id: t.ownerId, name: t.ownerName },
    assignee: { id: t.ownerId, name: t.ownerName },
    domain: { id: t.domainId, name: t.domainName, color: t.domainColor },
    dependencies: [] as any[],
    _count: { comments: 0, attachments: 0 },
    budget: null as number | null,
  };
};

export const mockTasks = [
  buildTask({
    id: "1",
    title: "התקנת מזגן בסלון",
    description: "יש להתקין מזגן חדש בסלון הראשי",
    status: "NOT_STARTED",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    ownerId: "1",
    ownerName: "מנהל מערכת",
    domainId: "1",
    domainName: "תחזוקה",
    domainColor: "#76a176",
  }),
  buildTask({
    id: "2",
    title: "תיקון ברז במטבח",
    description: "הברז במטבח דולף וצריך תיקון",
    status: "IN_PROGRESS",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    ownerId: "1",
    ownerName: "מנהל מערכת",
    domainId: "1",
    domainName: "תחזוקה",
    domainColor: "#76a176",
  }),
  buildTask({
    id: "3",
    title: "ארגון אירוע קהילתי",
    description: "ארגון אירוע חג לדיירי הבניין",
    status: "NOT_STARTED",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    ownerId: "1",
    ownerName: "מנהל מערכת",
    domainId: "2",
    domainName: "אירועים",
    domainColor: "#38bdf8",
    isMilestone: true,
  }),
];

export const mockDomains = [
  { id: "1", name: "תחזוקה", color: "#76a176" },
  { id: "2", name: "אירועים", color: "#38bdf8" },
  { id: "3", name: "ניקיון", color: "#fb923c" },
];

export const mockUsers = [
  {
    id: "1",
    name: "מנהל מערכת",
    email: "admin@example.com",
    role: "SUPER_ADMIN",
    isActive: true,
    phone: "0501234567",
  },
  {
    id: "2",
    name: "דני כהן",
    email: "dani@example.com",
    role: "DOMAIN_MANAGER",
    isActive: true,
    phone: "0507654321",
  },
  {
    id: "3",
    name: "שרה לוי",
    email: "sara@example.com",
    role: "TASK_OWNER",
    isActive: true,
    phone: "0509876543",
  },
];
