import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent, Clock, Wallet, CheckCircle, FileText, Calculator } from "lucide-react";

const mockLoanDetails = {
  "1": {
    id: "1",
    name: "Personal Loan - Fast Approval",
    category: "Personal",
    description: "Get instant personal loans for any emergency or planned expense with our streamlined approval process.",
    overview: "Our Personal Loan is designed for individuals seeking quick financial assistance for various personal needs. Whether it's a medical emergency, wedding expenses, vacation, or debt consolidation, we've got you covered.",
    interestRateMin: 10.5,
    interestRateMax: 18,
    amountMin: 50000,
    amountMax: 2000000,
    tenureMin: 12,
    tenureMax: 60,
    eligibility: [
      "Age: 21-60 years",
      "Minimum monthly income: ₹25,000",
      "Employment: Salaried or self-employed",
      "Credit score: 700+",
      "Minimum 1 year work experience",
    ],
    documents: [
      "Valid ID proof (Aadhar, PAN, Passport)",
      "Address proof (Utility bills, Rent agreement)",
      "Last 3 months salary slips",
      "Last 6 months bank statements",
      "Passport size photographs",
      "Form 16 or ITR for last 2 years",
    ],
    features: [
      "Quick approval within 24 hours",
      "Minimal documentation",
      "Flexible repayment options",
      "No hidden charges",
      "Part-payment facility available",
    ],
  },
};

const fetchLoanDetail = async (id: string) => {
  return new Promise<typeof mockLoanDetails["1"]>((resolve, reject) => {
    setTimeout(() => {
      const loan = mockLoanDetails[id as keyof typeof mockLoanDetails];
      if (loan) {
        resolve(loan);
      } else {
        reject(new Error("Loan not found"));
      }
    }, 300);
  });
};

const LoanDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: loan, isLoading } = useQuery({
    queryKey: ["loan-detail", id],
    queryFn: () => fetchLoanDetail(id!),
    enabled: !!id,
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Crore`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} Lakh`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loan not found</h2>
            <Button asChild>
              <Link to="/loans">Back to Loans</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-secondary py-12 text-primary-foreground">
          <div className="container mx-auto px-4">
            <Badge className="mb-3 bg-white/20 text-primary-foreground border-white/30">
              {loan.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{loan.name}</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">{loan.description}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{loan.overview}</p>
              </Card>

              {/* Key Features */}
              {loan.features && (
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {loan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Eligibility Criteria */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Eligibility Criteria</h2>
                </div>
                <ul className="space-y-2">
                  {loan.eligibility.map((criterion, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {criterion}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Documents Required */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Documents Required</h2>
                </div>
                <ul className="space-y-2">
                  {loan.documents.map((doc, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card className="p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-foreground mb-4">Loan Details</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Percent className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold text-foreground">
                        {loan.interestRateMin}% - {loan.interestRateMax}% p.a.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Wallet className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(loan.amountMin)} - {formatCurrency(loan.amountMax)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tenure</p>
                      <p className="font-semibold text-foreground">
                        {loan.tenureMin} - {loan.tenureMax} months
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full bg-primary hover:bg-primary-dark">
                    <Link to={`/loans/${loan.id}/apply`}>Apply Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/emi-calculator">
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate EMI
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoanDetail;
