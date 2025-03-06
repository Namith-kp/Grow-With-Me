import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Validate Firebase configuration
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Firebase configuration error: ${key} is not set. Please check your .env file.`)
  }
})

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

// Configure Google Auth Provider with additional scopes
const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Configure GitHub Auth Provider with required scopes
const githubProvider = new GithubAuthProvider()
githubProvider.addScope('read:user')
githubProvider.addScope('user:email')
githubProvider.setCustomParameters({
  allow_signup: 'true',
  redirect_uri: `https://${firebaseConfig.authDomain}/__/auth/handler`
})

export { auth, db, googleProvider, githubProvider }
