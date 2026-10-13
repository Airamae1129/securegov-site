import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";

// The admin side loads on demand so visitors to the landing page never download it.
const AdminApp = lazy(() => import("@/pages/admin/AdminApp"));

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="min-h-screen bg-sg-ink-950" />}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
