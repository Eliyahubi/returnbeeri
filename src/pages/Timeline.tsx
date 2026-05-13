import { formatDate, getDaysRemaining, statusLabels } from "@/lib/utils";
import { mockTasks } from "@/lib/mock-data";
import { useAuth } from "@/components/providers/auth-provider";

export default function Timeline() {
  const { user } = useAuth();

  const filtered = mockTasks.filter((task) => {
    if (user?.role === "TASK_OWNER") return task.assignedToId === user.id;
    return true;
  });

  const grouped = {
    NOT_STARTED: filtered.filter((t) => t.status === "NOT_STARTED"),
    IN_PROGRESS: filtered.filter((t) => t.status === "IN_PROGRESS"),
    COMPLETED: filtered.filter((t) => t.status === "COMPLETED"),
    BLOCKED: filtered.filter((t) => t.status === "BLOCKED"),
  };

  const total = filtered.length;
  const completed = grouped.COMPLETED.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const milestones = filtered.filter((t) => t.isMilestone);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sand-800">ציר זמן ותלויות</h1>
        <p className="text-sand-600 mt-1">סקירה ויזואלית של כל המשימות והתלויות ביניהן</p>
      </div>

      <div className="calm-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-sand-800">התקדמות הפרויקט</h2>
          <span className="text-2xl font-bold text-sage-700">{progress}%</span>
        </div>
        <div className="w-full bg-sand-200 rounded-full h-3">
          <div className="bg-sage-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-sm text-sand-500">
          <span>{completed} הושלמו</span>
          <span>מתוך {total} משימות</span>
        </div>
      </div>

      {milestones.length > 0 && (
        <div className="calm-card">
          <h2 className="text-lg font-medium text-sand-800 mb-4">אבני דרך</h2>
          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-3 bg-sage-50 rounded-lg border border-sage-200">
                <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center">
                  <span className="text-sage-700 font-bold">★</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sand-800">{m.title}</h3>
                  <p className="text-sm text-sand-500">
                    {m.dueDate ? formatDate(m.dueDate) : "ללא תאריך"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    m.status === "COMPLETED" ? "bg-sage-100 text-sage-700" : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {statusLabels[m.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([status, tasks]) => {
          if (tasks.length === 0) return null;
          return (
            <div key={status} className="calm-card">
              <h2 className="text-lg font-medium text-sand-800 mb-4 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    status === "COMPLETED"
                      ? "bg-sage-400"
                      : status === "IN_PROGRESS"
                      ? "bg-sky-400"
                      : status === "BLOCKED"
                      ? "bg-red-400"
                      : "bg-gray-400"
                  }`}
                />
                {statusLabels[status]}
                <span className="text-sm font-normal text-sand-500">({tasks.length})</span>
              </h2>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const days = task.dueDate ? getDaysRemaining(task.dueDate) : null;
                  return (
                    <div key={task.id} className="flex items-center gap-4 p-3 bg-sand-50 rounded-lg">
                      <div className="w-3 h-12 rounded-full bg-sage-300" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sand-800 truncate">{task.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-sand-500 mt-1">
                          <span>{task.assignee.name}</span>
                          {task.domain && <span>{task.domain.name}</span>}
                          {task.dueDate && (
                            <span className={days !== null && days < 0 ? "text-red-600 font-medium" : ""}>
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <div className="calm-card p-8 text-center">
          <p className="text-sand-500">אין משימות להצגה בציר הזמן</p>
        </div>
      )}
    </div>
  );
}
