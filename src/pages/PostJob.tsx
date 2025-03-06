import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createJobListing } from "@/lib/user";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";

interface JobFormData {
  cofounderRole: string;
  companyName: string;
  companySize: string;
  companyWebsite: string;
  equityRange: string;
  experienceRequired: string;
  fundingStage: string;
  ideaDescription: string;
  idealCandidate: string;
  responsibilities: string;
  roleDescription: string;
  salaryRange: string;
  techStack: string;
}

export const PostJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<JobFormData>({
    cofounderRole: '',
    companyName: '',
    companySize: '1-10',
    companyWebsite: '',
    equityRange: '',
    experienceRequired: '0-2',
    fundingStage: 'pre-seed',
    ideaDescription: '',
    idealCandidate: '',
    responsibilities: '',
    roleDescription: '',
    salaryRange: '',
    techStack: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to post a job",
          variant: "destructive"
        });
        navigate('/auth/recruiter');
        return;
      }

      console.log('Current user:', user); // Debug log

      if (!formData.cofounderRole || !formData.ideaDescription || !formData.techStack) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Prepare job data
      const jobData = {
        recruiterId: user.uid,
        uid: user.uid,
        email: user.email || '',
        photoURL: user.photoURL || '',
        cofounderRole: formData.cofounderRole,
        companyName: formData.companyName || 'Unknown Company',
        companySize: formData.companySize || '1-10',
        companyWebsite: formData.companyWebsite || '',
        equityRange: formData.equityRange || 'Not specified',
        experienceRequired: formData.experienceRequired || '0-2',
        fundingStage: formData.fundingStage || 'pre-seed',
        ideaDescription: formData.ideaDescription,
        idealCandidate: formData.idealCandidate || '',
        responsibilities: formData.responsibilities || '',
        roleDescription: formData.roleDescription || '',
        salaryRange: formData.salaryRange || 'Not specified',
        status: 'active' as const,
        techStack: formData.techStack
      };

      console.log('Submitting job data:', jobData); // Debug log

      const result = await createJobListing(jobData);
      console.log('Job creation result:', result); // Debug log
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Job listing created successfully!",
          variant: "default"
        });

        // Clear form data
        setFormData({
          cofounderRole: '',
          companyName: '',
          companySize: '1-10',
          companyWebsite: '',
          equityRange: '',
          experienceRequired: '0-2',
          fundingStage: 'pre-seed',
          ideaDescription: '',
          idealCandidate: '',
          responsibilities: '',
          roleDescription: '',
          salaryRange: '',
          techStack: ''
        });

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/recruiterdashboard');
        }, 1500);
      } else {
        // Handle specific error cases
        if (result.error === 'User is not registered as a recruiter') {
          toast({
            title: "Error",
            description: "Please complete your recruiter registration first",
            variant: "destructive"
          });
          setTimeout(() => {
            navigate('/signup/recruiter');
          }, 1500);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create job listing. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error creating job listing:', error);
      toast({
        title: "Error",
        description: "Failed to create job listing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Post a New Job
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Fill in the details below to create a new job listing
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cofounderRole">Cofounder Role</Label>
                  <Input
                    id="cofounderRole"
                    placeholder="e.g., CEO, CTO, etc."
                    value={formData.cofounderRole}
                    onChange={(e) => handleInputChange('cofounderRole', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., ABC Inc."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => handleInputChange('companySize', value as JobFormData['companySize'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-100">51-100</SelectItem>
                      <SelectItem value="101-500">101-500</SelectItem>
                      <SelectItem value="501+">501+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    placeholder="e.g., https://example.com"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="equityRange">Equity Range (Optional)</Label>
                  <Input
                    id="equityRange"
                    placeholder="e.g., 0.5-1.0%"
                    value={formData.equityRange}
                    onChange={(e) => handleInputChange('equityRange', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="experienceRequired">Experience Required</Label>
                  <Select
                    value={formData.experienceRequired}
                    onValueChange={(value) => handleInputChange('experienceRequired', value as JobFormData['experienceRequired'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience required" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fundingStage">Funding Stage</Label>
                  <Select
                    value={formData.fundingStage}
                    onValueChange={(value) => handleInputChange('fundingStage', value as JobFormData['fundingStage'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B</SelectItem>
                      <SelectItem value="series-c">Series C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ideaDescription">Idea Description</Label>
                  <Textarea
                    id="ideaDescription"
                    placeholder="Describe your idea..."
                    value={formData.ideaDescription}
                    onChange={(e) => handleInputChange('ideaDescription', e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="idealCandidate">Ideal Candidate</Label>
                  <Textarea
                    id="idealCandidate"
                    placeholder="Describe your ideal candidate..."
                    value={formData.idealCandidate}
                    onChange={(e) => handleInputChange('idealCandidate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    placeholder="List the responsibilities (one per line)"
                    value={formData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="roleDescription">Role Description</Label>
                  <Textarea
                    id="roleDescription"
                    placeholder="Describe the role..."
                    value={formData.roleDescription}
                    onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="salaryRange">Salary Range (Optional)</Label>
                  <Input
                    id="salaryRange"
                    placeholder="e.g., $120k-160k"
                    value={formData.salaryRange}
                    onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="techStack">Required Tech Stack</Label>
                  <Input
                    id="techStack"
                    placeholder="e.g., React, Node.js, AWS (comma-separated)"
                    value={formData.techStack}
                    onChange={(e) => handleInputChange('techStack', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/recruiter/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Post Job
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default PostJob;
