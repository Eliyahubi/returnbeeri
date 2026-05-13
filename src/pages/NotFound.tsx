import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-sand-800 mb-4">404</h1>
        <p className="text-sand-600 mb-6">הדף שביקשת לא נמצא</p>
        <Link to="/" className="btn-primary">חזרה לדף הבית</Link>
      </div>
    </div>
  );
}
