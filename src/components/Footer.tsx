import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground py-6">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-footer-foreground/70">
            © 2025 AlgoAnalytics. All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-footer-foreground/70 hover:text-footer-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-footer-foreground/70 hover:text-footer-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-footer-foreground/70 hover:text-footer-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
