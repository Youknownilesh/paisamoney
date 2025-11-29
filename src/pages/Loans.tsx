import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoanCard from "@/components/loans/LoanCard";
import PartnerBanks from "@/components/home/PartnerBanks";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const mockLoanProducts = [
  {
    id: "1",
    name: "Personal Loan - Fast Approval",
    description: "Get instant personal loans for any emergency or planned expense. Quick approval within 24 hours.",
    interestRateMin: 10.5,
    interestRateMax: 18,
    amountMin: 50000,
    amountMax: 2000000,
    tenureMin: 12,
    tenureMax: 60,
    category: "Personal",
  },
  {
    id: "2",
    name: "Home Loan - Low Interest",
    description: "Realize your dream of owning a home with our attractive home loan schemes at competitive rates.",
    interestRateMin: 8.5,
    interestRateMax: 11,
    amountMin: 500000,
    amountMax: 50000000,
    tenureMin: 60,
    tenureMax: 300,
    category: "Home",
  },
  {
    id: "3",
    name: "Education Loan - Student Friendly",
    description: "Pursue higher education without financial constraints. Special rates for students.",
    interestRateMin: 9,
    interestRateMax: 12,
    amountMin: 100000,
    amountMax: 10000000,
    tenureMin: 36,
    tenureMax: 180,
    category: "Education",
  },
  {
    id: "4",
    name: "Business Loan - Growth Capital",
    description: "Expand your business with flexible business loans. No collateral required up to ₹50L.",
    interestRateMin: 12,
    interestRateMax: 20,
    amountMin: 200000,
    amountMax: 20000000,
    tenureMin: 12,
    tenureMax: 84,
    category: "Business",
  },
  {
    id: "5",
    name: "Vehicle Loan - New & Used",
    description: "Buy your dream car or bike with easy EMIs. Covers both new and used vehicles.",
    interestRateMin: 9.5,
    interestRateMax: 14,
    amountMin: 100000,
    amountMax: 5000000,
    tenureMin: 12,
    tenureMax: 84,
    category: "Vehicle",
  },
  {
    id: "6",
    name: "Property Loan - Commercial",
    description: "Finance your commercial property purchase or construction with attractive terms.",
    interestRateMin: 10,
    interestRateMax: 13,
    amountMin: 1000000,
    amountMax: 100000000,
    tenureMin: 60,
    tenureMax: 240,
    category: "Property",
  },
];

const fetchLoanProducts = async () => {
  // Mock API call
  return new Promise<typeof mockLoanProducts>((resolve) => {
    setTimeout(() => resolve(mockLoanProducts), 300);
  });
};

const Loans = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: loans, isLoading } = useQuery({
    queryKey: ["loan-products"],
    queryFn: fetchLoanProducts,
  });

  const filteredLoans = loans?.filter((loan) => {
    const matchesSearch = loan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || loan.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Loan Products</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Explore our comprehensive range of loan products designed to meet your financial needs
            </p>
          </div>
        </section>

        {/* Partner Banks */}
        <PartnerBanks />

        {/* Filters */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search loans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Vehicle">Vehicle</SelectItem>
                <SelectItem value="Property">Property</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Loan Cards */}
        <section className="container mx-auto px-4 pb-16">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredLoans?.length || 0} loan products
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLoans?.map((loan) => (
                  <LoanCard key={loan.id} {...loan} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Loans;
