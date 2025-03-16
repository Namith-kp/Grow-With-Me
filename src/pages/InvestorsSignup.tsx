import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  investmentInterests: string;
  netWorth: string;
  pastInvestments: string;
  uid: string;
  photoURL: string;
}

export const InvestorSignup = () => {
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
        navigate('/auth/investor', { replace: true });
        return;
      }

      // Check if user already has a profile
      try {
        const db = getFirestore();
        const userRef = doc(db, 'investors', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // User already has a profile, redirect to dashboard
          navigate('/investorsdashboard', { 
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
      if (user) {
        checkUserAndRedirect();
      }
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
    investmentInterests: '',
    netWorth: '',
    pastInvestments: '',
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
        navigate('/auth/investor', { replace: true });
        return;
      }

      const db = getFirestore();
      const userRef = doc(db, 'investors', user.uid);
      
      await setDoc(userRef, {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Profile Created",
        description: "Your investor profile has been created successfully!",
      });

      // Navigate to dashboard
      navigate('/investorsdashboard', { 
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
      <Navbar />

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
              Join our community of investors and discover promising startups. We connect visionary investors with innovative founders.
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
                <p className="text-lg text-gray-700">Get matched with founders who value your investment</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-gray-700">Earn competitive returns on your investments</p>
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
                    Investor Profile
                  </motion.h2>
                  <motion.p 
                    {...fadeIn}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-center text-gray-600"
                  >
                    Let's create your investor profile to find the perfect opportunities
                  </motion.p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Personal Information Section */}
                  <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="p-2 bg-primary/10 rounded-lg">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
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
                        <Label htmlFor="investmentInterests">Investment Interests</Label>
                        <Input 
                          id="investmentInterests" 
                          placeholder="e.g., Technology, Healthcare" 
                          value={formData.investmentInterests}
                          onChange={(e) => handleInputChange('investmentInterests', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="netWorth">Net Worth</Label>
                        <Input 
                          id="netWorth" 
                          placeholder="e.g., $1,000,000" 
                          value={formData.netWorth}
                          onChange={(e) => handleInputChange('netWorth', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pastInvestments">Past Investments</Label>
                        <textarea 
                          id="pastInvestments"
                          className="w-full min-h-[100px] p-3 border rounded-md"
                          placeholder="List your past investments..."
                          value={formData.pastInvestments}
                          onChange={(e) => handleInputChange('pastInvestments', e.target.value)}
                          required
                        />
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

export default InvestorSignup;