import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CreditCard, Wifi, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DomainCard from "@/components/DomainCard";
import { useToast } from "@/hooks/use-toast";

const domains = [
  { id: "insurance", icon: Building2, title: "Insurance", iconColor: "blue" as const },
  { id: "credit-card", icon: CreditCard, title: "Credit Card", iconColor: "coral" as const },
  { id: "isp", icon: Wifi, title: "ISP", iconColor: "teal" as const },
  // { id: "equity", icon: TrendingUp, title: "Equity Trading", iconColor: "orange" as const },
];

const AppPage = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!selectedDomain) {
      toast({
        title: "Please select a domain",
        description: "Choose a domain to begin analyzing customer churn patterns.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/app/profiles?domain=${selectedDomain}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow hero-gradient py-12 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 opacity-0 animate-fade-in-up">
              Churn Prediction App
            </h1>
            <p className="text-lg text-muted-foreground opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Select a domain to begin analyzing customer churn patterns
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground text-center mb-8">
                Choose Your Domain
              </h2>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
                {domains.map((domain) => (
                  <DomainCard
                    key={domain.id}
                    icon={domain.icon}
                    title={domain.title}
                    iconColor={domain.iconColor}
                    selected={selectedDomain === domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                  />
                ))}
              </div>

              <Button 
                onClick={handleProceed}
                size="lg" 
                className="w-full max-w-xs mx-auto block"
              >
                Proceed
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mt-8 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="h-1 w-16 rounded-full bg-icon-teal" />
            <div className="h-1 w-16 rounded-full bg-icon-orange" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppPage;
