import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Vineeet Shrivastava",
    role: "Founder & CEO",
    bio: "15+ years of experience in fintech and banking sectors. Passionate about making finance accessible to all.",
    image: "",
    linkedin: "#",
    email: "rajesh@loanconnect.com",
  },
  {
    name: "Vikash Kumar Mishra",
    role: "Chief Operations Officer",
    bio: "Expert in operations management with a track record of scaling financial services platforms.",
    image: "",
    linkedin: "#",
    email: "priya@loanconnect.com",
  },
  {
    name: "Amit Patel",
    role: "Head of Technology",
    bio: "Technology leader with expertise in building secure and scalable financial platforms.",
    image: "",
    linkedin: "#",
    email: "amit@loanconnect.com",
  },
  {
    name: "Sneha Reddy",
    role: "Head of Customer Success",
    bio: "Dedicated to ensuring every customer has a seamless loan application experience.",
    image: "",
    linkedin: "#",
    email: "sneha@loanconnect.com",
  },
  {
    name: "Vikram Singh",
    role: "Head of Partnerships",
    bio: "Building strong relationships with banks and financial institutions nationwide.",
    image: "",
    linkedin: "#",
    email: "vikram@loanconnect.com",
  },
  {
    name: "Anita Desai",
    role: "Head of Compliance",
    bio: "Ensuring all operations meet regulatory standards and customer data remains secure.",
    image: "",
    linkedin: "#",
    email: "anita@loanconnect.com",
  },
];

const Team = () => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              The talented people behind LoanConnect, working tirelessly to make your loan journey smooth
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-smooth">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <Avatar className="w-24 h-24 mb-4 border-4 border-primary/10">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl font-bold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    <a
                      href={member.linkedin}
                      className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Join Us Section */}
          <section className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for making finance accessible. 
              If you're interested in joining LoanConnect, we'd love to hear from you.
            </p>
            <a
              href="mailto:careers@loanconnect.com"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-smooth"
            >
              <Mail className="w-5 h-5" />
              careers@loanconnect.com
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
