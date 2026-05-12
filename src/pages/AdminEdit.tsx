import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useQuestions } from "@/hooks/useQuestions";
import type { Question } from "@/types/survey";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

type Draft = Omit<Question, "created_at" | "updated_at">;

export default function AdminEdit() {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuestions();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  useEffect(() => {
    const map: Record<string, Draft> = {};
    questions.forEach((q) => (map[q.id] = { ...q }));
    setDrafts(map);
  }, [questions]);

  const update = (id: string, patch: Partial<Draft>) =>
    setDrafts((p) => ({ ...p, [id]: { ...p[id], ...patch } }));

  const save = async (id: string) => {
    const d = drafts[id];
    try {
      await updateQuestion(id, {
        text: d.text,
        type: d.type,
        chart_type: d.chart_type,
        options: d.options.filter((o) => o.trim()),
        display_order: d.display_order,
      });
      toast.success("השאלה נשמרה");
    } catch {
      toast.error("שגיאה בשמירה");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק את השאלה?")) return;
    try {
      await deleteQuestion(id);
      toast.success("השאלה נמחקה");
    } catch {
      toast.error("שגיאה במחיקה");
    }
  };

  const addNew = async () => {
    try {
      await addQuestion({
        text: "שאלה חדשה",
        type: "single",
        options: ["אפשרות 1", "אפשרות 2"],
        chart_type: "pie",
        display_order: questions.length,
      });
      toast.success("שאלה נוספה");
    } catch {
      toast.error("שגיאה בהוספה");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">עריכת שאלות</h2>
        <button onClick={addNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> שאלה חדשה
        </button>
      </div>

      <div className="space-y-5">
        {Object.values(drafts).sort((a, b) => a.display_order - b.display_order).map((d) => (
          <div key={d.id} className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 items-start mb-3">
              <input
                value={d.text}
                onChange={(e) => update(d.id, { text: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full font-medium"
                placeholder="טקסט השאלה"
              />
              <select
                value={d.type}
                onChange={(e) => update(d.id, { type: e.target.value as Question["type"] })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="single">בחירה יחידה</option>
                <option value="multi">בחירה מרובה</option>
              </select>
              <select
                value={d.chart_type}
                onChange={(e) => update(d.id, { chart_type: e.target.value as Question["chart_type"] })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="pie">פאי</option>
                <option value="bar">עמודות</option>
              </select>
            </div>

            <div className="space-y-2 mb-3">
              {d.options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={opt}
                    onChange={(e) => {
                      const opts = [...d.options];
                      opts[i] = e.target.value;
                      update(d.id, { options: opts });
                    }}
                    className="border rounded-lg px-3 py-2 flex-1"
                    placeholder={`אפשרות ${i + 1}`}
                  />
                  <button
                    onClick={() => update(d.id, { options: d.options.filter((_, idx) => idx !== i) })}
                    className="border rounded-lg px-2 hover:bg-accent"
                    aria-label="מחק אפשרות"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => update(d.id, { options: [...d.options, ""] })}
                className="text-sm text-primary hover:underline"
              >
                + הוסף אפשרות
              </button>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => remove(d.id)}
                className="flex items-center gap-1 border border-destructive text-destructive px-3 py-1.5 rounded-lg text-sm hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" /> מחק
              </button>
              <button
                onClick={() => save(d.id)}
                className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm"
              >
                <Save className="w-4 h-4" /> שמור עריכה
              </button>
            </div>
          </div>
        ))}
        {!Object.keys(drafts).length && (
          <div className="text-center text-muted-foreground py-8">אין שאלות. לחץ "שאלה חדשה".</div>
        )}
      </div>
    </AdminLayout>
  );
}
