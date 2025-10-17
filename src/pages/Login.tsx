import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Core login function and navigation logic retained as instructed
    const login = useStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // --- Authentication Logic (UNCHANGED) ---
        // Simulate API delay
        setTimeout(() => {
            const success = login(email, password);
            
            if (success) {
                toast.success("Login successful! Redirecting...");
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
        // --- End of Authentication Logic ---
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* 1. Background Animation Layer */}
            <div 
                className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-50 via-sky-100 to-blue-50"
                style={{
                    // These styles enable the color gradient shift animation defined in tailwind.config.ts
                    backgroundSize: '400% 400%',
                    animation: 'gradient-shift 15s ease infinite',
                }}
            >
                {/* Optional subtle overlay/backdrop for contrast */}
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
            </div>

            {/* 2. Content Card (Z-indexed above the background) */}
            <div className="w-full max-w-md animate-fade-in z-10">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <Shield className="h-10 w-10 text-primary" />
                        <span className="text-2xl font-bold">CivicReport</span>
                    </Link>
                </div>

                <Card className="shadow-2xl border-2 border-primary/20">
                    <CardHeader className="pt-8">
                        <CardTitle className="text-3xl font-extrabold text-primary text-center">Sign in to continue</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground text-center">Access your citizen or admin dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 text-base focus-visible:ring-primary"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-base font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 text-base focus-visible:ring-primary"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 text-lg bg-primary hover:bg-primary/90 transition-colors" 
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4 pb-8">
                        <div className="text-sm text-center">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary font-semibold hover:underline transition-colors">
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
