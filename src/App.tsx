import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import BackToWebsiteButton from "./components/BackToWebsiteButton";
import { Routes as RouterRoutes, Route as RouterRoute, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LocationProvider } from "./contexts/LocationContext";
import { DemoPersonaProvider } from "./contexts/DemoPersonaContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { TrustProvider } from "./contexts/TrustContext";
import SovereignConfirmation from "./components/trust/SovereignConfirmation";

// Lazy load pages
const WiFiFinder = lazy(() => import("./pages/WiFiFinder"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TranslationManager = lazy(() => import("./components/TranslationManager").then(m => ({ default: m.TranslationManager })));
const BusinessCentersPage = lazy(() => import("./components/BusinessCenters/BusinessCentersPage").then(m => ({ default: m.BusinessCentersPage })));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  }));

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
          <BrowserRouter>
          <AuthProvider>
          <LocationProvider>
          <DemoPersonaProvider>
          <TrustProvider>
            <Toaster />
            <Sonner />
            <SovereignConfirmation />
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/wifi-finder" element={<WiFiFinder />} />
                  <Route path="/business-centers" element={<BusinessCentersPage />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/translation-manager" element={<TranslationManager />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
          </TrustProvider>
          </DemoPersonaProvider>
          </LocationProvider>
          </AuthProvider>
          </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
