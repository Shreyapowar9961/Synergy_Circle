import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const success = login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        // Navigate based on role
        const currentUser = useStore.getState().user;
        if (currentUser?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/citizen/dashboard');
        }
      } else {
        toast.error("Invalid credentials. Try admin@civic.gov / admin123 or citizen@example.com / citizen123");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">CivicReport</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Login to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground text-center">
            
              
            </div>
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
