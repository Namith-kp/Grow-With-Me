import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth, googleProvider, githubProvider } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Mail, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

type AuthSignupProps = {
  userType: 'developer' | 'recruiter'
}

export function AuthSignup({ userType }: AuthSignupProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null)
  const { toast } = useToast()

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
          case 'auth/unauthorized-domain':
            toast({
              title: "Domain Not Authorized",
              description: "This domain is not authorized in Firebase. Please add 'localhost:5173' to authorized domains in Firebase Console.",
              variant: "destructive"
            })
            console.error(`
              Firebase Domain Error: Please follow these steps:
              1. Go to Firebase Console
              2. Select project: cofoundry-6ab44
              3. Go to Authentication > Settings
              4. Add these domains:
                 - localhost
                 - localhost:5173
                 - 127.0.0.1
            `)
            break
          case 'auth/operation-not-allowed':
            toast({
              title: "Authentication Method Not Enabled",
              description: "This authentication method is not enabled. Please enable it in Firebase Console.",
              variant: "destructive"
            })
            console.error(`
              Firebase Auth Error: Please follow these steps:
              1. Go to Firebase Console
              2. Select project: cofoundry-6ab44
              3. Go to Authentication > Sign-in method
              4. Enable ${provider} authentication
            `)
            break
          case 'auth/invalid-oauth-client-id':
            toast({
              title: "Invalid OAuth Configuration",
              description: "The OAuth client ID or secret is incorrect. Please check your GitHub OAuth settings.",
              variant: "destructive"
            })
            console.error(`
              GitHub OAuth Error: Please follow these steps:
              1. Go to GitHub.com > Settings > Developer Settings > OAuth Apps
              2. Create or update your OAuth App with:
                 - Homepage URL: http://localhost:5173
                 - Authorization callback URL: https://${auth.app.options.authDomain}/__/auth/handler
              3. Copy the Client ID and Client Secret
              4. Go to Firebase Console > Authentication > Sign-in method
              5. Update GitHub provider settings with the new credentials
            `)
            break
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign Up as {userType === 'developer' ? 'Developer' : 'Recruiter'}</CardTitle>
          <CardDescription>Choose your preferred sign-up method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => handleAuth('google')}
            disabled={isLoading !== null}
          >
            {isLoading === 'google' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => handleAuth('github')}
            disabled={isLoading !== null}
          >
            {isLoading === 'github' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
