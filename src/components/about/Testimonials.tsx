import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import testimonial1 from "@/assets/testimonial-1.png";
import testimonial2 from "@/assets/testimonial-2.png";
import testimonial3 from "@/assets/testimonial-3.png";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Small Business Owner",
    image: testimonial1,
    rating: 5,
    review: "LoanConnect made getting a business loan incredibly easy. The process was transparent, and they found me the best rates from multiple banks. Highly recommended!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Homeowner",
    image: testimonial2,
    rating: 5,
    review: "I was able to secure my dream home loan with excellent terms. The team guided me through every step and answered all my questions promptly. Thank you, LoanConnect!",
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Engineering Student",
    image: testimonial3,
    rating: 5,
    review: "Getting an education loan was stress-free with LoanConnect. They understood my needs and connected me with banks offering student-friendly terms. Truly grateful!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from people who trusted us with their loan needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-xl transition-smooth bg-card">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                "{testimonial.review}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
