import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Welcome from "./pages/Welcome";
import Survey from "./pages/Survey";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEdit from "./pages/AdminEdit";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/edit" element={<AdminEdit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
