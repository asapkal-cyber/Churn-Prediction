import { LucideIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainCardProps {
  icon: LucideIcon;
  title: string;
  iconColor: "coral" | "blue" | "teal" | "orange";
  selected: boolean;
  onClick: () => void;
}

const iconBgClasses = {
  coral: "bg-icon-coral",
  blue: "bg-icon-blue",
  teal: "bg-icon-teal",
  orange: "bg-icon-orange",
};

const DomainCard = ({ icon: Icon, title, iconColor, selected, onClick }: DomainCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 hover:shadow-md",
        selected 
          ? "border-foreground bg-secondary/50 shadow-md" 
          : "border-border bg-card hover:border-muted-foreground/30"
      )}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
          <Check className="w-4 h-4 text-background" />
        </div>
      )}
      <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center", iconBgClasses[iconColor])}>
        <Icon className="w-8 h-8 text-primary-foreground" />
      </div>
      <span className="font-medium text-foreground">{title}</span>
    </button>
  );
};

export default DomainCard;
