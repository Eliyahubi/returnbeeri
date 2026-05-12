import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuestions } from "@/hooks/useQuestions";
import { useResponses } from "@/hooks/useResponses";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Survey() {
  const navigate = useNavigate();
  const { questions, loading } = useQuestions();
  const { submitResponse } = useResponses();
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (qId: string, option: string, multi: boolean) => {
    setSelections((prev) => {
      const cur = prev[qId] || [];
      if (multi) {
        return {
          ...prev,
          [qId]: cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option],
        };
      }
      return { ...prev, [qId]: [option] };
    });
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((q) => !(selections[q.id]?.length));
    if (unanswered.length) {
      toast.error("אנא ענה על כל השאלות");
      return;
    }
    setSubmitting(true);
    try {
      await submitResponse(selections);
      setDone(true);
      toast.success("תודה על השתתפותך!");
    } catch (e) {
      toast.error("שגיאה בשליחת התשובות");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">טוען...</div>;

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card border rounded-2xl p-10 text-center max-w-md shadow-lg">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">תודה רבה!</h2>
          <p className="text-muted-foreground mb-6">התשובות שלך נשלחו בהצלחה.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg"
          >
            חזרה לעמוד הראשי
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground mb-4">אין שאלות זמינות כרגע.</p>
          <Link to="/" className="text-primary underline">חזרה</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">סקר חזרה הביתה</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            חזרה
          </Link>
        </div>

        <div className="space-y-5">
          {questions.map((q, idx) => {
            const multi = q.type === "multi";
            const sel = selections[q.id] || [];
            return (
              <div key={q.id} className="bg-card border rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-3">
                  {idx + 1}. {q.text}
                  {multi && <span className="text-xs text-muted-foreground mr-2">(ניתן לבחור יותר מאחד)</span>}
                </h3>
                <div className="grid gap-2">
                  {q.options.map((opt) => {
                    const checked = sel.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          checked ? "border-primary bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <input
                          type={multi ? "checkbox" : "radio"}
                          name={q.id}
                          checked={checked}
                          onChange={() => toggle(q.id, opt, multi)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {submitting ? "שולח..." : "שלח תשובות"}
        </button>
      </div>
    </div>
  );
}
