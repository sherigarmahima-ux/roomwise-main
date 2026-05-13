import { Lock, Building2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-accent" />
            <span className="text-xl font-display font-bold text-primary-foreground">
              SyncRoomies
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Lock className="w-4 h-4" />
            <span className="text-sm">
              Privacy-first. No personality labels shown to students.
            </span>
          </div>
          
          <div className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} SyncRoomies. Designed for Indian Hostels.
          </div>
        </div>
      </div>
    </footer>
  );
};
