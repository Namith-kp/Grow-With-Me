import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsLightningCharge, BsGlobe, BsStars, BsArrowUpRight } from "react-icons/bs";
import { HiOutlineSparkles, HiOutlineCash, HiOutlineUserGroup, HiOutlineCode } from "react-icons/hi";

export const RecommendationSection = () => {
  const navigate = useNavigate();
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative overflow-hidden modern-scrollbar">
      {/* Starfield background effect - same as Hero */}
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
      
      {/* Developers Section */}
      <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-t from-[#302b63] to-[#24243e] flex flex-col items-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center mb-3 bg-blue-600/30 p-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              <HiOutlineCode className="w-5 h-5 text-blue-400" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg font-semibold mb-2 text-blue-400"
            >
              For Developers
            </motion.h3>
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent"
            >
              Find Your Dream Startup Role
            </motion.h2>
          </div>
          
          <div className="space-y-5">
            <FeatureItem 
              icon={<BsArrowUpRight className="w-5 h-5 text-blue-400" />}
              text="Connect directly with founders building the next generation of startups"
              delay={0.2}
              direction="left"
            />

            <FeatureItem 
              icon={<HiOutlineSparkles className="w-5 h-5 text-blue-400" />}
              text="Co-founder opportunities with equity stakes, not just job positions"
              delay={0.3}
              direction="left"
            />

            <FeatureItem 
              icon={<BsGlobe className="w-5 h-5 text-blue-400" />}
              text="Remote-first opportunities from innovative startups worldwide"
              delay={0.4}
              direction="left"
            />

            <FeatureItem 
              icon={<BsStars className="w-5 h-5 text-blue-400" />}
              text="Join early-stage startups and help shape product direction"
              delay={0.5}
              direction="left"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center mt-8"
            onClick={() => navigate('/auth/developer')}
          >
            <Button className="bg-blue-600/90 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30 backdrop-blur-sm">
              Find Opportunities
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Founders Section */}
      <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-t from-[#302b63] to-[#24243e] flex flex-col items-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center mb-3 bg-yellow-600/30 p-2 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"
            >
              <BsLightningCharge className="w-5 h-5 text-yellow-400" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg font-semibold mb-2 text-yellow-400"
            >
              For Founders
            </motion.h3>
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 to-orange-300 bg-clip-text text-transparent"
            >
              Find Your Technical Co-Founder
            </motion.h2>
          </div>
          
          <div className="space-y-5">
            <FeatureItem 
              icon={<HiOutlineUserGroup className="w-5 h-5 text-yellow-400" />}
              text="Access a pool of skilled developers ready to join early-stage startups"
              delay={0.2}
              direction="right"
            />

            <FeatureItem 
              icon={<HiOutlineSparkles className="w-5 h-5 text-yellow-400" />}
              text="Find the perfect technical match for your innovative business idea"
              delay={0.3}
              direction="right"
            />

            <FeatureItem 
              icon={<BsStars className="w-5 h-5 text-yellow-400" />}
              text="Connect with developers who share your vision and passion"
              delay={0.4}
              direction="right"
            />

            <FeatureItem 
              icon={<BsGlobe className="w-5 h-5 text-yellow-400" />}
              text="Build your distributed tech team quickly and efficiently"
              delay={0.5}
              direction="right"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center mt-8"
            onClick={() => navigate('/auth/recruiter')}
          >
            <Button className="bg-yellow-600/90 hover:bg-yellow-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.3)] border border-yellow-500/30 backdrop-blur-sm">
              Post Your Startup
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Investors Section */}
      <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-t from-[#302b63] to-[#24243e] flex flex-col items-center sm:col-span-2 lg:col-span-1">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center mb-3 bg-green-600/30 p-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              <HiOutlineCash className="w-5 h-5 text-green-400" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg font-semibold mb-2 text-green-400"
            >
              For Investors
            </motion.h3>
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent"
            >
              Discover Promising Startups
            </motion.h2>
          </div>
          
          <div className="space-y-5">
            <FeatureItem 
              icon={<BsArrowUpRight className="w-5 h-5 text-green-400" />}
              text="Early access to innovative startups before they seek larger funding"
              delay={0.2}
              direction="up"
            />

            <FeatureItem 
              icon={<HiOutlineSparkles className="w-5 h-5 text-green-400" />}
              text="Evaluate founding teams with complete transparency into their skills"
              delay={0.3}
              direction="up"
            />

            <FeatureItem 
              icon={<BsStars className="w-5 h-5 text-green-400" />}
              text="Connect directly with entrepreneurs to discuss investment opportunities"
              delay={0.4}
              direction="up"
            />

            <FeatureItem 
              icon={<BsGlobe className="w-5 h-5 text-green-400" />}
              text="Diversify your portfolio with startups from various tech sectors"
              delay={0.5}
              direction="up"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center mt-8"
            onClick={() => navigate('/auth/investor')}
          >
            <Button className="bg-green-600/90 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-green-500/30 backdrop-blur-sm">
              Explore Investments
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Feature item component to reduce repetition
const FeatureItem = ({ icon, text, delay, direction }) => {
  const getAnimationDirection = () => {
    if (direction === "left") return { x: -20 };
    if (direction === "right") return { x: 20 };
    return { y: 20 }; // Default is "up"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, ...getAnimationDirection() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-3"
    >
      <div className="p-2 bg-indigo-900/70 rounded-lg shrink-0 shadow-[0_0_10px_rgba(79,70,229,0.4)] border border-indigo-500/30 mt-0.5">
        {icon}
      </div>
      <p className="text-sm sm:text-base text-gray-300">
        {text}
      </p>
    </motion.div>
  );
};