import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import NavigationPage from "@/pages/NavigationPage";
import SearchPage from "@/pages/SearchPage";
import NotFound from "./pages/NotFound";
import BottomNav from "@/components/BottomNav";

const queryClient = new QueryClient();

import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <LanguageProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="pb-20"> {/* Add padding for BottomNav */}
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/navigate/:id" element={<NavigationPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <BottomNav />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
