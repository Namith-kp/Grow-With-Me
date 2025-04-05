import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth, googleProvider, githubProvider } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Mail, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineSparkles } from "react-icons/hi"
import { BsArrowRight, BsLightbulb, BsCode, BsCurrencyDollar, BsChevronDown } from "react-icons/bs";


type AuthSignupProps = {
  userType: 'developer' | 'recruiter' | 'investor'
}

export function AuthSignup({ userType }: AuthSignupProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { toast } = useToast()

  // Track mouse position for dynamic effects
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }

  const handleAuth = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(provider)
      console.log('Starting authentication with:', provider)
      
      const authProvider = provider === 'google' ? googleProvider : githubProvider
      const result = await signInWithPopup(auth, authProvider)
      
      console.log('Authentication successful:', result.user)
      
      if (!result.user.email) {
        throw new Error('No email provided from authentication provider')
      }

      // Get additional GitHub data if signing in with GitHub
      let githubUsername = '';
      if (provider === 'github' && result.user.providerData[0]) {
        // GitHub provider data includes the username in the displayName
        githubUsername = result.user.providerData[0].displayName || '';
      }

      const userData = {
        name: result.user.displayName || '',
        email: result.user.email,
        photoURL: result.user.photoURL || '',
        uid: result.user.uid,
        github: provider === 'github' ? githubUsername : ''
      }

      console.log('Navigating to signup with user data:', userData)
      
      navigate(`/signup/${userType}`, {
        state: userData,
        replace: true
      })
    } catch (error) {
      console.error('Auth error:', error)
      
      if (error instanceof FirebaseError) {
        console.error('Firebase Auth Error:', error.code, error.message)
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            toast({
              title: "Authentication Cancelled",
              description: "You closed the authentication window. Please try again.",
              variant: "default"
            })
            break
          case 'auth/popup-blocked':
            toast({
              title: "Popup Blocked",
              description: "Please allow popups for this site and try again.",
              variant: "destructive"
            })
            break
          // Other error cases...
          default:
            toast({
              title: "Authentication Error",
              description: error.message || "Failed to sign in. Please try again.",
              variant: "destructive"
            })
        }
      } else {
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(null)
    }
  }

  const getUserTypeColor = () => {
    switch(userType) {
      case 'developer':
        return {
          icon: <BsCode className="text-gray-100 h-5 w-5" />,
          gradientFrom: "from-blue-400",
          gradientTo: "to-indigo-300",
          iconBg: "bg-indigo-500/70",
          iconShadow: "shadow-[0_0_15px_rgba(79,70,229,0.4)]",
          iconBorder: "border-indigo-500/30"
        };
      case 'recruiter':
        return {
          icon: <BsLightbulb className="text-gray-100 h-5 w-5" />,
          gradientFrom: "from-yellow-400",
          gradientTo: "to-orange-300",
          iconBg: "bg-yellow-500/70",
          iconShadow: "shadow-[0_0_15px_rgba(234,179,8,0.4)]",
          iconBorder: "border-yellow-500/30"
        };
      case 'investor':
        return {
          icon: <BsCurrencyDollar className="text-gray-100 h-5 w-5" />,
          gradientFrom: "from-green-400",
          gradientTo: "to-teal-300",
          iconBg: "bg-green-500/70",
          iconShadow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
          iconBorder: "border-green-500/30"
        };
      default:
        return {
          icon: <HiOutlineSparkles className="mr-2 h-5 w-5" />,
          gradientFrom: "from-blue-400",
          gradientTo: "to-indigo-300",
          iconBg: "bg-indigo-900/70",
          iconShadow: "shadow-[0_0_15px_rgba(79,70,229,0.4)]",
          iconBorder: "border-indigo-500/30"
        };
    }
  };

  const colorScheme = getUserTypeColor();

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]"
      onMouseMove={handleMouseMove}
    >
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
          className="absolute bottom-10 right-[5%] w-56 md:w-80 h-56 md:h-80 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/10 blur-3xl"
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
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.2 
        }}
        className="absolute bottom-40 left-[10%] w-20 h-20 rounded-lg bg-indigo-400/20 -rotate-12 hidden md:block shadow-[0_0_25px_rgba(129,140,248,0.4)]"
      />

      {/* Add a cosmic-like star field */}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-none bg-white/10 shadow-[0_0_25px_rgba(99,102,241,0.3)] border border-white/20">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-6">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className={`p-3 rounded-lg ${colorScheme.iconBg} ${colorScheme.iconShadow} ${colorScheme.iconBorder} border`}
              >
                {colorScheme.icon}
              </motion.div>
            </div>
            <CardTitle className={`text-3xl font-bold bg-gradient-to-r ${colorScheme.gradientFrom} ${colorScheme.gradientTo} bg-clip-text text-transparent`}>
              Sign Up as {userType === 'developer' ? 'Developer' : userType === 'recruiter' ? 'Founder' : 'Investor'}
            </CardTitle>
            <CardDescription className="text-white/70 mt-2">
              Choose your preferred sign-up method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full h-12 bg-white/5  hover:bg-white/10 text-white border border-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                onClick={() => handleAuth('google')}
                disabled={isLoading !== null}
              >
                {isLoading === 'google' ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-5 w-5" />
                )}
                Continue with Google
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full h-12 bg-white/5  hover:bg-white/10 text-white border border-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                onClick={() => handleAuth('github')}
                disabled={isLoading !== null}
              >
                {isLoading === 'github' ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Github className="mr-2 h-5 w-5" />
                )}
                Continue with GitHub
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}