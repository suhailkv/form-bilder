import { Toaster } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormPreview from "./components/FormPreview";
import store from "./redux/store";
import { Provider as ReduxProvider } from "react-redux";
import QuestionBuilder from "./pages/QuestionBuilder";
import AdminDashboard from './components/AdminDashboard';
import ViewResponse from './components/ViewResponse';
import LandingPage from "./pages/Landingpage";
// import ExampleComponent from './components/ExampleComponent';
const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/ind" element={<Index />} />
            <Route path="/preview" element={<FormPreview />} />
            <Route path="/questions" element={<QuestionBuilder />} />
            <Route path="/questions/:formId" element={<QuestionBuilder />} />
            <Route path="*" element={<NotFound />} />
            <Route path="adminDash" element={<AdminDashboard/>} />
          <Route path="/viewresponse/:id" element={<ViewResponse />} />

           {/* <Route path="example" element={<ExampleComponent/>} /> */}
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ReduxProvider>
);

export default App;
