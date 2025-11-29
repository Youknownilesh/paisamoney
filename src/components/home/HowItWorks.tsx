import { Card } from "@/components/ui/card";
import { Search, FileText, CheckCircle } from "lucide-react";
import searchImg from "@/assets/step-search.png";
import documentImg from "@/assets/step-document.png";
import approvedImg from "@/assets/step-approved.png";

const steps = [
  {
    icon: Search,
    title: "Choose Your Loan",
    description: "Browse through our catalog and select the loan product that best fits your needs.",
    number: "01",
    image: searchImg,
  },
  {
    icon: FileText,
    title: "Submit Application",
    description: "Fill out a simple online application form with your details and required documents.",
    number: "02",
    image: documentImg,
  },
  {
    icon: CheckCircle,
    title: "Get Connected",
    description: "We connect you with our partner banks who will process and approve your loan.",
    number: "03",
    image: approvedImg,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting your loan is as easy as 1-2-3. Follow our simple process to secure financing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-6 text-center relative hover:shadow-lg transition-smooth bg-card group">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold shadow-md">
                    {step.number}
                  </div>
                </div>

                {/* Illustration Image */}
                <div className="mt-6 mb-4 flex justify-center">
                  <div className="w-24 h-24 relative group-hover:scale-110 transition-smooth">
                    <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>

                {/* Connector Line (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
