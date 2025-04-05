import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";

export const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how much of the page has been scrolled
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      
      // Set the scroll progress (0 to 1)
      setScrollProgress(scrolled);
      
      // Hide the scroll indicator after scrolling down a bit
      if (scrollPx > 200) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Clean up event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-400 to-indigo-300 z-50 origin-left"
        style={{ scaleX: scrollProgress, opacity: scrollProgress > 0 ? 1 : 0 }}
      />

      {/* Scroll down indicator */}
      <motion.div
        className="fixed bottom-8 sm:bottom-10 left-0 right-0 mx-auto w-full max-w-[120px] flex flex-col items-center justify-center z-50"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
            opacity: showScrollIndicator ? 1 : 0,
            y: showScrollIndicator ? 0 : 20
        }}
        transition={{ duration: 0.4 }}
        >
        <span className="text-white/70 text-sm mb-2 text-center">Scroll Down</span>
        <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-full p-2 border border-white/20 shadow-lg mx-auto"
        >
            <BsChevronDown className="text-white/70 h-5 w-5" />
        </motion.div>
        </motion.div>
    </>
  );
};