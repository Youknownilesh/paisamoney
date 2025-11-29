import { Wrench, Mail, Phone, Clock } from 'lucide-react';
import { useMaintenance } from '@/contexts/MaintenanceContext';

const MaintenancePage = () => {
  const { maintenanceMessage } = useMaintenance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
            <Wrench className="w-16 h-16 text-white animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 border border-border">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            We'll Be Back Soon!
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6 rounded-full" />
          
          <p className="text-lg text-muted-foreground mb-6">
            {maintenanceMessage || 
              "Our website is currently undergoing scheduled maintenance to improve your experience. We apologize for any inconvenience and appreciate your patience."
            }
          </p>

          {/* Estimated Time */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Estimated downtime: A few hours</span>
          </div>

          {/* Contact Info */}
          <div className="border-t border-border pt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Need Urgent Assistance?
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:support@financeloan.com" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>support@financeloan.com</span>
              </a>
              <span className="hidden sm:block text-border">|</span>
              <a 
                href="tel:+911234567890" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+91 123 456 7890</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-muted-foreground">
          Thank you for your patience. We're working hard to bring you a better experience.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
