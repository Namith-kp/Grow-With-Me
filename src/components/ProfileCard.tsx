import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Globe } from "lucide-react";

interface ProfileCardProps {
  type: "founder" | "developer";
  name: string;
  title: string;
  description: string;
  skills?: string[];
  idea?: string;
  expectations?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  onConnect: () => void;
}

export const ProfileCard = ({
  type,
  name,
  title,
  description,
  skills,
  idea,
  expectations,
  githubUrl,
  portfolioUrl,
  onConnect,
}: ProfileCardProps) => {
  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{name}</CardTitle>
            <p className="text-gray-600">{title}</p>
          </div>
          <Badge variant={type === "founder" ? "default" : "secondary"} className="capitalize">
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{description}</p>
        
        {skills && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Skills & Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {idea && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Startup Idea</h4>
            <p className="text-gray-700">{idea}</p>
          </div>
        )}
        
        {expectations && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Looking For</h4>
            <p className="text-gray-700">{expectations}</p>
          </div>
        )}
        
        {(githubUrl || portfolioUrl) && (
          <div className="flex gap-3">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </a>
            )}
            {portfolioUrl && (
              <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onConnect} className="w-full">
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};