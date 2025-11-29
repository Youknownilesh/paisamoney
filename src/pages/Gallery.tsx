import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const mockGalleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80",
    title: "Customer Success Story",
    description: "Happy customer receiving their home loan approval",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80",
    title: "Team Meeting",
    description: "Our team discussing new partnership opportunities",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    title: "Financial Planning",
    description: "Helping clients plan their financial future",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
    title: "Office Space",
    description: "Our modern office environment",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    title: "Client Consultation",
    description: "One-on-one consultation with loan experts",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
    title: "Award Ceremony",
    description: "Receiving industry recognition for our services",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    title: "Data Analysis",
    description: "Analyzing market trends for better loan offers",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&q=80",
    title: "Team Collaboration",
    description: "Working together to serve our customers better",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    title: "Business Growth",
    description: "Celebrating milestones with our partner banks",
  },
];

const fetchGalleryImages = async () => {
  return new Promise<typeof mockGalleryImages>((resolve) => {
    setTimeout(() => resolve(mockGalleryImages), 300);
  });
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<typeof mockGalleryImages[0] | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGalleryImages,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              A glimpse into our journey, team, and the moments that matter
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <div className="container mx-auto px-4 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-video bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images?.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-video overflow-hidden rounded-lg cursor-pointer shadow-smooth hover:shadow-lg transition-smooth"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                      <p className="text-sm text-white/80">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-smooth"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto"
              />
              <div className="p-6 bg-card">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-muted-foreground">{selectedImage.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
