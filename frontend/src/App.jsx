import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import AddData from "./pages/AddData";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, isAdmin } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={authUser && isAdmin() ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/addclient" element={authUser ? <AddData /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </div>
  );
};

export default App;
