import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, PieChart } from "lucide-react";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenureYears, setTenureYears] = useState(3);
  const [showAmortization, setShowAmortization] = useState(false);

  const calculateEMI = () => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenureYears * 12;

    if (R === 0) {
      return P / N;
    }

    const EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    return EMI;
  };

  const emi = calculateEMI();
  const totalAmount = emi * tenureYears * 12;
  const totalInterest = totalAmount - loanAmount;

  const generateAmortizationSchedule = () => {
    const schedule = [];
    let balance = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureYears * 12;

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    return schedule;
  };

  const amortizationSchedule = generateAmortizationSchedule();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const principalPercentage = (loanAmount / totalAmount) * 100;
  const interestPercentage = (totalInterest / totalAmount) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">EMI Calculator</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Calculate your loan EMI, total interest, and view complete amortization schedule
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Loan Details</h2>
                
                <div className="space-y-6">
                  {/* Loan Amount */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="loanAmount">Loan Amount</Label>
                      <span className="text-sm font-semibold text-primary">
                        {formatCurrency(loanAmount)}
                      </span>
                    </div>
                    <Slider
                      id="loanAmount"
                      min={10000}
                      max={10000000}
                      step={10000}
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="mb-2"
                    />
                    <Input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
                      <span className="text-sm font-semibold text-primary">
                        {interestRate}%
                      </span>
                    </div>
                    <Slider
                      id="interestRate"
                      min={1}
                      max={30}
                      step={0.1}
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="mb-2"
                    />
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="mt-2"
                      step="0.1"
                    />
                  </div>

                  {/* Tenure */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="tenure">Tenure (Years)</Label>
                      <span className="text-sm font-semibold text-primary">
                        {tenureYears} years
                      </span>
                    </div>
                    <Slider
                      id="tenure"
                      min={1}
                      max={30}
                      step={1}
                      value={[tenureYears]}
                      onValueChange={(value) => setTenureYears(value[0])}
                      className="mb-2"
                    />
                    <Input
                      type="number"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* EMI Result Card */}
              <Card className="p-8 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                <div className="text-center">
                  <p className="text-primary-foreground/80 mb-2">Monthly EMI</p>
                  <h2 className="text-5xl font-bold mb-6">{formatCurrency(emi)}</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-primary-foreground/80 text-sm mb-1">Principal Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanAmount)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-primary-foreground/80 text-sm mb-1">Total Interest</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-primary-foreground/80 text-sm mb-1">Total Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Breakdown Chart */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-foreground">Payment Breakdown</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Principal</span>
                      <span className="font-semibold text-foreground">
                        {principalPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light"
                        style={{ width: `${principalPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Interest</span>
                      <span className="font-semibold text-foreground">
                        {interestPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-accent"
                        style={{ width: `${interestPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Amortization Schedule */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-foreground">Amortization Schedule</h3>
                  <Button
                    onClick={() => setShowAmortization(!showAmortization)}
                    variant="outline"
                  >
                    {showAmortization ? "Hide" : "Show"} Schedule
                  </Button>
                </div>

                {showAmortization && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>EMI</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amortizationSchedule.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.emi)}</TableCell>
                            <TableCell>{formatCurrency(row.principal)}</TableCell>
                            <TableCell>{formatCurrency(row.interest)}</TableCell>
                            <TableCell>{formatCurrency(row.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EMICalculator;
