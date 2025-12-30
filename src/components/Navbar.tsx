import { Link, useLocation } from "react-router-dom";
import { Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const isAppPage = location.pathname === "/app";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAppPage) {
    return (
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="Churn Prediction Logo"
                className="w-12 h-12"
              />
              <span className="text-lg font-semibold text-foreground">Churn Prediction</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            
              <img
                src="/favicon.ico"
                alt="Churn Prediction Logo"
                className="w-12 h-12"
              />
            <span className="text-lg font-semibold text-foreground">Churn Prediction</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
            <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
              Try the App
            </Link>
            <Link
              to="/app"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border flex flex-col gap-4">
            <Link
              to="/"
              className="text-foreground font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
            <Link
              to="/app"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try the App
            </Link>
            <Link
              to="/app"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
