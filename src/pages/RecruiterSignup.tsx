import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { BsBuilding, BsCurrencyDollar } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface FormData {
  companyName: string;
  companyWebsite: string;
  companySize: string;
  fundingStage: string;
  equityRange: string;
  salaryRange: string;
  roleDescription: string;
  techStack: string;
  experienceRequired: string;
  uid: string;
  email: string;
  photoURL: string;
}

export const RecruiterSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const authData = location.state || {};
  const auth = getAuth();
  
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/auth/recruiter', { replace: true });
        return;
      }

      // Check if user already has a profile
      try {
        const db = getFirestore();
        const userRef = doc(db, 'recruiters', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // User already has a profile, redirect to dashboard
          navigate('/recruiterdashboard', { 
            state: { uid: user.uid },
            replace: true 
          });
          return;
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkUserAndRedirect();
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyWebsite: '',
    companySize: '',
    fundingStage: '',
    equityRange: '',
    salaryRange: '',
    roleDescription: '',
    techStack: '',
    experienceRequired: '',
    uid: authData.uid || '',
    email: authData.email || '',
    photoURL: authData.photoURL || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to complete your profile.",
          variant: "destructive"
        });
        navigate('/auth/recruiter', { replace: true });
        return;
      }

      const db = getFirestore();
      const userRef = doc(db, 'recruiters', user.uid);
      
      await setDoc(userRef, {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Profile Created",
        description: "Your recruiter profile has been created successfully!",
      });

      navigate('/recruiterdashboard', { 
        state: { uid: user.uid },
        replace: true 
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "There was an error creating your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (value: string, field: keyof FormData) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Boolean(
      formData.companyName &&
      formData.companyWebsite &&
      formData.companySize &&
      formData.fundingStage &&
      formData.equityRange &&
      formData.salaryRange &&
      formData.roleDescription &&
      formData.techStack &&
      formData.experienceRequired
    );
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <>
    <Navbar/>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
    >
      


      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 lg:pr-8"
        >
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Find Your Next Tech Co-founder
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Connect with talented developers who can bring your vision to life. Grow With Me helps you find the perfect technical match for your startup.
          </p>
          <div className="space-y-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-gray-700">Access a pool of pre-vetted developers</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-gray-700">Find developers who match your tech stack</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-gray-700">Fast-track your startup's technical growth</p>
            </div>
          </div>
         
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <Card className="border-none shadow-xl">
              <CardHeader>
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Recruiter Profile
                </h2>
                <p className="mt-2 text-center text-gray-600">
                  Let's create your recruiter profile to find talented developers
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg">
                      <BsBuilding className="text-primary" />
                    </span>
                    Company Details
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} placeholder="e.g., Tech Innovations Inc." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input id="companyWebsite" value={formData.companyWebsite} onChange={(e) => handleInputChange('companyWebsite', e.target.value)} placeholder="e.g., https://example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select onValueChange={(value) => handleInputChange('companySize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingStage">Funding Stage</Label>
                    <Select onValueChange={(value) => handleInputChange('fundingStage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding stage" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="bootstrap">Bootstrapped</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="seriesA">Series A</SelectItem>
                        <SelectItem value="seriesB">Series B</SelectItem>
                        <SelectItem value="seriesC">Series C+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Equity and Compensation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg">
                      <BsCurrencyDollar className="text-primary" />
                    </span>
                    Equity & Compensation
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="equityRange">Equity Range (%)</Label>
                      <Input id="equityRange" value={formData.equityRange} onChange={(e) => handleInputChange('equityRange', e.target.value)} placeholder="e.g., 0.5-2.0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryRange">Salary Range ($)</Label>
                      <Input id="salaryRange" value={formData.salaryRange} onChange={(e) => handleInputChange('salaryRange', e.target.value)} placeholder="e.g., 80k-120k" />
                    </div>
                  </div>
                </motion.div>

                {/* Role Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg">
                      <HiOutlineDocumentText className="text-primary" />
                    </span>
                    Role Details
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="roleDescription">Role Description</Label>
                    <textarea 
                      id="roleDescription"
                      value={formData.roleDescription}
                      onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="techStack">Required Tech Stack</Label>
                    <Input id="techStack" value={formData.techStack} onChange={(e) => handleInputChange('techStack', e.target.value)} placeholder="e.g., React, Node.js, Python" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceRequired">Experience Required</Label>
                    <Select onValueChange={(value) => handleInputChange('experienceRequired', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select required experience" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!isFormValid()}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                >
                  Create Profile
                </Button>
              </CardFooter>
            </Card>
          </form>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
};

export default RecruiterSignup;
