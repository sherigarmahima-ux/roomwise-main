import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-accent" />
            <span className="text-xl font-display font-bold text-primary-foreground">
              SyncRoomies
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/student/login")}
            >
              Student Login
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate("/admin/login")}
            >
              Admin Login
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
