import { Link } from "react-router-dom";
import { ClipboardList, Settings } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background px-4">
      <div className="max-w-2xl w-full bg-card border rounded-2xl shadow-lg p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          סקר חזרה הביתה
        </h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          הקול שלך חשוב לנו. אנא הקדישו מספר דקות למילוי הסקר ושיתוף עמדותיכם
          בנוגע לתחומים השונים בקהילה.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/survey"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            <ClipboardList className="w-5 h-5" />
            מלא את הסקר
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 border px-6 py-3 rounded-lg font-medium hover:bg-accent transition"
          >
            <Settings className="w-5 h-5" />
            כניסת מנהל
          </Link>
        </div>
      </div>
    </div>
  );
}
