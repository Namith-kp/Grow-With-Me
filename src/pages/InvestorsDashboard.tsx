import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsCurrencyDollar } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BsGrid, BsPencil, BsBookmark, BsCheckCircle, BsBookmarkFill, BsPerson, BsSearch, BsFilter, BsList } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFirestore, doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { getInvestmentOpportunities, getPortfolioPerformance, submitInvestmentInterest, getActiveJobs } from "@/lib/investor";
import './InvestorsDashboard.css';
import { getInitialTheme, toggleTheme as toggleThemeUtil } from '@/components/theme';


interface InvestorProfile {
  firstName: string;
  lastName: string;
  email: string;
  portfolioValue: number;
  investmentHistory: string[];
  investmentInterests: string;
  photoURL: string;
  netWorth: string;
  pastInvestments: string;
}

interface InvestmentOpportunity {
  id: string;
  title: string;
  description: string;
  requiredInvestment: number;
  expectedReturn: number;
  status: string;
}

interface Idea {
    id: string;
    recruiterId: string;
    uid: string;
    cofounderRole: string;
    companyName: string;
    companySize: string;
    companyWebsite: string;
    email: string;
    equityRange: string;
    experienceRequired: string;
    fundingStage: string;
    ideaDescription: string;
    idealCandidate: string;
    photoURL: string;
    responsibilities: string;
    roleDescription: string;
    salaryRange: string;
    status: string;
    techStack: string;
    createdAt: string;
    updatedAt: string;
  }

const InvestorDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'applied'>('all');
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const [editedProfile, setEditedProfile] = useState<InvestorProfile | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [investmentOpportunities, setInvestmentOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [portfolioPerformance, setPortfolioPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [equityRange, setEquityRange] = useState<'all'|'below1' | '1to5' | '5to10' |'above10'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme());
  const [expandedCards, setExpandedCards] = useState<Record<string, { description: boolean, role: boolean }>>({});

    const [applicationData, setApplicationData] = useState({
        coverLetter: "",
        whatsappNumber: ""
    });

    // Replace the toggleTheme function with this in InvestorDashboard.tsx:
    const toggleTheme = () => {
      const newTheme = toggleThemeUtil();
      setTheme(newTheme);
    };

    // Replace your useEffect with:
    useEffect(() => {
      // This effect runs once on component mount
      // Check the actual DOM state, which was set by the IIFE in theme.ts
      const isDarkMode = document.documentElement.classList.contains('dark');
      setTheme(isDarkMode ? 'dark' : 'light');
    }, []);

    const toggleDescriptionExpansion = (ideaId: string) => {
      setExpandedCards(prev => ({
        ...prev,
        [ideaId]: {
          description: !(prev[ideaId]?.description ?? false),
          role: prev[ideaId]?.role ?? false
        }
      }));
    };
    
    const toggleRoleExpansion = (ideaId: string) => {
      setExpandedCards(prev => ({
        ...prev,
        [ideaId]: {
          description: prev[ideaId]?.description ?? false,
          role: !(prev[ideaId]?.role ?? false)
        }
      }));
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const uid = location.state?.uid; // Replace with actual user ID logic

        if (!uid) {
            toast({
              title: "Error",
              description: "User ID not found. Please try logging in again.",
              variant: "destructive"
            });
            return;
          }

        // Fetch investor profile
        const profileRef = doc(db, 'investors', uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as InvestorProfile);
        }

        // Fetch investment opportunities
        const opportunitiesData = await getInvestmentOpportunities();
        setInvestmentOpportunities(opportunitiesData);

        // Fetch portfolio performance
        const performanceData = await getPortfolioPerformance(uid);
        setPortfolioPerformance(performanceData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state?.uid, toast]);

