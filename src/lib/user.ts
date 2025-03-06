import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';

interface JobData {
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
  status: 'active' | 'closed';
  techStack: string;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

interface ApplicationData {
  ideaId: string;
  developerId: string;
  recruiterId: string;
  coverLetter: string;
  resume: string;
  whatsappNumber: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
  updatedAt: any;
}

export const createJobListing = async (jobData: JobData) => {
  try {
    console.log('Starting job creation process...'); // Debug log
    console.log('Checking recruiter:', jobData.recruiterId);

    // First check if the user exists in the recruiters collection
    const recruiterRef = doc(db, 'recruiters', jobData.recruiterId);
    const recruiterDoc = await getDoc(recruiterRef);
    
    console.log('Recruiter document exists:', recruiterDoc.exists()); // Debug log
    
    if (!recruiterDoc.exists()) {
      console.error('Recruiter document not found');
      throw new Error('User is not registered as a recruiter');
    }

    const recruiterData = recruiterDoc.data();
    console.log('Recruiter data:', recruiterData); // Debug log
    
    const timestamp = serverTimestamp();
    
    const jobWithMetadata = {
      ...jobData,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'active' // Ensure status is set
    };

    console.log('Prepared job data:', jobWithMetadata); // Debug log

    const ideasRef = collection(db, 'ideas');
    const docRef = await addDoc(ideasRef, jobWithMetadata);
    console.log('Idea created with ID:', docRef.id); // Debug log

    // Verify the idea was created
    const createdIdea = await getDoc(docRef);
    console.log('Created idea data:', createdIdea.data()); // Debug log

    return { success: true, jobId: docRef.id };
  } catch (error) {
    console.error('Error creating idea:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create idea' 
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

export const submitApplication = async (data: Omit<ApplicationData, 'status' | 'createdAt' | 'updatedAt'>) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return { success: false, error: 'You must be signed in to submit an application' };
    }

    // Verify the user is a developer
    const developerRef = doc(db, 'developers', user.uid);
    const developerSnap = await getDoc(developerRef);
    
    if (!developerSnap.exists()) {
      throw new Error('Only developers can submit applications');
    }

    // Get the idea details to get the recruiterId
    const ideaRef = doc(db, 'ideas', data.ideaId);
    const ideaSnap = await getDoc(ideaRef);
    
    if (!ideaSnap.exists()) {
      return { success: false, error: 'Job posting not found' };
    }

    const ideaData = ideaSnap.data();
    
    // Create the application
    const applicationsRef = collection(db, 'applications');
    await addDoc(applicationsRef, {
      developerId: user.uid,
      recruiterId: ideaData.recruiterId,
      ideaId: data.ideaId,
      coverLetter: data.coverLetter,
      resume: data.resume,
      whatsappNumber: data.whatsappNumber,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit application'
    };
  }
};
