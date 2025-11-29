import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Home, Car, GraduationCap, Coins } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import heroRupeeCoin from "@/assets/hero-rupee-coin.png";
import heroHomeHand from "@/assets/hero-home-hand.png";
import heroCar from "@/assets/hero-car.png";
import heroEducation from "@/assets/hero-education.png";

const slides = [
  {
    id: 1,
    icon: Coins,
    badge: "Quick & Easy Process",
    title: "Get Instant Personal Loans",
    subtitle: "From ₹50,000 to ₹25 Lakhs at competitive interest rates starting from 10.5% per annum",
    cta: "Apply Now",
    ctaLink: "/loans",
    image: heroRupeeCoin,
    imageClass: "animate-spin-slow",
  },
  {
    id: 2,
    icon: Home,
    badge: "Home Loan Specialists",
    title: "Turn Your Dream Home Into Reality",
    subtitle: "Low interest rates, flexible tenure up to 30 years. Get loans up to ₹5 Crores with minimal documentation",
    cta: "Explore Home Loans",
    ctaLink: "/loans",
    image: heroHomeHand,
    imageClass: "animate-float-slow",
  },
  {
    id: 3,
    icon: Car,
    badge: "Drive Your Dreams",
    title: "Get Your Dream Car Today",
    subtitle: "Vehicle loans with interest rates starting at 8.5%. New & used cars, up to 90% financing available",
    cta: "Check Vehicle Loans",
    ctaLink: "/loans",
    image: heroCar,
    imageClass: "animate-slide-left",
  },
  {
    id: 4,
    icon: GraduationCap,
    badge: "Invest in Education",
    title: "Build Your Future with Education Loans",
    subtitle: "Study in India or abroad. Loans up to ₹1.5 Crores with flexible repayment starting after course completion",
    cta: "View Education Loans",
    ctaLink: "/loans",
    image: heroEducation,
    imageClass: "animate-pulse-slow",
  },
];

const HeroCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary min-h-screen flex items-center">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative min-h-screen flex items-center py-20">
                {/* Animated Background Image */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={slide.image}
                    alt=""
                    className={`w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1000px] lg:h-[1000px] object-contain opacity-15 ${slide.imageClass}`}
                  />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <slide.icon className="w-5 h-5 text-primary-foreground" />
                      <span className="text-sm font-medium text-primary-foreground">
                        {slide.badge}
                      </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                      {slide.title}
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-primary-foreground/95 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                      {slide.subtitle}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                      <Button
                        asChild
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-smooth group text-lg px-8 py-6"
                      >
                        <Link to={slide.ctaLink} className="flex items-center gap-2">
                          {slide.cta}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-smooth" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="bg-white/10 backdrop-blur-sm border-white/30 text-primary-foreground hover:bg-white/20 text-lg px-8 py-6"
                      >
                        <Link to="/emi-calculator" className="flex items-center gap-2">
                          <Calculator className="w-5 h-5" />
                          Calculate EMI
                        </Link>
                      </Button>
                    </div>

                    {/* Trust Indicators - Only on first slide */}
                    {index === 0 && (
                      <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                            10K+
                          </div>
                          <div className="text-sm text-primary-foreground/80">Happy Customers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                            50+
                          </div>
                          <div className="text-sm text-primary-foreground/80">Partner Banks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                            ₹500Cr+
                          </div>
                          <div className="text-sm text-primary-foreground/80">Loans Disbursed</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                current === index
                  ? "bg-accent w-8"
                  : "bg-white/40 w-2 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
