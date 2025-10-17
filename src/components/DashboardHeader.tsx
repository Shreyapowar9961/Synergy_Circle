import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, User, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const DashboardHeader = () => {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user?.role === "admin" ? "/admin/dashboard" : "/citizen/dashboard"} className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">CivicReport</span>
        </Link>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
