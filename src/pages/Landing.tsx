import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, TrendingUp, Shield } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { translateText } from "@/lib/translate";

const Landing = () => {
  const { currentLanguage, setLanguage } = useStore();
  const [translatedTexts, setTranslatedTexts] = useState({
    title: "CivicReport",
    subtitle: "Report. Track. Improve Your Community.",
    description: "CivicReport empowers citizens to easily report local issues and helps municipal staff respond efficiently. Together, we build better communities.",
    submitReport: "Submit a Report",
    viewDashboard: "View Dashboard",
    login: "Login",
    getStarted: "Get Started",
    easyReporting: "Easy Reporting",
    easyReportingDesc: "Report issues with photos and automatic location tagging in seconds.",
    realTimeTracking: "Real-time Tracking",
    realTimeTrackingDesc: "Monitor the status of your reports from submission to resolution.",
    communityImpact: "Community Impact",
    communityImpactDesc: "See how your reports contribute to improving your neighborhood.",
    municipalTools: "Municipal Tools",
    municipalToolsDesc: "Powerful dashboard for city staff to manage and prioritize issues.",
    reportsSubmitted: "Reports Submitted",
    issuesResolved: "Issues Resolved",
    citizenSatisfaction: "Citizen Satisfaction",
    buildingCommunities: "Building better communities together."
  });

  useEffect(() => {
    const translateAllTexts = async () => {
      console.log('Language changed to:', currentLanguage);

      if (currentLanguage === 'en') {
        console.log('Setting English texts');
        setTranslatedTexts({
          title: "CivicReport",
          subtitle: "Report. Track. Improve Your Community.",
          description: "CivicReport empowers citizens to easily report local issues and helps municipal staff respond efficiently. Together, we build better communities.",
          submitReport: "Submit a Report",
          viewDashboard: "View Dashboard",
          login: "Login",
          getStarted: "Get Started",
          easyReporting: "Easy Reporting",
          easyReportingDesc: "Report issues with photos and automatic location tagging in seconds.",
          realTimeTracking: "Real-time Tracking",
          realTimeTrackingDesc: "Monitor the status of your reports from submission to resolution.",
          communityImpact: "Community Impact",
          communityImpactDesc: "See how your reports contribute to improving your neighborhood.",
          municipalTools: "Municipal Tools",
          municipalToolsDesc: "Powerful dashboard for city staff to manage and prioritize issues.",
          reportsSubmitted: "Reports Submitted",
          issuesResolved: "Issues Resolved",
          citizenSatisfaction: "Citizen Satisfaction",
          buildingCommunities: "Building better communities together."
        });
        return;
      }

      console.log('Starting translation to:', currentLanguage);
      try {
        // Test translation with a simple text first
        const testTranslation = await translateText("Hello", currentLanguage);
        console.log('Test translation successful:', testTranslation);

        // Translate each text individually for better accuracy
        const [
          title,
          subtitle,
          description,
          submitReport,
          viewDashboard,
          login,
          getStarted,
          easyReporting,
          easyReportingDesc,
          realTimeTracking,
          realTimeTrackingDesc,
          communityImpact,
          communityImpactDesc,
          municipalTools,
          municipalToolsDesc,
          reportsSubmitted,
          issuesResolved,
          citizenSatisfaction,
          buildingCommunities
        ] = await Promise.all([
          translateText("CivicReport", currentLanguage),
          translateText("Report. Track. Improve Your Community.", currentLanguage),
          translateText("CivicReport empowers citizens to easily report local issues and helps municipal staff respond efficiently. Together, we build better communities.", currentLanguage),
          translateText("Submit a Report", currentLanguage),
          translateText("View Dashboard", currentLanguage),
          translateText("Login", currentLanguage),
          translateText("Get Started", currentLanguage),
          translateText("Easy Reporting", currentLanguage),
          translateText("Report issues with photos and automatic location tagging in seconds.", currentLanguage),
          translateText("Real-time Tracking", currentLanguage),
          translateText("Monitor the status of your reports from submission to resolution.", currentLanguage),
          translateText("Community Impact", currentLanguage),
          translateText("See how your reports contribute to improving your neighborhood.", currentLanguage),
          translateText("Municipal Tools", currentLanguage),
          translateText("Powerful dashboard for city staff to manage and prioritize issues.", currentLanguage),
          translateText("Reports Submitted", currentLanguage),
          translateText("Issues Resolved", currentLanguage),
          translateText("Citizen Satisfaction", currentLanguage),
          translateText("Building better communities together.", currentLanguage)
        ]);

        console.log('All translations completed successfully');
        setTranslatedTexts({
          title,
          subtitle,
          description,
          submitReport,
          viewDashboard,
          login,
          getStarted,
          easyReporting,
          easyReportingDesc,
          realTimeTracking,
          realTimeTrackingDesc,
          communityImpact,
          communityImpactDesc,
          municipalTools,
          municipalToolsDesc,
          reportsSubmitted,
          issuesResolved,
          citizenSatisfaction,
          buildingCommunities
        });
      } catch (error) {
        console.error('Translation failed:', error);
        // Fallback to English if translation fails
        setTranslatedTexts({
          title: "CivicReport",
          subtitle: "Report. Track. Improve Your Community.",
          description: "CivicReport empowers citizens to easily report local issues and helps municipal staff respond efficiently. Together, we build better communities.",
          submitReport: "Submit a Report",
          viewDashboard: "View Dashboard",
          login: "Login",
          getStarted: "Get Started",
          easyReporting: "Easy Reporting",
          easyReportingDesc: "Report issues with photos and automatic location tagging in seconds.",
          realTimeTracking: "Real-time Tracking",
          realTimeTrackingDesc: "Monitor the status of your reports from submission to resolution.",
          communityImpact: "Community Impact",
          communityImpactDesc: "See how your reports contribute to improving your neighborhood.",
          municipalTools: "Municipal Tools",
          municipalToolsDesc: "Powerful dashboard for city staff to manage and prioritize issues.",
          reportsSubmitted: "Reports Submitted",
          issuesResolved: "Issues Resolved",
          citizenSatisfaction: "Citizen Satisfaction",
          buildingCommunities: "Building better communities together."
        });
      }
    };

    translateAllTexts();
  }, [currentLanguage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{translatedTexts.title}</h1>
          </div>
          <div className="flex gap-4 items-center">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={setLanguage}
            />
            <Button variant="outline" asChild>
              <Link to="/login">{translatedTexts.login}</Link>
            </Button>
            <Button asChild>
              <Link to="/register">{translatedTexts.getStarted}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {translatedTexts.subtitle}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {translatedTexts.description}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild className="transition-transform hover:scale-105">
            <Link to="/register">{translatedTexts.submitReport}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105">
            <Link to="/login">{translatedTexts.viewDashboard}</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <MapPin className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{translatedTexts.easyReporting}</h3>
            <p className="text-muted-foreground">
              {translatedTexts.easyReportingDesc}
            </p>
          </Card>

          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <TrendingUp className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{translatedTexts.realTimeTracking}</h3>
            <p className="text-muted-foreground">
              {translatedTexts.realTimeTrackingDesc}
            </p>
          </Card>

          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{translatedTexts.communityImpact}</h3>
            <p className="text-muted-foreground">
              {translatedTexts.communityImpactDesc}
            </p>
          </Card>

          <Card className="p-6 transition-all hover:shadow-lg hover:-translate-y-1">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{translatedTexts.municipalTools}</h3>
            <p className="text-muted-foreground">
              {translatedTexts.municipalToolsDesc}
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
              <div className="text-muted-foreground">{translatedTexts.reportsSubmitted}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,823</div>
              <div className="text-muted-foreground">{translatedTexts.issuesResolved}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">94%</div>
              <div className="text-muted-foreground">{translatedTexts.citizenSatisfaction}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 CivicReport. {translatedTexts.buildingCommunities}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