// Fetch ideas
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        console.log('Starting to fetch ideas...'); // Debug log
        const ideasData = await getActiveJobs();
        console.log('Received ideas data:', ideasData); // Debug log
        
        
        // Map the data to match the Idea interface
        
        const mappedIdeas = ideasData.map((idea: any) => ({
        ...idea,
        id: idea.id,
        recruiterId: idea.recruiterId || '',
        uid: idea.uid || '',
        cofounderRole: idea.cofounderRole || '',
        companyName: idea.companyName || '',
        companySize: idea.companySize || '',
        companyWebsite: idea.companyWebsite || '',
        email: idea.email || '',
        equityRange: idea.equityRange || '',
        experienceRequired: idea.experienceRequired || '',
        fundingStage: idea.fundingStage || '',
        ideaDescription: idea.ideaDescription || '',
        idealCandidate: idea.idealCandidate || '',
        photoURL: idea.photoURL || '',
        responsibilities: idea.responsibilities || '',
        roleDescription: idea.roleDescription || '',
        salaryRange: idea.salaryRange || '',
        status: idea.status || '',
        techStack: idea.techStack || '',
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
      }));

      setIdeas(mappedIdeas);
      } catch (error) {
        console.error('Error fetching ideas:', error);
        toast({
          title: "Error",
          description: "Failed to fetch ideas. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchIdeas();
  }, [toast]);  

  if (loading || !profile) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 mt-10 dark:bg-gradient-to-b dark:from-[#0f0c29] dark:via-[#6b29e4] dark:to-[#24243e] text-black dark:text-white">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const toggleSaveIdea = (ideaId: string) => {
    setSavedIdeas(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const filteredIdeas = ideas.filter(idea => {
    if (activeTab === 'saved') return savedIdeas.includes(idea.id);
    // Add applied ideas filter when you have that data
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        idea.cofounderRole.toLowerCase().includes(lowerCaseQuery) ||
        idea.companyName.toLowerCase().includes(lowerCaseQuery) ||
        idea.email.toLowerCase().includes(lowerCaseQuery)||
        idea.ideaDescription.toLowerCase().includes(lowerCaseQuery)
      );
    }
    return true;
  }).filter(idea => {
    if (equityRange === 'all') return true;
    const equity = parseFloat(idea.equityRange.replace('%', ''));                                                                                           
    if (equityRange === 'below1') {
      return equity < 1;                                          
    } else if (equityRange === '1to5') {
      return equity >= 1 && equity <= 5;
    } else if (equityRange === '5to10') {
      return equity >= 5 && equity <= 10;
    } else if (equityRange === 'above10') {
      return equity > 10;
    }
    return true;
  }).sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  const handleProfileUpdate = async () => {
    if (!editedProfile || !location.state?.uid) return;

    try {
      const db = getFirestore();
      const profileRef = doc(db, 'investors', location.state.uid);
      await updateDoc(profileRef,  { ...editedProfile });
      
      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderinvestmentInterests = (investmentInterests: string) => {
    if (!investmentInterests) return null;
    return investmentInterests.split(',').map((tech, index) => (
      <span
        key={index}
        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium dark:bg-primary/70 dark:text-gray-200"
      >
        {tech.trim()}
      </span>
    ));
  };

  const handleSubmitApplication = async (ideaId: string) => {
      try {
        setIsSubmitting(true);
        const result = await submitInvestmentInterest({
          ideaId,
          opportunityId: ideaId, // Assuming opportunityId is the same as ideaId
          investorId: location.state.uid,
          coverLetter: applicationData.coverLetter,
          whatsappNumber: applicationData.whatsappNumber,
          recruiterId: selectedIdea?.recruiterId || '',
        });
  
        if (result.success) {
          toast({
            title: "Success",
            description: "Application submitted successfully",
          });
          setSelectedIdea(null);
          setApplicationData({ coverLetter: "", whatsappNumber: "" });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to submit application",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    

    const SideNavBar = ({ activeTab, setActiveTab, setIsProfileOpen, isSideMenuOpen, setIsSideMenuOpen, isFilterOpen, setIsFilterOpen }) => {
      return (
        <>
          <style jsx>{`
            .modern-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .modern-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .modern-scrollbar::-webkit-scrollbar-thumb {
              background-color: transparent;
              border-radius: 20px;
              transition: background-color 0.3s ease;
            }
            .modern-scrollbar:hover::-webkit-scrollbar-thumb {
              background-color: rgba(156, 163, 175, 0.5);
            }
            .modern-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(107, 114, 128, 0.7);
            }
            .dark .modern-scrollbar:hover::-webkit-scrollbar-thumb {
              background-color: rgba(99, 102, 241, 0.5);
            }
            .dark .modern-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(99, 102, 241, 0.7);
            }
          `}</style>
          <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border border-gray-300 dark:bg-gray-900 dark:border-gray-700 shadow-lg z-50 transform transition-transform ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 overflow-hidden`}>
            <div className="h-full overflow-y-auto modern-scrollbar">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-green-500 dark:to-blue-500">
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsSideMenuOpen(false)}
                    className="text-gray-600 dark:text-gray-300 sm:hidden"
                  >
                    <BsList className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col space-y-2">
                  {([
                    { id: 'all', icon: <BsGrid className="h-4 w-4 mr-2" /> },
                    { id: 'saved', icon: <BsBookmarkFill className="h-4 w-4 mr-2" /> },
                    { id: 'applied', icon: <BsCheckCircle className="h-4 w-4 mr-2" /> }
                  ] as const).map((item) => (        
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-start px-3 py-2 capitalize transition-all duration-300 ${
                        activeTab === item.id
                          ? 'bg-primary hover:bg-primary/90 dark:bg-blue-600 shadow-md'
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span>{item.id}</span>
                      </div>
                      {activeTab === item.id && (
                        <span className="ml-auto bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                          {filteredIdeas.length}
                        </span>
                      )}
                    </Button>
                    ))}
                  </div>
                  <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center justify-start w-full px-3 py-2 border-gray-300 dark:border-blue-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <BsFilter className="h-4 w-4 mr-2" />
                    <span>Filter</span>
                  </Button>
                    {isFilterOpen && (
                      <div className="mt-2 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg py-2">
                        <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-200">Sort By</div>
                        <div className="px-4 py-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="sortOption"
                              value="newest"
                              checked={sortOption === 'newest'}
                              onChange={() => setSortOption('newest')}
                              className="form-radio"
                            />
                            <span className="ml-2 dark:text-gray-200">Newest</span>
                          </label>
                          <label className="flex items-center mt-2">
                            <input
                              type="radio"
                              name="sortOption"
                              value="oldest"
                              checked={sortOption === 'oldest'}
                              onChange={() => setSortOption('oldest')}
                              className="form-radio"
                            />
                            <span className="ml-2 dark:text-gray-200">Oldest</span>
                          </label>
                        </div>
                        <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-200">Equity Range</div>
                        <div className="px-4 py-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="equityRange"
                              value="all"
                              checked={equityRange === 'all'}
                              onChange={() => setEquityRange('all')}
                              className="form-radio"
                            />
                            <span className="ml-2 dark:text-gray-200">All</span>
                          </label>
                          <label className="flex items-center mt-2">
                            <input
                              type="radio"
                              name="equityRange"
                              value="below1"
                              checked={equityRange === 'below1'}
                              onChange={() => setEquityRange('below1')}
                              className="form-radio"
                            />
                            <span className="ml-2 dark:text-gray-200">Below 1%</span>
                          </label>
                          <label className="flex items-center mt-2">
                            <input
                              type="radio"
                              name="equityRange"
                              value="1to5"
                              checked={equityRange === '1to5'}
                              onChange={() => setEquityRange('1to5')}
                              className="form-radio"
                            />
                            <span className="ml-2 dark:text-gray-200">1-5%</span>
                          </label>
                          <label className="flex items-center mt-2">
                            <input
                              type="radio"
                              name="equityRange"
                              value="5to10"
                              checked={equityRange === '5to10'}
                              onChange={() => setEquityRange('5to10')}
                              className="form-radio"
                            />
                            <span className="ml-2 dark:text-gray-200">5-10%</span>
                          </label>
                          <label className="flex items-center mt-2">
                            <input
                              type="radio"
                              name="equityRange"
                              value="above10"
                              checked={equityRange === 'above10'}
                              onChange={() => setEquityRange('above10')}
                              className="form-radio"
                            />
                            <span className="ml-2 dark:text-gray-200">Above 10%</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsProfileOpen(true)}
                      className="hidden sm:hidden md:flex lg:flex items-center justify-start w-full px-3 py-2 border-gray-300 dark:border-blue-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <img src={profile.photoURL} alt="Profile" className="h-5 w-5 rounded-full mr-2" />
                        <span>Profile</span>
                      </div>
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };
    
    
    

  return (
    <>
      <Navbar 
        theme={theme} 
        setIsSideMenuOpen={setIsSideMenuOpen} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <SideNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsProfileOpen={setIsProfileOpen}
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsSideMenuOpen(false)}
        ></div>
      )}
      {/* <navbar /> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen h-[calc(100vh-16rem)] overflow-y-auto modern-scrollbar bg-white transition-all duration-300 dark:bg-gray-900 text-black dark:text-white sm:ml-64`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 mt-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-red-300 dark:to-blue-500">
              Investor Dashboard
            </h1>
            <div className=" hidden flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto flex-grow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-2 dark:focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            {/* Investment Opportunities Section */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="lg:col-span-1 border-none shadow-xl bg-gray-100 duration-300 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 dark:border-b dark:border-blue-400 dark:shadow-blue-500/80">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300 dark:from-green-500 dark:to-blue-500">
                    Investment Opportunities
                  </h2>
                    <div className="flex gap-2">
                        {(['all', 'saved', 'applied'] as const).map((status) => (
                          <Button
                            key={status}
                            variant={activeTab === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTab(status)}
                            className={`capitalize ${
                              activeTab === status
                                ? 'bg-primary hover:bg-primary/90 dark:bg-blue-600'
                                : 'hover:bg-gray-300 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                            }`}
                          >
                            {status}
                            {activeTab === status && (
                              <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                                {filteredIdeas.length}
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                </CardHeader>
                  <CardContent className="p-5 ">
                    <div className="space-y-4">
                      {filteredIdeas.map((idea) => (
                        <motion.div
                        key={idea.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 hover:border-primary/50 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500"
                        layout // Add this to make motion handle the layout changes
                      >
                        <div className="flex flex-col space-y-4">
                          {/* First part of the card - heading and bookmark */}
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{idea.cofounderRole}</h3>
                              <p className="text-gray-600 mt-1 dark:text-gray-300">{idea.companyName}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleSaveIdea(idea.id)}
                              className="duration-300 hover:bg-gray-300"
                            >
                              {savedIdeas.includes(idea.id) ? (
                                <BsBookmarkFill className="h-5 w-5 text-primary dark:text-blue-400" />
                              ) : (
                                <BsBookmark className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                      
                          {/* Details section */}
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-200">
                            <span>{idea.experienceRequired} years exp</span>
                            <span>•</span>
                            <span>{idea.fundingStage}</span>
                            {idea.salaryRange && (
                              <>
                                <span>•</span>
                                <span>${idea.salaryRange}k</span>
                              </>
                            )}
                            {idea.equityRange && (
                              <>
                                <span>•</span>
                                <span>{idea.equityRange}% equity</span>
                              </>
                            )}
                          </div>
                      
                          {/* Tech stack */}
                          <div className="flex flex-wrap gap-2">
                            {renderinvestmentInterests(idea.techStack)}
                          </div>
                      
                          {/* Idea description with animation */}
                          <div className="my-2">
                            <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Idea Description</h4>
                            <motion.div
                              initial={false}
                              animate={{ height: expandedCards[idea.id]?.description ? "auto" : "50px" }}
                              className="relative overflow-hidden"
                              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            >
                              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line break-words">
                                {idea.ideaDescription}
                                
                                {/* Gradient overlay when collapsed */}
                                {!(expandedCards[idea.id]?.description) && idea.ideaDescription.length > 150 && (
                                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
                                )}
                              </div>
                            </motion.div>
                            
                            {idea.ideaDescription.length > 150 && (
                              <Button
                                variant="link"
                                className="text-primary dark:text-blue-400 p-0 h-auto mt-1 flex items-center gap-1 transition-transform duration-300"
                                onClick={() => toggleDescriptionExpansion(idea.id)}
                              >
                                <span>{expandedCards[idea.id]?.description ? "See less" : "See more"}</span>
                                <motion.span 
                                  animate={{ rotate: expandedCards[idea.id]?.description ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {expandedCards[idea.id]?.description ? "↑" : "↓"}
                                </motion.span>
                              </Button>
                            )}
                          </div>

                          {/* Role description with animation */}
                          {idea.roleDescription && (
                            <div className="my-2">
                              <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Role Description</h4>
                              <motion.div
                                initial={false}
                                animate={{ height: expandedCards[idea.id]?.role ? "auto" : "50px" }}
                                className="relative overflow-hidden"
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                              >
                                <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line break-words">
                                  {idea.roleDescription}
                                  
                                  {/* Gradient overlay when collapsed */}
                                  {!(expandedCards[idea.id]?.role) && idea.roleDescription.length > 150 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
                                  )}
                                </div>
                              </motion.div>
                              
                              {idea.roleDescription.length > 150 && (
                                <Button
                                  variant="link"
                                  className="text-primary dark:text-blue-400 p-0 h-auto mt-1 flex items-center gap-1"
                                  onClick={() => toggleRoleExpansion(idea.id)}
                                >
                                  <span>{expandedCards[idea.id]?.role ? "See more" : "See less"}</span>
                                  <motion.span 
                                    animate={{ rotate: expandedCards[idea.id]?.role ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {expandedCards[idea.id]?.role ? "↑" : "↓"}
                                  </motion.span>
                                </Button>
                              )}
                            </div>
                          )}
                      
                          {/* Footer */}
                          <div className="flex justify-between items-center pt-4">
                            <div className="flex items-center space-x-2">
                              <img
                                src={idea.photoURL}
                                alt="Recruiter"
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-sm text-gray-500 dark:text-gray-300">
                                Posted by {idea.email}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <Button 
                                className="bg-primary hover:bg-primary/90 dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-700 dark:hover:bg-gradient-to-r dark:hover:from-blue-700 dark:hover:to-blue-500"
                                onClick={() => setSelectedIdea(idea)}
                              >
                                {activeTab === 'applied' ? 'Re-Apply Now' : 'Apply Now'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      ))}
                      {filteredIdeas.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                        >
                          <p className="text-gray-500 dark:text-gray-300">No ideas found in {activeTab} category.</p>
                        </motion.div>
                      )}
                    </div>              
                  </CardContent>
                {/* <CardContent className="p-6">
                  <div className="space-y-4">
                    {investmentOpportunities.map((opportunity) => (
                      <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-lg shadow-xl border border-gray-100"
                      >
                        <h3 className="text-xl font-semibold text-gray-900">{opportunity.title}</h3>
                        <p className="text-gray-600">{opportunity.description}</p>
                        <p className="text-gray-600">Required Investment: ${opportunity.requiredInvestment}</p>
                        <p className="text-gray-600">Expected Return: {opportunity.expectedReturn}%</p>
                        <p className="text-gray-600">Status: {opportunity.status}</p>
                        <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={() => toggleSaveOpportunity(opportunity.id)}>
                          {savedOpportunities.includes(opportunity.id) ? 'Unsave' : 'Save'}
                        </Button>
                      </motion.div>
                    ))}
                    {investmentOpportunities.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-100"
                      >
                        <p className="text-gray-500">No investment opportunities available.</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent> */}
              </Card>

              {/* Saved Opportunities Section */}
              {/* <Card className="border-none shadow-xl bg-white">
                <CardHeader className="border-b border-gray-100">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Saved Opportunities
                  </h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredOpportunities.map((opportunity) => (
                      <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-lg shadow-xl border border-gray-100"
                      >
                        <h3 className="text-xl font-semibold text-gray-900">{opportunity.title}</h3>
                        <p className="text-gray-600">{opportunity.description}</p>
                        <p className="text-gray-600">Required Investment: ${opportunity.requiredInvestment}</p>
                        <p className="text-gray-600">Expected Return: {opportunity.expectedReturn}%</p>
                        <p className="text-gray-600">Status: {opportunity.status}</p>
                        <Button className="mt-4 bg-primary hover:bg-primary/90">
                          Invest Now
                        </Button>
                      </motion.div>
                    ))}
                    {filteredOpportunities.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-100"
                      >
                        <p className="text-gray-500">No saved opportunities available.</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
        {/* Bottom bar for mobile devices */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 sm:hidden">
            <div className="flex justify-around items-center py-2">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-600 dark:text-gray-300">
                <BsSearch className="h-6 w-6" />
              </button>
              <button onClick={() => setIsProfileOpen(true)} className="text-gray-600 dark:text-gray-300">
              <img src={profile.photoURL} alt="Profile" className="h-6 w-6 rounded-full" />
              </button>
            </div>
          </div>

          {/* Search bar for mobile devices */}
          {isSearchOpen && (
            <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-transparent  sm:hidden"> 
              <div className="relative w-full p-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
      </motion.div>

      {/* Overlay */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}

      {/* Sliding Profile Window */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform z-50 ${
          isProfileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-green-500 dark:to-blue-500">Investor Profile</h2>
            <Button
                variant="outline"
                size="icon"
                className="border flex items-center space-x-1 dark:border-blue-400 dark:text-white"           
                onClick={() => {
                setEditedProfile(profile);
                setIsEditing(true);
                }}
            >
              <BsPencil className="h-4 w-4 " />
            </Button>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
              <p className="text-gray-600 dark:text-gray-400">Net Worth: ${profile.netWorth}</p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50/80 dark:bg-gray-700">
              <HiOutlineDocumentText className="h-7 w-7 dark:text-white" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">Past Investments</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.pastInvestments}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50/80 dark:bg-gray-700">
              <BsCurrencyDollar className="h-5 w-5 dark:text-white" />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">Investment Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.investmentInterests.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium dark:bg-primary/70 dark:text-gray-200"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* NEW: Appearance Section */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/80 dark:bg-gray-700">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-white">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="M4.93 4.93l1.41 1.41"></path>
                  <path d="M17.66 17.66l1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="M6.34 17.66l-1.41 1.41"></path>
                  <path d="M19.07 4.93l-1.41 1.41"></path>
                </svg>
                <span className="font-semibold text-gray-900 dark:text-gray-200">Appearance</span>
              </div>
              <div 
                onClick={toggleTheme}
                className="w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full px-1 cursor-pointer relative"
              >
                <div className="absolute left-1 right-0 flex justify-between items-center px-1 text-xs">
                  <span className="text-yellow-500">☀️</span>
                  <span className="text-indigo-300">🌙</span>
                </div>
                <div className={`bg-white dark:bg-indigo-500 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : ''}`}></div>
              </div>
            </div>

          </div>
        </div>
      </div>

    {/* Edit Profile Dialog */}
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="max-w-md dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium dark:text-gray-100">First Name</label>
              <Input
                value={editedProfile?.firstName}
                onChange={(e) => setEditedProfile(prev => prev ? {...prev, firstName: e.target.value} : null)}
              />
            </div>
            <div>
              <label className="text-sm font-medium dark:text-gray-100">Last Name</label>
              <Input
                value={editedProfile?.lastName}
                onChange={(e) => setEditedProfile(prev => prev ? {...prev, lastName: e.target.value} : null)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Investment Interests (comma-separated)</label>
            <Input
              value={editedProfile?.investmentInterests}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, investmentInterests: e.target.value} : null)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Net Worth $</label>
            <Input
              value={editedProfile?.netWorth}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, netWorth: e.target.value} : null)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Past Investments</label>
            <Textarea
              value={editedProfile?.pastInvestments}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, pastInvestments: e.target.value} : null)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Apply Dialog */}
    {selectedIdea && (
      <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
        <DialogContent className="max-w-3xl dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Apply for {selectedIdea.companyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cover Letter</label>
              <Textarea
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Write a brief cover letter explaining why you're interested in this opportunity..."
                className="mt-1"
              />
            </div>
            {/* <div>
              <label className="text-sm font-medium">Resume Link</label>
              <Input
                value={applicationData.resume}
                onChange={(e) => setApplicationData(prev => ({ ...prev, resume: e.target.value }))}
                placeholder="Paste your resume link here..."
                className="mt-1"
              />
            </div> */}
            <div>
              <label className="text-sm font-medium">WhatsApp Number</label>
              <Input
                value={applicationData.whatsappNumber}
                onChange={(e) => setApplicationData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="Enter your WhatsApp number with country code (e.g., +91XXXXXXXXXX)"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedIdea(null)}>Cancel</Button>
              <Button 
                variant="outline"
                onClick={() => handleSubmitApplication(selectedIdea.id)}
                disabled={isSubmitting || !applicationData.coverLetter  || !applicationData.whatsappNumber}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
};

export default InvestorDashboard;