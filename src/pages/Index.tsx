import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import VisitorCounter from "@/components/home/VisitorCounter";
import LoanCategories from "@/components/home/LoanCategories";
import HowItWorks from "@/components/home/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroCarousel />
        
        <div className="container mx-auto px-4 -mt-12 relative z-20">
          <VisitorCounter />
        </div>

        <div className="container mx-auto px-4 mt-16">
          <LoanCategories />
        </div>

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
