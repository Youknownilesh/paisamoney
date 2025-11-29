import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent, Clock, Wallet } from "lucide-react";
import personalLoanImg from "@/assets/loan-personal.png";
import homeLoanImg from "@/assets/loan-home.png";
import educationLoanImg from "@/assets/loan-education.png";
import businessLoanImg from "@/assets/loan-business.png";
import vehicleLoanImg from "@/assets/loan-vehicle.png";
import propertyLoanImg from "@/assets/loan-property.png";

interface LoanCardProps {
  id: string;
  name: string;
  description: string;
  interestRateMin: number;
  interestRateMax: number;
  amountMin: number;
  amountMax: number;
  tenureMin: number;
  tenureMax: number;
  category?: string;
}

const LoanCard = ({
  id,
  name,
  description,
  interestRateMin,
  interestRateMax,
  amountMin,
  amountMax,
  tenureMin,
  tenureMax,
  category,
}: LoanCardProps) => {
  const categoryImages: Record<string, string> = {
    Personal: personalLoanImg,
    Home: homeLoanImg,
    Education: educationLoanImg,
    Business: businessLoanImg,
    Vehicle: vehicleLoanImg,
    Property: propertyLoanImg,
  };

  const categoryColors: Record<string, string> = {
    Personal: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20",
    Home: "from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20",
    Education: "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20",
    Business: "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
    Vehicle: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
    Property: "from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20",
  };

  const loanImage = categoryImages[category || ""] || personalLoanImg;
  const bgGradient = categoryColors[category || ""] || categoryColors.Personal;
  
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <Card className={`p-6 hover:shadow-xl transition-smooth border-border/50 group relative overflow-hidden bg-gradient-to-br ${bgGradient}`}>
      {/* Background Image */}
      <div className="absolute top-4 right-4 w-28 h-28 opacity-10 group-hover:opacity-20 transition-smooth group-hover:scale-110">
        <img src={loanImage} alt={category} className="w-full h-full object-contain" />
      </div>

      {category && (
        <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30 backdrop-blur-sm relative z-10">
          {category}
        </Badge>
      )}
      
      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth relative z-10">
        {name}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 relative z-10">
        {description}
      </p>

      <div className="space-y-3 mb-4 relative z-10">
        <div className="flex items-center gap-2 text-sm bg-card/60 backdrop-blur-sm p-2 rounded-lg">
          <div className="p-1.5 bg-primary/10 rounded">
            <Percent className="w-4 h-4 text-primary" />
          </div>
          <span className="text-muted-foreground">Interest:</span>
          <span className="font-semibold text-foreground ml-auto">
            {interestRateMin}% - {interestRateMax}% p.a.
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm bg-card/60 backdrop-blur-sm p-2 rounded-lg">
          <div className="p-1.5 bg-secondary/10 rounded">
            <Wallet className="w-4 h-4 text-secondary" />
          </div>
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-semibold text-foreground ml-auto">
            {formatCurrency(amountMin)} - {formatCurrency(amountMax)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm bg-card/60 backdrop-blur-sm p-2 rounded-lg">
          <div className="p-1.5 bg-accent/10 rounded">
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <span className="text-muted-foreground">Tenure:</span>
          <span className="font-semibold text-foreground ml-auto">
            {tenureMin} - {tenureMax} months
          </span>
        </div>
      </div>

      <div className="flex gap-2 relative z-10">
        <Button asChild variant="outline" className="flex-1 bg-card/80 backdrop-blur-sm hover:bg-card shadow-md hover:shadow-lg">
          <Link to={`/loans/${id}`}>View Details</Link>
        </Button>
        <Button asChild className="flex-1 bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg">
          <Link to={`/loans/${id}/apply`}>Apply Now</Link>
        </Button>
      </div>
    </Card>
  );
};

export default LoanCard;
