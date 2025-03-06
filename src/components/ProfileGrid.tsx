import { ProfileCard } from "./ProfileCard";
import { useToast } from "@/hooks/use-toast";

export const ProfileGrid = () => {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Connection Request Sent",
      description: "We'll notify you when they respond to your request.",
    });
  };

  const profiles = [
    {
      type: "founder" as const,
      name: "Sarah Chen",
      title: "Startup Founder",
      description: "Serial entrepreneur with experience in fintech and AI. Looking for a technical co-founder to build the next big thing.",
      idea: "AI-powered personal finance assistant that helps users make better financial decisions.",
      expectations: "Seeking a full-stack developer with AI/ML experience. Offering competitive equity package.",
    },
    {
      type: "developer" as const,
      name: "Alex Rodriguez",
      title: "Full Stack Developer",
      description: "10 years of experience building scalable web applications. Looking for an exciting startup opportunity.",
      skills: ["React", "Node.js", "Python", "AWS", "Machine Learning"],
      expectations: "Looking for equity partnership and challenging technical problems to solve.",
      githubUrl: "https://github.com/alexr",
      portfolioUrl: "https://alexr.dev",
    },
    {
      type: "founder" as const,
      name: "Michael Kim",
      title: "Product Visionary",
      description: "Former PM at Google with a passion for solving real-world problems through technology.",
      idea: "Platform that connects local farmers with restaurants and consumers.",
      expectations: "Looking for a technical co-founder with experience in marketplace platforms.",
    },
    {
      type: "developer" as const,
      name: "Emily Taylor",
      title: "Mobile Developer",
      description: "iOS and Android expert with a focus on creating beautiful, user-friendly applications.",
      skills: ["Swift", "Kotlin", "React Native", "Firebase", "UI/UX"],
      expectations: "Interested in joining an early-stage startup with potential for growth.",
      githubUrl: "https://github.com/emilyt",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.name}
          {...profile}
          onConnect={handleConnect}
        />
      ))}
    </div>
  );
};