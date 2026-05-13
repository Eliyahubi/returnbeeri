import { useSearchParams } from "react-router-dom";
import { TaskList } from "@/components/tasks/task-list";
import { DashboardStats } from "@/components/dashboard/stats";
import { DashboardFilters } from "@/components/dashboard/filters";
import { getDaysRemaining, formatDaysRemaining, getUrgencyFromDays } from "@/lib/utils";
import { mockTasks, mockDomains } from "@/lib/mock-data";
import { useAuth } from "@/components/providers/auth-provider";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") || undefined;
  const domainFilter = searchParams.get("domain") || undefined;
  const urgencyFilter = searchParams.get("urgency") || undefined;

  const filtered = mockTasks.filter((task) => {
    if (statusFilter && statusFilter !== "all" && task.status !== statusFilter) return false;
    if (domainFilter && domainFilter !== "all" && task.domainId !== domainFilter) return false;
    if (urgencyFilter && urgencyFilter !== "all") {
      const days = task.dueDate ? getDaysRemaining(task.dueDate) : null;
      const u = days !== null ? getUrgencyFromDays(days) : null;
      if (u !== urgencyFilter) return false;
    }
    return true;
  });

  const stats = {
    total: filtered.length,
    inProgress: filtered.filter((t) => t.status === "IN_PROGRESS").length,
    completed: filtered.filter((t) => t.status === "COMPLETED").length,
    late: filtered.filter((t) => {
      if (!t.dueDate) return false;
      return getDaysRemaining(t.dueDate) < 0 && t.status !== "COMPLETED";
    }).length,
  };

  const enhanced = filtered.map((task) => {
    const days = task.dueDate ? getDaysRemaining(task.dueDate) : null;
    return {
      ...task,
      daysRemaining: days,
      daysLabel: days !== null ? formatDaysRemaining(days) : null,
      isBlocked: false,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sand-800">שלום, {user?.name}</h1>
        <p className="text-sand-600 mt-1">הנה המשימות שלך להיום</p>
      </div>
      <DashboardStats stats={stats} />
      <DashboardFilters
        domains={mockDomains}
        currentFilters={{ status: statusFilter, domain: domainFilter, urgency: urgencyFilter }}
      />
      <div>
        <h2 className="text-lg font-medium text-sand-800 mb-4">המשימות שלי</h2>
        <TaskList tasks={enhanced} emptyMessage="אין משימות להצגה" />
      </div>
    </div>
  );
}
