import { Link } from "react-router-dom";
import { BarChart3, Users, TrendingUp, FileText, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  const features = [
    {
      icon: BarChart3,
      title: "App Overview",
      description: "Predicts customers likely to churn and recommends preventive retention actions using advanced machine learning algorithms.",
      iconColor: "coral" as const,
    },
    {
      icon: Users,
      title: "Business Use Cases",
      description: "Banking, Insurance, Retail, Telecom, and Subscription businesses. Adaptable across multiple industries and customer segments.",
      iconColor: "blue" as const,
    },
    {
      icon: TrendingUp,
      title: "Techniques Used",
      description: "Classification, Clustering, and Forecasting techniques to deliver accurate predictions and actionable insights.",
      iconColor: "teal" as const,
    },
    {
      icon: FileText,
      title: "Inputs",
      description: "Customer ID, historical behavior attributes, past transactions, demographics, and engagement metrics for comprehensive analysis.",
      iconColor: "blue" as const,
    },
    {
      icon: Target,
      title: "Outputs",
      description: "Churn probability scores, personalized retention recommendations, risk tier classifications, and actionable insights.",
      iconColor: "coral" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 opacity-0 animate-fade-in-up">
            Churn Prediction
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Predicts customers likely to churn and recommends preventive retention actions.
            <br className="hidden md:block" />
            Empower your business with actionable insights across multiple domains.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Button asChild size="lg" className="px-8">
              <Link to="/app">
                Launch App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor={feature.iconColor}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="flex-grow" />
      <Footer />
    </div>
  );
};

export default Index;
