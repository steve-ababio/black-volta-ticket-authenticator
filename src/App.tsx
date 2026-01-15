import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Event from "./pages/events/page";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/authContext";
import Login from "./pages/login/page";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated,isLoading } = useAuth();
  if (isLoading) return null;
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, role } = useAuth();
    
    if (isAuthenticated && role === "admin") {
      return <Navigate to="/events" replace />;
    }
    return <>{children}</>;
  };
  
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <PublicRoute><Login /></PublicRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/events" element={<ProtectedRoute><Event /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
