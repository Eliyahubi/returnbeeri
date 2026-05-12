import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-4">העמוד לא נמצא</p>
        <Link to="/" className="text-primary underline">חזרה לעמוד הראשי</Link>
      </div>
    </div>
  );
}
