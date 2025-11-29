import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MaintenanceProvider, useMaintenance } from "@/contexts/MaintenanceContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import Loans from "./pages/Loans";
import LoanDetail from "./pages/LoanDetail";
import Apply from "./pages/Apply";
import About from "./pages/About";
import Team from "./pages/Team";
import EMICalculator from "./pages/EMICalculator";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import MaintenancePage from "./pages/MaintenancePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Applications from "./pages/admin/Applications";
import Contacts from "./pages/admin/Contacts";
import Products from "./pages/admin/Products";
import Analytics from "./pages/admin/Analytics";
// import TeamManagement from "./pages/admin/TeamManagement";
// import AdminGallery from "./pages/admin/AdminGallery";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Public Route wrapper - checks maintenance mode
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isMaintenanceMode, loading } = useMaintenance();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};

// Admin Route wrapper - includes NotificationProvider
const AdminRoute = ({ children }: { children: ReactNode }) => {
  return (
    <NotificationProvider>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </NotificationProvider>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - affected by maintenance mode */}
      <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/loans" element={<PublicRoute><Loans /></PublicRoute>} />
      <Route path="/loans/:id" element={<PublicRoute><LoanDetail /></PublicRoute>} />
      <Route path="/apply" element={<PublicRoute><Apply /></PublicRoute>} />
      <Route path="/loans/:id/apply" element={<PublicRoute><Apply /></PublicRoute>} />
      <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
      <Route path="/team" element={<PublicRoute><Team /></PublicRoute>} />
      <Route path="/emi-calculator" element={<PublicRoute><EMICalculator /></PublicRoute>} />
      <Route path="/gallery" element={<PublicRoute><Gallery /></PublicRoute>} />
      <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
      
      {/* Admin Login - NOT affected by maintenance mode */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Routes - NOT affected by maintenance mode, wrapped with NotificationProvider */}
      <Route 
        path="/admin/dashboard" 
        element={<AdminRoute><AdminDashboard /></AdminRoute>} 
      />
      <Route 
        path="/admin/applications" 
        element={<AdminRoute><Applications /></AdminRoute>} 
      />
      <Route 
        path="/admin/contacts" 
        element={<AdminRoute><Contacts /></AdminRoute>} 
      />
      <Route 
        path="/admin/products" 
        element={<AdminRoute><Products /></AdminRoute>} 
      />
      <Route 
        path="/admin/analytics" 
        element={<AdminRoute><Analytics /></AdminRoute>} 
      />
      {/* <Route 
        path="/admin/team" 
        element={<AdminRoute><TeamManagement /></AdminRoute>} 
      /> */}
      {/* <Route 
        path="/admin/gallery" 
        element={<AdminRoute><AdminGallery /></AdminRoute>} 
      /> */}
      <Route 
        path="/admin/settings" 
        element={<AdminRoute><Settings /></AdminRoute>} 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MaintenanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </MaintenanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
