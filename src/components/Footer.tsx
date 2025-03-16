import { UserCircle, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[hsl(222.2,47.4%,11.2%)] text-white py-12 mt-auto mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* GrowWithMe Section */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <h2 className="text-3xl font-bold text-primary-foreground">Grow With Me</h2>
            </Link>
            <p className="text-gray-300 text-lg">
              Connecting innovative founders with exceptional talent to build the future of technology.
            </p>
            <p className="text-gray-300">
              Join our platform to discover opportunities that match your skills and aspirations, or find the perfect talent to grow your startup.
            </p>
          </div>

          {/* Navigation Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Candidate Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <UserCircle className="w-6 h-6 text-primary-foreground" />
                <h3 className="text-xl font-semibold text-primary-foreground">For Candidates</h3>
              </div>
              <nav className="space-y-3">
                <Link to="/overview" className="block text-gray-300 hover:text-white transition-colors">
                  Overview
                </Link>
                <Link to="/startup-jobs" className="block text-gray-300 hover:text-white transition-colors">
                  Startup Jobs
                </Link>
                <Link to="/web3-jobs" className="block text-gray-300 hover:text-white transition-colors">
                  Web3 Jobs
                </Link>
                <Link to="/featured" className="block text-gray-300 hover:text-white transition-colors">
                  Featured
                </Link>
                <Link to="/salary-calculator" className="block text-gray-300 hover:text-white transition-colors">
                  Salary Calculator
                </Link>
                <Link to="/startup-hiring-data" className="block text-gray-300 hover:text-white transition-colors">
                  Startup Hiring Data
                </Link>
                <Link to="/tech-startups" className="block text-gray-300 hover:text-white transition-colors">
                  Tech Startups
                </Link>
                <Link to="/remote" className="block text-gray-300 hover:text-white transition-colors">
                  Remote
                </Link>
              </nav>
            </div>

            {/* Recruiter Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <Building2 className="w-6 h-6 text-primary-foreground" />
                <h3 className="text-xl font-semibold text-primary-foreground">For Recruiters</h3>
              </div>
              <nav className="space-y-3">
                <Link to="/recruiter/overview" className="block text-gray-300 hover:text-white transition-colors">
                  Overview
                </Link>
                <Link to="/recruiter/pro" className="block text-gray-300 hover:text-white transition-colors">
                  Recruit Pro
                </Link>
                <Link to="/recruiter/curated" className="block text-gray-300 hover:text-white transition-colors">
                  Curated
                </Link>
                <Link to="/recruiter/hire-developers" className="block text-gray-300 hover:text-white transition-colors">
                  Hire Developers
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p> {new Date().getFullYear()} Grow With Me. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
