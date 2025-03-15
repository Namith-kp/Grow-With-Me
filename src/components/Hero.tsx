import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Connect with Your Perfect Co-Founder
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-20 max-w-3xl mx-auto">
          Whether you're a founder with a vision, a developer looking for an exciting opportunity, or an investor seeking the next big idea,
          find your ideal match and build something amazing together.
        </p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-16">
          <Button 
            size="lg"
            className="w-full sm:w-auto text-xl px-12 py-8 rounded-xl text-white shadow-lg 
            bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-500
            transform transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-xl
            active:scale-95 active:shadow-md
            backdrop-blur-sm" 
            onClick={() => navigate('/auth/recruiter')}
          >
            I'm a Founder
          </Button>
          <Button 
            size="lg"
            className="w-full sm:w-auto text-xl px-12 py-8 rounded-xl text-white shadow-lg 
            bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-500
            transform transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-xl
            active:scale-95 active:shadow-md
            backdrop-blur-sm"
            onClick={() => navigate('/auth/developer')}
          >
            I'm a Developer
          </Button>
          <Button 
            size="lg"
            className="w-full sm:w-auto text-xl px-12 py-8 rounded-xl text-white shadow-lg 
            bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-500
            transform transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-xl
            active:scale-95 active:shadow-md
            backdrop-blur-sm"
            onClick={() => navigate('/auth/investor')}
          >
            I'm an Investor
          </Button>
        </div>
        <div className="mt-32 text-sm text-gray-500">
          Join our community of founders, developers, and investors building the next generation of startups.
        </div>
      </div>
    </div>
  );
};
