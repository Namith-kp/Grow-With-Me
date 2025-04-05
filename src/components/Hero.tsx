import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from 'react';
import { BsArrowRight, BsLightbulb, BsCode, BsCurrencyDollar, BsChevronDown } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import { ScrollIndicator } from './ScrollIndicator';
import { useInView } from 'react-intersection-observer';

export const Hero = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [descRef, descInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // For the role cards
  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // For the stats section
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // For the testimonial
  const [testimonialRef, testimonialInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll with offset for fixed header
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  

  // Text animations for the headline
  const headlines = [
    "Connect with Your Perfect Co-Founder",
    "Build Your Startup Dream Team",
    "Turn Your Vision Into Reality"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update active headline every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Track mouse position for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden modern-scrollbar bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <ScrollIndicator />


      <style jsx global>{`
      /* Hide scrollbar but keep functionality */
      html::-webkit-scrollbar,
      body::-webkit-scrollbar,
      .modern-scrollbar::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }
      
      html::-webkit-scrollbar-track,
      body::-webkit-scrollbar-track,
      .modern-scrollbar::-webkit-scrollbar-track {
        background: transparent !important;
        display: none;
      }
      
      html::-webkit-scrollbar-thumb,
      body::-webkit-scrollbar-thumb,
      .modern-scrollbar::-webkit-scrollbar-thumb {
        background: transparent;
        display: none;
      }
      
      /* Firefox styles */
      html, body, .modern-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      html {
        scroll-behavior: smooth;
      }
    `}</style>

      {/* Background gradient */}      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 md:left-20 w-48 md:w-64 h-48 md:h-64 rounded-full bg-gradient-to-r from-indigo-500/20 to-blue-500/10 blur-3xl"
          animate={{ 
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          transition={{ type: "spring", damping: 50 }}
        />
        <motion.div 
          className="absolute bottom-1 right-[1%] w-56 md:w-80 h-56 md:h-80 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/10 blur-3xl"
          animate={{ 
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          transition={{ type: "spring", damping: 50 }}
        />
      </div>

      {/* Glowing shapes in the background */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-32 right-[10%] w-16 h-16 rounded-lg bg-gradient-to-bl from-indigo-500/30 to-blue-500/10 rotate-12 hidden md:block shadow-[0_0_30px_rgba(79,70,229,0.4)]"
      />
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5
        }}
        className="absolute top-60 left-[15%] w-10 h-10 rounded-full bg-blue-400/20 hidden md:block shadow-[0_0_20px_rgba(96,165,250,0.4)]"
      />
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.2 
        }}
        className="absolute bottom-40 left-[10%] w-20 h-20 rounded-lg bg-indigo-400/20 -rotate-12 hidden md:block shadow-[0_0_25px_rgba(129,140,248,0.4)]"
      />

      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.8 
        }}
        className="absolute bottom-20 right-[5%] w-12 h-12 rounded-full bg-indigo-500/20 hidden md:block shadow-[0_0_20px_rgba(99,102,241,0.4)]"
      />

      {/* Add a cosmic-like star field - fewer stars on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
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

      {/* Main content area with better mobile padding */}
      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 
                      flex flex-col items-center justify-center min-h-screen">
        
        {/* Navigation bar - improved for mobile */}
        <div className="w-full flex justify-between items-center absolute top-4 left-0 right-0 px-4 sm:px-6 lg:px-8 z-10">
          {/* Brand logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center"
          >
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="bg-indigo-900/70 p-1.5 sm:p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)] mr-2 sm:mr-3 border border-indigo-500/30"
            >
              <HiOutlineSparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            </motion.div>
            <span className="font-extrabold text-xl sm:text-2xl bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Grow With Me
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1"
              onClick={() => scrollToSection('role-cards')}
            >
              <span>Discover</span>
              <BsChevronDown />
            </Button>
          </div>
          
          {/* Sign In button with dropdown */}
          <div ref={dropdownRef}>
            <Button
              variant="ghost"
              className="bg-white/5 backdrop-blur-lg hover:bg-white/10 text-white border border-white/10 flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Sign In</span>
              <BsChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-4 sm:right-6 lg:right-8 mt-2 w-44 sm:w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden z-20"
                >
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-semibold text-white/70 border-b border-white/10">
                      Join as
                    </div>
                    <button
                      className="w-full px-4 py-2 text-sm text-white hover:bg-white/10 text-left transition-colors"
                      onClick={() => {
                        navigate('/auth/developer');
                        setIsDropdownOpen(false);
                      }}
                    >
                      Developer
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-white hover:bg-white/10 text-left transition-colors"
                      onClick={() => {
                        navigate('/auth/recruiter');
                        setIsDropdownOpen(false);
                      }}
                    >
                      Founder
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-white hover:bg-white/10 text-left transition-colors"
                      onClick={() => {
                        navigate('/auth/investor');
                        setIsDropdownOpen(false);
                      }}
                    >
                      Investor
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Content starts - pushed down to accommodate the fixed header */}
        <div className="mt-16 sm:mt-20 w-full flex flex-col items-center">
          {/* Animated headline - improved responsive sizing */}
          <div className="relative h-28 sm:h-32 md:h-44 lg:h-42 overflow-hidden  w-full">
            {headlines.map((headline, index) => (
              <motion.h1
                key={headline}
                className="absolute w-full h-28 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent text-center leading-relaxed"
                initial={{ opacity: 0, y: 40 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  y: activeIndex === index ? 0 : 40
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {headline}
              </motion.h1>
            ))}
          </div>

          {/* Description text - responsive sizing and padding */}
          <motion.p 
            ref={descRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: descInView ? 1 : 0, 
              y: descInView ? 0 : 20 
            }}
            transition={{ duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-[95%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
          >
            Whether you're a founder with a vision, a developer seeking opportunity, or an investor funding the next big idea — 
            <span className="font-semibold text-blue-400"> find your perfect match today.</span>
          </motion.p>

          {/* Role selection cards - improved responsive layout */}
          <motion.div 
            ref={cardsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ 
              opacity: cardsInView ? 1 : 0, 
              y: cardsInView ? 0 : 40 
            }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl px-2"
          >
            <RoleCard 
              title="Founder"
              icon={<BsLightbulb className="text-3xl sm:text-4xl" />}
              description="Share your vision and find a technical co-founder to bring it to life."
              bgColor="from-yellow-600/90 to-red-600/90"
              borderColor="border-yellow-500/30"
              glowColor="shadow-[0_0_25px_rgba(234,179,8,0.3)]"
              onClick={() => navigate('/auth/recruiter')}
              className="sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none md:mx-0"
            />
            
            <RoleCard 
              title="Developer"
              icon={<BsCode className="text-3xl sm:text-4xl" />}
              description="Discover exciting startup opportunities and join a team that values your skills."
              bgColor="from-blue-600/90 to-indigo-600/90"
              borderColor="border-blue-500/30"
              glowColor="shadow-[0_0_25px_rgba(59,130,246,0.3)]"
              onClick={() => navigate('/auth/developer')}
              className="sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none md:mx-0"
            />
            
            <RoleCard 
              title="Investor"
              icon={<BsCurrencyDollar className="text-3xl sm:text-4xl" />}
              description="Connect with promising startups and invest in the next generation of innovation."
              bgColor="from-emerald-600/90 to-green-700/90"
              borderColor="border-emerald-500/30"
              glowColor="shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              onClick={() => navigate('/auth/investor')}
              className="sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none md:mx-0"
            />
          </motion.div>

          {/* Stats section - responsive layout and spacing */}
          <motion.div 
          ref={statsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 lg:mt-24 text-center"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">500+</span>
              <span className="text-xs sm:text-sm md:text-base text-gray-400 mt-1">Startups</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">1,200+</span>
              <span className="text-xs sm:text-sm md:text-base text-gray-400 mt-1">Developers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">120+</span>
              <span className="text-xs sm:text-sm md:text-base text-gray-400 mt-1">Investors</span>
            </div>
          </motion.div>

          {/* Testimonial - responsive sizing and padding */}
          <motion.div
            ref={testimonialRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-10 sm:mt-12 md:mt-16 max-w-[95%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto text-center bg-indigo-900/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm border border-indigo-500/20"
          >
            <p className="text-sm sm:text-base md:text-lg italic text-gray-200">
              "Grow With Me helped us find the perfect technical co-founder who shared our vision. Six months later, we secured our seed round. This platform is a game-changer!"
            </p>
            <p className="mt-3 sm:mt-4 font-semibold text-blue-400 text-xs sm:text-sm md:text-base">— Sarah Chen, Founder & CEO at MetaFlow</p>
          </motion.div>

          {/* Footer text - responsive sizing */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-10 sm:mt-12 md:mt-16 text-xs sm:text-sm text-gray-400 text-center px-4"
          >
            Join our community of founders, developers, and investors building the next generation of startups.
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Role selection card component - improved mobile responsiveness
const RoleCard = ({ title, icon, description, bgColor, borderColor, glowColor, onClick, className }) => {
  return (
    <motion.div
      id="role-cards"
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg group cursor-pointer ${glowColor}  border ${borderColor} ${className || ''}`}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor}`} />
      
      <div className="relative p-4 sm:p-6 md:p-8 text-white h-full flex flex-col">
        <div className="mb-2 sm:mb-4">{icon}</div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">I'm a {title}</h3>
        <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6">{description}</p>
        <div className="mt-auto flex items-center font-medium sm:font-semibold text-sm sm:text-base">
          Get Started 
          <motion.div
            className="ml-2"
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          >
            <BsArrowRight />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};