import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsCurrencyDollar } from "react-icons/bs";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BsPencil, BsBookmark, BsBookmarkFill,BsPerson } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFirestore, doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { getInvestmentOpportunities, getPortfolioPerformance, submitInvestmentInterest, getActiveJobs } from "@/lib/investor";

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

    const [applicationData, setApplicationData] = useState({
        coverLetter: "",
        whatsappNumber: ""
    });

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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
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
    return true;
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

  return (
    <>
      {/* <Navbar /> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#0f0c29] dark:via-[#6b29e4] dark:to-[#24243e] text-black dark:text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8 mt-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-red-300 dark:to-blue-500">
              Investor Dashboard
            </h1>
            <Button
            variant="outline"
            size="sm"
            onClick={() => setIsProfileOpen(true)}
            className="border flex items-center space-x-1 dark:border-blue-400 dark:bg-gradient-to-r dark:from-green-700 dark:to-blue-800 dark:text-white dark:hover:bg-gradient-to-r dark:hover:from-blue-800 dark:hover:to-green-700"
          >
            {/* <BsPerson className="h-6 w-6" /> */}
            <img src={profile.photoURL} alt="Profile" className="h-6 w-6 rounded-full" />
            <span><h3>Profile</h3></span>
          </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            

            {/* Investment Opportunities Section */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="lg:col-span-1 border-none shadow-xl bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 dark:border-2 dark:border-blue-400 dark:shadow-blue-500/80">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-green-500 dark:to-blue-500">
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
                                ? 'bg-primary hover:bg-primary/90'
                                : 'hover:bg-gray-100'
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
                  <CardContent className="p-6 ">
                    <div className="space-y-4 ">
                      {filteredIdeas.map((idea) => (
                        <motion.div
                          key={idea.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 hover:border-primary/50 transition-all dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500"
                        >
                          <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{idea.cofounderRole}</h3>
                                <p className="text-gray-600 mt-1 dark:text-gray-300">{idea.companyName}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => toggleSaveIdea(idea.id)}
                                // className="hover:bg-primary/10"
                              >
                                {savedIdeas.includes(idea.id) ? (
                                  <BsBookmarkFill className="h-5 w-5 text-primary" />
                                ) : (
                                  <BsBookmark className="h-5 w-5" />
                                )}
                              </Button>
                            </div>
    
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
    
                            <div className="flex flex-wrap gap-2 ">
                              {renderinvestmentInterests(idea.techStack)}
                            </div>
    
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Idea Description</h4>
                              <p className="text-gray-600 dark:text-gray-400">{idea.ideaDescription}</p>
                            </div>
    
                            {idea.roleDescription && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Role Description</h4>
                                <p className="text-gray-600 dark:text-gray-400">{idea.roleDescription}</p>
                              </div>
                            )}
    
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
                                  Apply Now
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
                          className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-100"
                        >
                          <p className="text-gray-500">No ideas found in {activeTab} category.</p>
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
                className="border flex items-center space-x-1 dark:border-blue-400"

                            
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
              <HiOutlineDocumentText className="h-7 w-7" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">Past Investments</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.pastInvestments}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50/80 dark:bg-gray-700">
              <BsCurrencyDollar className="h-5 w-5" />
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
          </div>
        </div>
      </div>

    {/* Edit Profile Dialog */}
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={editedProfile?.firstName}
                onChange={(e) => setEditedProfile(prev => prev ? {...prev, firstName: e.target.value} : null)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
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
            <label className="text-sm font-medium">Net Worth</label>
            <Input
              value={editedProfile?.netWorth}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, netWorth: e.target.value} : null)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Past Investments</label>
            <Input
              value={editedProfile?.pastInvestments}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, pastInvestments: e.target.value} : null)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Apply Dialog */}
    {selectedIdea && (
      <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
        <DialogContent className="max-w-3xl">
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