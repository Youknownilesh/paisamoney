import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, GraduationCap, Briefcase, Car, CreditCard, Building } from "lucide-react";
import personalLoanImg from "@/assets/loan-personal.png";
import homeLoanImg from "@/assets/loan-home.png";
import educationLoanImg from "@/assets/loan-education.png";
import businessLoanImg from "@/assets/loan-business.png";
import vehicleLoanImg from "@/assets/loan-vehicle.png";
import propertyLoanImg from "@/assets/loan-property.png";

const categories = [
  {
    icon: CreditCard,
    title: "Personal Loan",
    description: "Quick funds for any personal need with flexible repayment options.",
    color: "from-blue-500 to-blue-600",
    image: personalLoanImg,
  },
  {
    icon: Home,
    title: "Home Loan",
    description: "Make your dream home a reality with attractive interest rates.",
    color: "from-green-500 to-green-600",
    image: homeLoanImg,
  },
  {
    icon: GraduationCap,
    title: "Education Loan",
    description: "Invest in your future with hassle-free education financing.",
    color: "from-purple-500 to-purple-600",
    image: educationLoanImg,
  },
  {
    icon: Briefcase,
    title: "Business Loan",
    description: "Grow your business with customized loan solutions.",
    color: "from-orange-500 to-orange-600",
    image: businessLoanImg,
  },
  {
    icon: Car,
    title: "Vehicle Loan",
    description: "Drive your dream vehicle with competitive loan rates.",
    color: "from-red-500 to-red-600",
    image: vehicleLoanImg,
  },
  {
    icon: Building,
    title: "Property Loan",
    description: "Finance your commercial property investments easily.",
    color: "from-teal-500 to-teal-600",
    image: propertyLoanImg,
  },
];

const LoanCategories = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Explore Loan Categories
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from a wide range of loan products tailored to meet your specific financial needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-smooth group cursor-pointer border-border relative overflow-hidden"
            >
              {/* Illustration Badge */}
              <div className="absolute top-4 right-4 w-32 h-32 opacity-20 group-hover:opacity-30 transition-smooth group-hover:scale-110">
                <img src={category.image} alt={category.title} className="w-full h-full object-contain" />
              </div>
              
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-smooth relative z-10`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {category.description}
              </p>
              <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                <Link to="/loans">View Details</Link>
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default LoanCategories;
