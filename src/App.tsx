import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import IdentityMap from "./pages/IdentityMap";
import Opportunities from "./pages/Opportunities";
import Paths from "./pages/Paths";
import Learn from "./pages/Learn";
import Experiments from "./pages/Experiments";
import Coach from "./pages/Coach";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import LifeClarity from "./pages/LifeClarity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/identity-map" element={<IdentityMap />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/paths" element={<Paths />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/community" element={<Community />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/life-clarity" element={<LifeClarity />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
