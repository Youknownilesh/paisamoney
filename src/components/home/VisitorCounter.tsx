import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchVisitorStats = async () => {
  // Mock API call - replace with actual API endpoint
  return new Promise<{ total: number; today: number }>((resolve) => {
    setTimeout(() => {
      resolve({
        total: 12847,
        today: 423,
      });
    }, 500);
  });
};

const VisitorCounter = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["visitor-stats"],
    queryFn: fetchVisitorStats,
  });

  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedToday, setAnimatedToday] = useState(0);

  useEffect(() => {
    if (stats) {
      const duration = 2000;
      const steps = 60;
      const totalIncrement = stats.total / steps;
      const todayIncrement = stats.today / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedTotal(Math.floor(totalIncrement * currentStep));
        setAnimatedToday(Math.floor(todayIncrement * currentStep));

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedTotal(stats.total);
          setAnimatedToday(stats.today);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4 animate-pulse">
        <Card className="p-6 bg-muted" />
        <Card className="p-6 bg-muted" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-6 bg-gradient-to-br from-primary to-primary-light text-primary-foreground shadow-smooth hover:shadow-lg transition-smooth">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium mb-2">Total Visitors</p>
            <p className="text-4xl font-bold mb-1">{animatedTotal.toLocaleString()}</p>
            <p className="text-primary-foreground/70 text-xs">All time visits</p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-smooth hover:shadow-lg transition-smooth">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-secondary-foreground/80 text-sm font-medium mb-2">Today's Visitors</p>
            <p className="text-4xl font-bold mb-1">{animatedToday.toLocaleString()}</p>
            <p className="text-secondary-foreground/70 text-xs">In the last 24 hours</p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VisitorCounter;
