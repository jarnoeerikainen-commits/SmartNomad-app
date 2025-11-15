import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WiFiFinder from "./pages/WiFiFinder";
import { LanguageProvider } from "./contexts/LanguageContext";
import { InvestorDocument } from "./components/InvestorDocument";
import { InvestorOnePager } from "./components/InvestorOnePager";
import { TranslationManager } from "./components/TranslationManager";
import { BusinessCentersPage } from "./components/BusinessCenters/BusinessCentersPage";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  // Create QueryClient inside component to prevent subscription errors
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/wifi-finder" element={<WiFiFinder />} />
                <Route path="/business-centers" element={<BusinessCentersPage />} />
                <Route path="/investor-document" element={<InvestorDocument />} />
                <Route path="/investor-pitch" element={<InvestorOnePager />} />
                <Route path="/translation-manager" element={<TranslationManager />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
