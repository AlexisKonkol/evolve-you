import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatingCoach } from "@/components/FloatingCoach";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import NAVONetwork from "./pages/NAVONetwork";
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
import Intelligence from "./pages/Intelligence";
import Report from "./pages/Report";
import Framework from "./pages/Framework";
import IdentityProfile from "./pages/IdentityProfile";
import NotFound from "./pages/NotFound";
import Compass from "./pages/Compass";
import CompassResults from "./pages/CompassResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Protected routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/compass" element={
            <ProtectedRoute>
              <Compass />
            </ProtectedRoute>
          } />
          <Route path="/compass/results" element={
            <ProtectedRoute>
              <CompassResults />
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/identity-map" element={
            <ProtectedRoute>
              <IdentityMap />
            </ProtectedRoute>
          } />
          <Route path="/opportunities" element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          } />
          <Route path="/opportunity-engine" element={
            <ProtectedRoute>
              <OpportunityEngine />
            </ProtectedRoute>
          } />
          <Route path="/paths" element={
            <ProtectedRoute>
              <Paths />
            </ProtectedRoute>
          } />
          <Route path="/learn" element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />
          <Route path="/experiments" element={
            <ProtectedRoute>
              <Experiments />
            </ProtectedRoute>
          } />
          <Route path="/coach" element={
            <ProtectedRoute>
              <Coach />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/network" element={
            <ProtectedRoute>
              <NAVONetwork />
            </ProtectedRoute>
          } />
          <Route path="/life-clarity" element={
            <ProtectedRoute>
              <LifeClarity />
            </ProtectedRoute>
          } />
          <Route path="/future-vision" element={
            <ProtectedRoute>
              <FutureVision />
            </ProtectedRoute>
          } />
          <Route path="/confidence-builder" element={
            <ProtectedRoute>
              <ConfidenceBuilder />
            </ProtectedRoute>
          } />
          <Route path="/clarity-engine" element={
            <ProtectedRoute>
              <ClarityEngine />
            </ProtectedRoute>
          } />
          <Route path="/path-finder" element={
            <ProtectedRoute>
              <PathFinder />
            </ProtectedRoute>
          } />
          <Route path="/future-you" element={
            <ProtectedRoute>
              <FutureYou />
            </ProtectedRoute>
          } />
          <Route path="/path-graph" element={
            <ProtectedRoute>
              <PathGraph />
            </ProtectedRoute>
          } />
          <Route path="/mentor" element={
            <ProtectedRoute>
              <Mentor />
            </ProtectedRoute>
          } />
          <Route path="/identity-dashboard" element={
            <ProtectedRoute>
              <IdentityDashboard />
            </ProtectedRoute>
          } />
          <Route path="/intelligence" element={
            <ProtectedRoute>
              <Intelligence />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          } />
          <Route path="/framework" element={
            <ProtectedRoute>
              <Framework />
            </ProtectedRoute>
          } />
          <Route path="/identity-profile" element={
            <ProtectedRoute>
              <IdentityProfile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Floating AI Coach — visible on every page except /coach */}
        <FloatingCoach />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
