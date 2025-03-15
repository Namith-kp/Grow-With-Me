import { getFirestore, collection, doc, addDoc,setDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';

interface InvestorProfile {
  firstName: string;
  lastName: string;
  email: string;
  investmentInterests: string;
  netWorth: string;
  pastInvestments: string;
  uid: string;
  photoURL: string;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

interface InvestmentOpportunity {
  id: string;
  title: string;
  description: string;
  requiredInvestment: number;
  expectedReturn: number;
  status: 'open' | 'closed';
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

interface InvestmentInterest {
  opportunityId: string;
  investorId: string;
  ideaId: string;
  coverLetter: string;
  whatsappNumber: string;
  recruiterId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
  updatedAt: any;
}

export const createInvestorProfile = async (profileData: InvestorProfile) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('You must be signed in to create a profile');
    }

    const db = getFirestore();
    const profileRef = doc(db, 'investors', user.uid);

    await setDoc(profileRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating investor profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create profile' 
    };
  }
};

export const getInvestmentOpportunities = async () => {
  try {
    const db = getFirestore();
    const opportunitiesRef = collection(db, 'investmentOpportunities');
    const opportunitiesSnapshot = await getDocs(opportunitiesRef);

    const opportunities = opportunitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as InvestmentOpportunity[];

    return opportunities;
  } catch (error) {
    console.error('Error fetching investment opportunities:', error);
    throw error;
  }
};

export const getPortfolioPerformance = async (uid: string) => {
  try {
    const db = getFirestore();
    const portfolioRef = doc(db, 'portfolios', uid);
    const portfolioSnap = await getDoc(portfolioRef);

    if (!portfolioSnap.exists()) {
      throw new Error('Portfolio not found');
    }

    return portfolioSnap.data();
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    throw error;
  }
};

export const submitInvestmentInterest = async (data: Omit<InvestmentInterest, 'status' | 'createdAt' | 'updatedAt'>) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return { success: false, error: 'You must be signed in to submit an investment interest' };
    }

    // Verify the user is an investor
    const investorRef = doc(db, 'investors', user.uid);
    const investorSnap = await getDoc(investorRef);
    
    if (!investorSnap.exists()) {
      throw new Error('Only investors can submit investment interests');
    }

    // Get the idea details to get the recruiterId
    const ideaRef = doc(db, 'ideas', data.ideaId);
    const ideaSnap = await getDoc(ideaRef);
    
    if (!ideaSnap.exists()) {
        return { success: false, error: 'Investment opportunity not found' };
    }

    const ideaData = ideaSnap.data();

    // Create the investment interest
    const interestsRef = collection(db, 'investmentInterests');
    await addDoc(interestsRef, {
      investorId: user.uid,
      recruiterId: ideaData.recruiterId,
      ideaId: data.ideaId,
      opportunityId: data.opportunityId,
      coverLetter: data.coverLetter,
      whatsappNumber: data.whatsappNumber,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting investment interest:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit investment interest'
    };
  }
};

export const getActiveJobs = async () => {
    try {
      console.log('Fetching active ideas...'); // Debug log
      const ideasRef = collection(db, 'ideas');
      console.log('Collection reference:', ideasRef.path); // Debug log
  
      // First, let's get all ideas without any filters
      const allIdeasSnapshot = await getDocs(ideasRef);
      console.log('Total ideas in collection:', allIdeasSnapshot.size);
      
      // Log all ideas for debugging
      allIdeasSnapshot.forEach(doc => {
        console.log('Found idea:', {
          id: doc.id,
          data: doc.data()
        });
      });
  
      // Filter active ideas in memory
      const activeIdeas = allIdeasSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          console.log('Checking idea status:', doc.id, data.status);
          return data.status === 'active';
        })
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Handle dates if they exist
            createdAt: data.createdAt || data.updatedAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString()
          };
        });
  
      console.log('Filtered active ideas:', activeIdeas.length);
      console.log('Active ideas data:', activeIdeas);
      
      return activeIdeas;
    } catch (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
  };