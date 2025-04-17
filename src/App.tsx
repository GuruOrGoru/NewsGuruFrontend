
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import NewsDetailPage from "./pages/NewsDetailPage";
import CreateNewsPage from "./pages/CreateNewsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/create" element={<CreateNewsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
