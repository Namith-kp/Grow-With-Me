import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { toggleTheme } from './components/theme';

// Pages
import Index from "./pages/Index"
import { AuthSignup } from "./pages/AuthSignup"
import DeveloperSignup from "./pages/DeveloperSignup"
import RecruiterSignup from "./pages/RecruiterSignup"
import InvestorsSignup from "./pages/InvestorsSignup"
import RecruiterDashboard from './pages/RecruiterDashboard'
import DeveloperDashboard from './pages/DeveloperDashboard'
import InvestorsDashboard from './pages/InvestorsDashboard'
const queryClient = new QueryClient()

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Apply the theme class to the HTML element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  // };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
          <Navbar theme={theme} />
          <Routes>
            <Route path="/Grow-With-Me/" element={<Index />} />
            <Route path="/Grow-With-Me/auth/developer" element={<AuthSignup userType="developer" />} />
            <Route path="/Grow-With-Me/auth/recruiter" element={<AuthSignup userType="recruiter" />} />
            <Route path="/Grow-With-Me/auth/investor" element={<AuthSignup userType="investor" />} />
            <Route path="/Grow-With-Me/signup/developer" element={<DeveloperSignup />} />
            <Route path="/Grow-With-Me/signup/recruiter" element={<RecruiterSignup />} />
            <Route path="/Grow-With-Me/signup/investor" element={<InvestorsSignup />} />
            <Route path="/Grow-With-Me/recruiterdashboard" element={<RecruiterDashboard />} />
            <Route path="/Grow-With-Me/developerdashboard" element={<DeveloperDashboard />} />   
            <Route path="/Grow-With-Me/investorsdashboard" element={<InvestorsDashboard />} />         


            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App