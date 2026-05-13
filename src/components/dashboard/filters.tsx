import { useNavigate, useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";

interface Props {
  domains: { id: string; name: string }[];
  currentFilters: { status?: string; domain?: string; urgency?: string };
}

const statusOptions = [
  { value: "all", label: "כל הסטטוסים" },
  { value: "NOT_STARTED", label: "לא התחיל" },
  { value: "IN_PROGRESS", label: "בתהליך" },
  { value: "COMPLETED", label: "הושלם" },
  { value: "BLOCKED", label: "חסום" },
];
const urgencyOptions = [
  { value: "all", label: "כל הדחיפויות" },
  { value: "GREEN", label: "רגיל" },
  { value: "ORANGE", label: "דחוף" },
  { value: "RED", label: "קריטי" },
];

export function DashboardFilters({ domains, currentFilters }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete(key);
    else params.set(key, value);
    navigate(`/dashboard?${params.toString()}`);
  };

  const clearFilters = () => navigate("/dashboard");
  const hasFilters = !!(currentFilters.status || currentFilters.domain || currentFilters.urgency);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sand-600">
        <Filter className="w-4 h-4" />
        <span className="text-sm">סינון:</span>
      </div>
      <select
        value={currentFilters.status || "all"}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        value={currentFilters.domain || "all"}
        onChange={(e) => updateFilter("domain", e.target.value)}
        className="px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
      >
        <option value="all">כל התחומים</option>
        {domains.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
      <select
        value={currentFilters.urgency || "all"}
        onChange={(e) => updateFilter("urgency", e.target.value)}
        className="px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
      >
        {urgencyOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-sand-600 hover:text-sand-800 hover:bg-sand-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" /> נקה סינון
        </button>
      )}
    </div>
  );
}
