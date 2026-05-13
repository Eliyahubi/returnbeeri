import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { roleLabels } from "@/lib/utils";
import { mockUsers } from "@/lib/mock-data";
import { useAuth } from "@/components/providers/auth-provider";

export default function ManagerUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !["SUPER_ADMIN", "DOMAIN_MANAGER"].includes(user.role)) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sand-800">ניהול משתמשים</h1>
          <p className="text-sand-600 mt-1">הוספה, עריכה וניהול משתמשי המערכת</p>
        </div>
        <Link to="/manager/users/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> משתמש חדש
        </Link>
      </div>

      <div className="calm-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-100">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">שם</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">אימייל</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">תפקיד</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-sand-700">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-sand-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-sand-800">{u.name}</div>
                    {u.phone && <div className="text-sm text-sand-500">{u.phone}</div>}
                  </td>
                  <td className="py-3 px-4 text-sand-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-sage-100 text-sage-700 text-xs rounded-full">
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        u.isActive ? "bg-sage-100 text-sage-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-sage-500" : "bg-red-500"}`} />
                      {u.isActive ? "פעיל" : "לא פעיל"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
