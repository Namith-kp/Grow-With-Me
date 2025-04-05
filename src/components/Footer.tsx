import { UserCircle, Building2, DollarSign, GithubIcon, TwitterIcon, LinkedinIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-t from-[#0f0c29] to-[#302b63]  text-white py-12 mt-auto">
      {/* Cosmic-like star field background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Glowing accent shapes */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-40 left-[10%] w-16 h-16 rounded-lg bg-indigo-500/10 rotate-12 hidden md:block shadow-[0_0_30px_rgba(79,70,229,0.2)]"
      />
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5
        }}
        className="absolute top-20 right-[15%] w-12 h-12 rounded-full bg-blue-400/10 hidden md:block shadow-[0_0_20px_rgba(96,165,250,0.2)]"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* GrowWithMe Section */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <div className="flex items-center gap-2">
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="bg-indigo-900/70 p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500/30"
                >
                  <HiOutlineSparkles className="h-6 w-6 text-blue-400" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Grow With Me
                </h2>
              </div>
            </Link>
            <p className="text-gray-300 text-lg">
              Connecting innovative founders with exceptional talent to build the future of technology.
            </p>
            <p className="text-gray-300">
              Join our platform to discover opportunities that match your skills and aspirations, or find the perfect talent to grow your startup.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-4">
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="p-2 bg-indigo-900/50 rounded-full border border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-colors hover:bg-indigo-800/60"
              >
                <GithubIcon className="h-5 w-5 text-gray-200" />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="p-2 bg-indigo-900/50 rounded-full border border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-colors hover:bg-indigo-800/60"
              >
                <TwitterIcon className="h-5 w-5 text-gray-200" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="p-2 bg-indigo-900/50 rounded-full border border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-colors hover:bg-indigo-800/60"
              >
                <LinkedinIcon className="h-5 w-5 text-gray-200" />
              </motion.a>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Candidate Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-1.5 bg-indigo-900/70 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500/30">
                  <UserCircle className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  For Developers
                </h3>
              </div>
              <nav className="space-y-3">
                {[
                  { path: "/overview", label: "Overview" },
                  { path: "/startup-jobs", label: "Startup Jobs" },
                  { path: "/featured", label: "Featured" },
                  { path: "/salary-calculator", label: "Salary Calculator" },
                  { path: "/remote", label: "Remote" }
                ].map((link) => (
                  <motion.div key={link.path} whileHover={{ x: 5 }} className="transition-all duration-200">
                    <Link 
                      to={link.path} 
                      className="block text-gray-300 hover:text-white transition-colors flex items-center group"
                    >
                      <span>{link.label}</span>
                      <BsArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Combined Recruiter & Investor Section */}
            <div className="space-y-8">
              {/* Founder/Recruiter Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-1.5 bg-indigo-900/70 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.3)] border border-yellow-500/30">
                    <Building2 className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-300 bg-clip-text text-transparent">
                    For Founders
                  </h3>
                </div>
                <nav className="space-y-3">
                  {[
                    { path: "/recruiter/overview", label: "Overview" },
                    { path: "/recruiter/pro", label: "Post a Job" },
                    { path: "/recruiter/hire-developers", label: "Hire Developers" }
                  ].map((link) => (
                    <motion.div key={link.path} whileHover={{ x: 5 }} className="transition-all duration-200">
                      <Link 
                        to={link.path} 
                        className="block text-gray-300 hover:text-white transition-colors flex items-center group"
                      >
                        <span>{link.label}</span>
                        <BsArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Investor Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-1.5 bg-indigo-900/70 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-green-500/30">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
                    For Investors
                  </h3>
                </div>
                <nav className="space-y-3">
                  {[
                    { path: "/investor/opportunities", label: "Opportunities" },
                    { path: "/investor/startups", label: "Browse Startups" }
                  ].map((link) => (
                    <motion.div key={link.path} whileHover={{ x: 5 }} className="transition-all duration-200">
                      <Link 
                        to={link.path} 
                        className="block text-gray-300 hover:text-white transition-colors flex items-center group"
                      >
                        <span>{link.label}</span>
                        <BsArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Grow With Me. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;