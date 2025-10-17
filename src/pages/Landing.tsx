import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, TrendingUp, Shield } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">CivicReport</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Report. Track. Improve Your Community.
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          CivicReport empowers citizens to easily report local issues and helps municipal staff respond efficiently. Together, we build better communities.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild className="transition-transform hover:scale-105">
            <Link to="/register">Submit a Report</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105">
            <Link to="/login">View Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <MapPin className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Reporting</h3>
            <p className="text-muted-foreground">
              Report issues with photos and automatic location tagging in seconds.
            </p>
          </Card>
          
          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <TrendingUp className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor the status of your reports from submission to resolution.
            </p>
          </Card>
          
          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
            <p className="text-muted-foreground">
              See how your reports contribute to improving your neighborhood.
            </p>
          </Card>
          
          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Municipal Tools</h3>
            <p className="text-muted-foreground">
              Powerful dashboard for city staff to manage and prioritize issues.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2,547</div>
              <div className="text-muted-foreground">Reports Submitted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,823</div>
              <div className="text-muted-foreground">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">94%</div>
              <div className="text-muted-foreground">Citizen Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 CivicReport. Building better communities together.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
