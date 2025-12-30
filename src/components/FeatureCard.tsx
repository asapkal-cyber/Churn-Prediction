import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: "coral" | "blue" | "teal" | "orange" | "yellow";
  delay?: number;
}

const iconColorClasses = {
  coral: "bg-icon-coral/10 text-icon-coral",
  blue: "bg-icon-blue/10 text-icon-blue",
  teal: "bg-icon-teal/10 text-icon-teal",
  orange: "bg-icon-orange/10 text-icon-orange",
  yellow: "bg-icon-yellow/10 text-icon-yellow",
};

const FeatureCard = ({ icon: Icon, title, description, iconColor, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-300 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", iconColorClasses[iconColor])}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
