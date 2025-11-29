import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Testimonials from "@/components/about/Testimonials";
import { Card } from "@/components/ui/card";
import { Target, Eye, Award, Users, Shield, TrendingUp } from "lucide-react";
import aboutTeam from "@/assets/about-team.png";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We believe in complete transparency throughout the loan process, ensuring you understand every step.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your financial well-being is our priority. We work to find the best loan options tailored to your needs.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards of service and partner only with trusted, reputable banks.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "We're committed to helping individuals and businesses grow through accessible financial solutions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-secondary py-20 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src={aboutTeam}
              alt="Our Team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About LoanConnect
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/95 mb-6">
                Your trusted partner in connecting you with the best loan options
              </p>
              <p className="text-base text-primary-foreground/90">
                We bridge the gap between borrowers and trusted financial institutions, 
                making loan access simple, transparent, and efficient.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Who We Are */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Who We Are</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                LoanConnect is a leading loan facilitation platform that serves as a bridge between borrowers 
                and our extensive network of partner banks. We understand that finding the right loan can be 
                overwhelming, which is why we've simplified the process to make it seamless and stress-free.
              </p>
              <p className="mb-4">
                We don't lend money directly. Instead, we leverage our relationships with over 50 trusted 
                financial institutions to help you find the loan that best matches your requirements. Our 
                platform combines cutting-edge technology with personalized service to ensure you get the 
                best possible loan terms.
              </p>
              <p>
                Since our inception, we've helped thousands of individuals and businesses secure financing 
                for their dreams, whether it's buying a home, starting a business, or pursuing higher education.
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 border-2 border-primary/20 hover:border-primary/40 transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To democratize access to financial services by connecting borrowers with the right lenders, 
                making the loan application process transparent, efficient, and customer-centric. We strive 
                to empower individuals and businesses to achieve their financial goals through responsible lending.
              </p>
            </Card>

            <Card className="p-8 border-2 border-secondary/20 hover:border-secondary/40 transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To become India's most trusted loan facilitation platform, known for our commitment to 
                transparency, customer satisfaction, and innovative financial solutions. We envision a 
                future where everyone has access to fair and affordable credit.
              </p>
            </Card>
          </section>

          {/* Core Values */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These values guide every decision we make and every interaction we have with our customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-smooth">
                    <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Choose LoanConnect?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-lg font-semibold text-foreground mb-2">Partner Banks</div>
                <p className="text-sm text-muted-foreground">
                  Wide network ensures you get the best rates
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">10K+</div>
                <div className="text-lg font-semibold text-foreground mb-2">Happy Customers</div>
                <p className="text-sm text-muted-foreground">
                  Trusted by thousands for their loan needs
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">24hrs</div>
                <div className="text-lg font-semibold text-foreground mb-2">Quick Approval</div>
                <p className="text-sm text-muted-foreground">
                  Fast processing with minimal documentation
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Testimonials */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default About;
