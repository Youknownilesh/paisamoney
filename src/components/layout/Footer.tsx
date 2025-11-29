import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LoanConnect</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted partner in connecting you with the best loan options from our network of partner banks.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/loans" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Loan Products
                </Link>
              </li>
              <li>
                <Link to="/emi-calculator" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Loan Types */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Loan Types</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">Personal Loan</li>
              <li className="text-muted-foreground text-sm">Home Loan</li>
              <li className="text-muted-foreground text-sm">Education Loan</li>
              <li className="text-muted-foreground text-sm">Business Loan</li>
              <li className="text-muted-foreground text-sm">Vehicle Loan</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>123 Finance Street, Business District, City 10001</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>info@loanconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LoanConnect. All rights reserved. | 
            <Link to="/contact" className="hover:text-primary transition-smooth ml-1">Privacy Policy</Link> | 
            <Link to="/contact" className="hover:text-primary transition-smooth ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
