import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { RecommendationSection } from "@/components/RecommendationSection";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <RecommendationSection />
        
      </main>
      <Footer />
    </div>
  );
};

export default Index;
