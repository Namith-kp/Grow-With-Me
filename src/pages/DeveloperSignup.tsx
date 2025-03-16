import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { BsBriefcase } from "react-icons/bs";

interface FormData {
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
  uid: string;
  photoURL: string;
}

export const DeveloperSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const authData = location.state || {};
  const auth = getAuth();
  
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user found');
        navigate('/auth/developer', { replace: true });
        return;
      }

      // Check if user already has a profile
      try {
        const db = getFirestore();
        const userRef = doc(db, 'developers', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // User already has a profile, redirect to dashboard
          navigate('/developerdashboard', { 
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

  // Split the name from auth data
  const nameParts = authData.name?.split(' ') || ['', ''];
  const defaultFirstName = nameParts[0];
  const defaultLastName = nameParts.slice(1).join(' ');

  const [formData, setFormData] = useState<FormData>({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    email: authData.email || '',
    experience: '',
    skills: '',
    bio: '',
    github: authData.github || '',  
    university: '',
    degree: '',
    graduationYear: '',
    uid: authData.uid || '',
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
        navigate('/auth/developer', { replace: true });
        return;
      }

      const db = getFirestore();
      const userRef = doc(db, 'developers', user.uid);
      
      await setDoc(userRef, {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Profile Created",
        description: "Your developer profile has been created successfully!",
      });

      // Navigate to dashboard
      navigate('/developerdashboard', { 
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (value: string, field: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
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
            Welcome to Grow With Me
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Join our community of talented developers and find your perfect startup match. We connect passionate engineers with innovative founders.
          </p>
          <div className="space-y-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-gray-700">Access exclusive startup opportunities</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-gray-700">Get matched with founders who value your skills</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-gray-700">Earn competitive equity packages</p>
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
            {/* Quote section if needed */}
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
                <motion.h2 
                  {...fadeIn}
                  className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
                >
                  Developer Profile
                </motion.h2>
                <motion.p 
                  {...fadeIn}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-center text-gray-600"
                >
                  Let's create your developer profile to find the perfect opportunity
                </motion.p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Personal Information Section */}
                <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg">
                      <BsBriefcase className="text-primary" />
                    </span>
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select onValueChange={(value) => handleSelectChange(value, 'experience')} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Primary Skills</Label>
                      <Input 
                        id="skills" 
                        placeholder="e.g., React, Node.js, Python" 
                        value={formData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">About You</Label>
                      <textarea 
                        id="bio"
                        className="w-full min-h-[100px] p-3 border rounded-md"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Professional Information Section */}
                <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg">
                      <FaGithub className="text-primary" />
                    </span>
                    Professional Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Profile</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          github.com/
                        </span>
                        <Input 
                          id="github" 
                          className="rounded-l-none" 
                          placeholder="username" 
                          value={formData.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Education Section */}
                <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg">
                      <HiOutlineAcademicCap className="text-primary" />
                    </span>
                    Education
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">College/University</Label>
                      <Input 
                        id="university" 
                        placeholder="e.g., Stanford University" 
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree & Major</Label>
                      <Input 
                        id="degree" 
                        placeholder="e.g., BS Computer Science" 
                        value={formData.degree}
                        onChange={(e) => handleInputChange('degree', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Select onValueChange={(value) => handleSelectChange(value, 'graduationYear')} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
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

export default DeveloperSignup;