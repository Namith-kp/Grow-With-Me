import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { HiOutlineAcademicCap, HiOutlineBriefcase } from "react-icons/hi";
import { BsPencil, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getActiveJobs, submitApplication } from "@/lib/user";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface DeveloperProfile {                                                      
  firstName: string;
  lastName: string;
  email: string;
  experience: string;
  skills: string;
  bio: string;
  github: string;
  university: string;
  degree: string;
  graduationYear: string;
  photoURL: string;
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

const DeveloperDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'applied'>('all');
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DeveloperProfile | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [applicationData, setApplicationData] = useState({ 
    coverLetter: "", 
    resume: "",
    whatsappNumber: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const uid = location.state?.uid;

        if (!uid) {
          toast({
            title: "Error",
            description: "User ID not found. Please try logging in again.",
            variant: "destructive"
          });
          return;
        }

        // Fetch developer profile
        const profileRef = doc(db, 'developers', uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as DeveloperProfile);
        }

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

        const mappedIdeas = ideasData.map((idea: any) => ({
          ...idea,
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
          id: idea.id,
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
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

  
  // return (
  //   <div className="min-h-screen bg-background text-foreground p-4">
  //     <h1 className="text-2xl font-bold">Dashboard</h1>
  //       <ThemeSwitcher />
  //   </div>
  // );
  
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
      const profileRef = doc(db, 'developers', location.state.uid);
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

  const renderTechStack = (techStack: string) => {
    if (!techStack) return null;
    return techStack.split(',').map((tech, index) => (
      <span
        key={index}
        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
      >
        {tech.trim()}
      </span>
    ));
  };

  const handleSubmitApplication = async (ideaId: string) => {
    try {
      setIsSubmitting(true);
      const result = await submitApplication({
        ideaId,
        coverLetter: applicationData.coverLetter,
        resume: applicationData.resume,
        whatsappNumber: applicationData.whatsappNumber,
        developerId: location.state.uid,
        recruiterId: selectedIdea?.recruiterId || '',
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Application submitted successfully",
        });
        setSelectedIdea(null);
        setApplicationData({ coverLetter: "", resume: "", whatsappNumber: "" });
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
    {/* <Navbar/>     */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Developer Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <Card className="lg:col-span-1 border-none shadow-xl bg-white">
            <CardHeader className="border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Developer Profile
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary"
                  onClick={() => {
                    setEditedProfile(profile);
                    setIsEditing(true);
                  }}
                >
                  <BsPencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-gray-600">Experience: {profile.experience}</p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50/80">
                  <HiOutlineAcademicCap className="text-primary text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Education</h3>
                    <p className="text-gray-600 mt-1">{profile.university}</p>
                    <p className="text-gray-600">{profile.degree}</p>
                    <p className="text-gray-600">Class of {profile.graduationYear}</p>
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50/80">
                  <FaGithub className="text-primary text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">GitHub Profile</h3>
                    <a 
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mt-1 block"
                    >
                      {profile.github}
                    </a>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">About</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ideas Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card className="border-none shadow-xl bg-white">
              <CardHeader className="border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                    <HiOutlineBriefcase className="text-primary" />
                    Startup Ideas
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
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredIdeas.map((idea) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 hover:border-primary/50 transition-all"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{idea.cofounderRole}</h3>
                            <p className="text-gray-600 mt-1">{idea.companyName}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSaveIdea(idea.id)}
                            className="hover:bg-primary/10"
                          >
                            {savedIdeas.includes(idea.id) ? (
                              <BsBookmarkFill className="h-5 w-5 text-primary" />
                            ) : (
                              <BsBookmark className="h-5 w-5" />
                            )}
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
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

                        <div className="flex flex-wrap gap-2">
                          {renderTechStack(idea.techStack)}
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Idea Description</h4>
                          <p className="text-gray-600">{idea.ideaDescription}</p>
                        </div>

                        {idea.roleDescription && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Role Description</h4>
                            <p className="text-gray-600">{idea.roleDescription}</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4">
                          <div className="flex items-center space-x-2">
                            <img
                              src={idea.photoURL}
                              alt="Recruiter"
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-gray-500">
                              Posted by {idea.email}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              className="bg-primary hover:bg-primary/90"
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
            </Card>
          </div>
        </div>
      </div>
    </motion.div>

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
            <label className="text-sm font-medium">Experience</label>
            <Input
              value={editedProfile?.experience}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, experience: e.target.value} : null)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Skills (comma-separated)</label>
            <Input
              value={editedProfile?.skills}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, skills: e.target.value} : null)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              value={editedProfile?.github}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, github: e.target.value} : null)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={editedProfile?.bio}
              onChange={(e) => setEditedProfile(prev => prev ? {...prev, bio: e.target.value} : null)}
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
            <div>
              <label className="text-sm font-medium">Resume Link</label>
              <Input
                value={applicationData.resume}
                onChange={(e) => setApplicationData(prev => ({ ...prev, resume: e.target.value }))}
                placeholder="Paste your resume link here..."
                className="mt-1"
              />
            </div>
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
                disabled={isSubmitting || !applicationData.coverLetter || !applicationData.resume || !applicationData.whatsappNumber}
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

export default DeveloperDashboard;