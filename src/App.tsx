import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import SubmitReport from "./pages/SubmitReport";
import AdminDashboard from "./pages/AdminDashboard";
import MapView from "./pages/MapView";
import ReportDetails from "./pages/ReportDetails";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { useStore } from "./store/useStore";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'citizen' | 'admin' }) => {
  const user = useStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Citizen Routes */}
          <Route path="/citizen/dashboard" element={
            <ProtectedRoute requiredRole="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          <Route path="/submit-report" element={
            <ProtectedRoute requiredRole="citizen">
              <SubmitReport />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/map" element={
            <ProtectedRoute requiredRole="admin">
              <MapView />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports/:id" element={
            <ProtectedRoute>
              <ReportDetails />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Analytics />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
