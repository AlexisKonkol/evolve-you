import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatingCoach } from "@/components/FloatingCoach";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import IdentityMap from "./pages/IdentityMap";
import Opportunities from "./pages/Opportunities";
import OpportunityEngine from "./pages/OpportunityEngine";
import Paths from "./pages/Paths";
import Learn from "./pages/Learn";
import Experiments from "./pages/Experiments";
import Coach from "./pages/Coach";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import LifeClarity from "./pages/LifeClarity";
import FutureVision from "./pages/FutureVision";
import ConfidenceBuilder from "./pages/ConfidenceBuilder";
import ClarityEngine from "./pages/ClarityEngine";
import PathFinder from "./pages/PathFinder";
import FutureYou from "./pages/FutureYou";
import PathGraph from "./pages/PathGraph";
import Journal from "./pages/Journal";
import Mentor from "./pages/Mentor";
import IdentityDashboard from "./pages/IdentityDashboard";
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
          <Route path="/future-vision" element={<FutureVision />} />
          <Route path="/confidence-builder" element={<ConfidenceBuilder />} />
          <Route path="/clarity-engine" element={<ClarityEngine />} />
          <Route path="/path-finder" element={<PathFinder />} />
          <Route path="/future-you" element={<FutureYou />} />
          <Route path="/path-graph" element={<PathGraph />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/identity-dashboard" element={<IdentityDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Floating AI Coach — visible on every page except /coach */}
        <FloatingCoach />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
