import { Card } from "@/components/ui/card";
import bank1 from "@/assets/bank-1.png";
import bank2 from "@/assets/bank-2.png";
import bank3 from "@/assets/bank-3.png";
import bank4 from "@/assets/bank-4.png";
import bank5 from "@/assets/bank-5.png";
import bank6 from "@/assets/bank-6.png";

const banks = [
  { id: 1, name: "National Bank", logo: bank1 },
  { id: 2, name: "Finany Firinat", logo: bank2 },
  { id: 3, name: "Green Finance", logo: bank3 },
  { id: 4, name: "Premier Bank", logo: bank4 },
  { id: 5, name: "Trust Financial", logo: bank5 },
  { id: 6, name: "Secure Banking", logo: bank6 },
];

const PartnerBanks = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Partner Banks
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading financial institutions to bring you the best loan offers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {banks.map((bank) => (
            <Card
              key={bank.id}
              className="p-6 flex items-center justify-center hover:shadow-lg transition-smooth bg-card hover:scale-105 cursor-pointer border-border/50"
            >
              <img
                src={bank.logo}
                alt={bank.name}
                className="w-20 h-20 object-contain"
              />
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            And 44+ more trusted banking partners across India
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerBanks;
