import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { TaskList } from "@/components/tasks/task-list";
import { getDaysRemaining, formatDaysRemaining } from "@/lib/utils";
import { mockTasks, mockDomains } from "@/lib/mock-data";
import { useAuth } from "@/components/providers/auth-provider";

export default function Tasks() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || undefined;
  const domainFilter = searchParams.get("domain") || undefined;

  const filtered = mockTasks.filter((task) => {
    if (user?.role === "TASK_OWNER" && task.assignedToId !== user.id) return false;
    if (statusFilter && task.status !== statusFilter) return false;
    if (domainFilter && task.domainId !== domainFilter) return false;
    return true;
  });

  const enhanced = filtered.map((task) => {
    const days = task.dueDate ? getDaysRemaining(task.dueDate) : null;
    return {
      ...task,
      daysRemaining: days,
      daysLabel: days !== null ? formatDaysRemaining(days) : null,
      isBlocked: false,
    };
  });

  const canCreate = user && ["SUPER_ADMIN", "DOMAIN_MANAGER"].includes(user.role);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sand-800">כל המשימות</h1>
          <p className="text-sand-600 mt-1">{filtered.length} משימות בסה"כ</p>
        </div>
        {canCreate && (
          <Link to="/tasks/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> משימה חדשה
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter || "all"}
          onChange={(e) => setParam("status", e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="NOT_STARTED">לא התחיל</option>
          <option value="IN_PROGRESS">בתהליך</option>
          <option value="COMPLETED">הושלם</option>
          <option value="BLOCKED">חסום</option>
        </select>
        <select
          value={domainFilter || "all"}
          onChange={(e) => setParam("domain", e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
        >
          <option value="all">כל התחומים</option>
          {mockDomains.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <TaskList tasks={enhanced} />
    </div>
  );
}
