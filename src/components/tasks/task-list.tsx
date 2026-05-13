import { TaskCard } from "./task-card";

export function TaskList({
  tasks,
  emptyMessage = "אין משימות להצגה",
}: {
  tasks: any[];
  emptyMessage?: string;
}) {
  if (tasks.length === 0) {
    return (
      <div className="calm-card p-8 text-center">
        <p className="text-sand-500">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
