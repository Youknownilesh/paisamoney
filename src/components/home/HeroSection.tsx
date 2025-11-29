import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary py-20 md:py-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {/* Floating Houses */}
        <div className="absolute top-20 left-[10%] animate-float" style={{ animationDelay: '0s' }}>
          <div className="w-12 h-12 text-white/30">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
        </div>
        <div className="absolute top-40 right-[15%] animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 text-white/20">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
        </div>
        <div className="absolute bottom-32 left-[20%] animate-float" style={{ animationDelay: '4s' }}>
          <div className="w-10 h-10 text-white/25">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
        </div>
        
        {/* Bouncing Rotating Rupee Coin */}
        <div className="absolute top-1/4 right-[25%] animate-bounce-rotate">
          <div className="w-20 h-20 rounded-full bg-accent/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">₹</span>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-[15%] animate-bounce-rotate" style={{ animationDelay: '1.5s' }}>
          <div className="w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">₹</span>
          </div>
        </div>
        
        {/* Money/Coin symbols */}
        <div className="absolute top-1/3 left-[8%] animate-float" style={{ animationDelay: '1s' }}>
          <div className="text-2xl text-white/30">💰</div>
        </div>
        <div className="absolute bottom-1/3 right-[12%] animate-float" style={{ animationDelay: '3s' }}>
          <div className="text-3xl text-white/20">💵</div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Trusted by 10,000+ customers</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Get the Right Loan from Partner Banks
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            We connect you with the best loan options from our network of trusted partner banks. 
            Simple, fast, and transparent loan application process.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button 
              asChild 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-smooth group"
            >
              <Link to="/loans" className="flex items-center gap-2">
                Explore Loans
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-sm border-white/30 text-primary-foreground hover:bg-white/20"
            >
              <Link to="/emi-calculator" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Calculate EMI
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">10K+</div>
              <div className="text-sm text-primary-foreground/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">50+</div>
              <div className="text-sm text-primary-foreground/80">Partner Banks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">₹500Cr+</div>
              <div className="text-sm text-primary-foreground/80">Loans Disbursed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
