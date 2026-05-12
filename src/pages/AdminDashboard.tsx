import { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid,
} from "recharts";
import { useQuestions } from "@/hooks/useQuestions";
import { useResponses } from "@/hooks/useResponses";
import AdminLayout from "@/components/AdminLayout";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

export default function AdminDashboard() {
  const { questions } = useQuestions();
  const { responses, answers, clearAll } = useResponses();
  const [confirming, setConfirming] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    questions.forEach((q) => {
      map[q.id] = {};
      q.options.forEach((o) => (map[q.id][o] = 0));
    });
    answers.forEach((a) => {
      if (!map[a.question_id]) return;
      a.selected_options.forEach((o) => {
        map[a.question_id][o] = (map[a.question_id][o] || 0) + 1;
      });
    });
    return map;
  }, [questions, answers]);

  const handleReset = async () => {
    try {
      await clearAll();
      toast.success("התשובות אופסו");
    } catch {
      toast.error("שגיאה באיפוס");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-5 h-5" />
          <span className="font-medium">{responses.length} משיבים</span>
        </div>
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">בטוח?</span>
            <button onClick={handleReset} className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-lg text-sm">כן, מחק הכל</button>
            <button onClick={() => setConfirming(false)} className="border px-3 py-1.5 rounded-lg text-sm">ביטול</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-2 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm hover:bg-destructive hover:text-destructive-foreground transition"
          >
            <Trash2 className="w-4 h-4" /> איפוס תשובות
          </button>
        )}
      </div>

      {!questions.length && (
        <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
          אין שאלות. עבור לעריכת שאלות כדי להוסיף.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {questions.map((q) => {
          const data = q.options.map((o) => ({ name: o, value: counts[q.id]?.[o] || 0 }));
          const total = data.reduce((s, d) => s + d.value, 0);
          return (
            <div key={q.id} className="bg-card border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-1">{q.text}</h3>
              <p className="text-xs text-muted-foreground mb-4">סה"כ תשובות: {total}</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {q.chart_type === "pie" ? (
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="35%"
                        cy="50%"
                        outerRadius={80}
                        label={(e) => (e.value > 0 ? `${e.value}` : "")}
                      >
                        {data.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ paddingRight: 12, fontSize: 12 }}
                      />
                    </PieChart>
                  ) : (
                    <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
