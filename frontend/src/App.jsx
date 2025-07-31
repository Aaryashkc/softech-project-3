import { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddData from "./pages/AddData";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import ManageUsers from "./pages/ManageUsers";
import InquiryDashboard from "./pages/InquiryDashboard";
import InquiryActionsPage from "./components/InquiryActionPage";

const protectedRoutes = [
  "/", 
  "/signup",
  "/addclient",
  "/users",
  "/inquiries"
];

const App = () => {
  const location = useLocation();
  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();

  const isProtectedRoute = protectedRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith(route)
  );

  useEffect(() => {
    if (isProtectedRoute) {
      checkAuth();
    }
  }, [isProtectedRoute, checkAuth]);

  if (isProtectedRoute && isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-16 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/websites" element={authUser ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/addclient" element={authUser ? <AddData /> : <Navigate to="/login" />} />
        <Route path="/users" element={authUser ? <ManageUsers /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <InquiryDashboard /> : <Navigate to="/login" />} />
        {/* i will remove this later */}
        <Route path="/inquiry/:id/actions" element={authUser ? <InquiryActionsPage /> : <Navigate to="/login" />} /> 
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
