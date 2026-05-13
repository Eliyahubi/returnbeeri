import { Link } from "react-router-dom";
import { Calendar, User, Paperclip, MessageSquare, AlertCircle, Lock } from "lucide-react";
import { cn, formatDate, statusLabels, urgencyDotColors } from "@/lib/utils";

export function TaskCard({ task }: { task: any }) {
  const dotColor = urgencyDotColors[task.urgency] ?? "bg-sand-300";

  return (
    <Link to={`/tasks/${task.id}`}>
      <div className={cn("task-card cursor-pointer hover:shadow-md")}>
        <div className={cn("absolute top-0 right-0 bottom-0 w-1", dotColor)} />
        <div className="pr-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-medium text-sand-800 line-clamp-2">{task.title}</h3>
            {task.isBlocked && <Lock className="w-4 h-4 text-red-500 flex-shrink-0" />}
          </div>

          {task.description && (
            <p className="text-sm text-sand-600 line-clamp-2 mb-3">{task.description}</p>
          )}

          <div className="space-y-2">
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-sand-400" />
                <span className={cn("text-sand-600", task.daysRemaining < 0 && "text-red-600 font-medium")}>
                  {formatDate(task.dueDate)}
                </span>
                {task.daysLabel && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      task.daysRemaining < 0
                        ? "bg-red-100 text-red-700"
                        : task.daysRemaining <= 3
                        ? "bg-orange-100 text-orange-700"
                        : "bg-sage-100 text-sage-700"
                    )}
                  >
                    {task.daysLabel}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-sand-400" />
              <span className="text-sand-600">{task.owner?.name ?? task.assignee?.name}</span>
            </div>

            {task.domain && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: task.domain.color }} />
                <span className="text-sm text-sand-600">{task.domain.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-100">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                task.status === "COMPLETED" && "bg-sage-100 text-sage-700",
                task.status === "IN_PROGRESS" && "bg-sky-100 text-sky-700",
                task.status === "NOT_STARTED" && "bg-gray-100 text-gray-700",
                (task.status === "BLOCKED" || task.status === "LATE") && "bg-red-100 text-red-700"
              )}
            >
              {statusLabels[task.status] || task.status}
            </span>

            <div className="flex items-center gap-3 text-sand-400">
              {task._count?.comments > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" /> {task._count.comments}
                </span>
              )}
              {task._count?.attachments > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <Paperclip className="w-3.5 h-3.5" /> {task._count.attachments}
                </span>
              )}
              {task.dependencies?.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertCircle className="w-3.5 h-3.5" /> {task.dependencies.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
