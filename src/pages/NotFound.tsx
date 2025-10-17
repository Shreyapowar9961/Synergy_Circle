import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full animate-fade-in">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
