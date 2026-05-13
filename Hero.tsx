import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Shield, ArrowRight, Play, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DemoRequestDialog } from "./DemoRequestDialog";
import { VideoDialog } from "./VideoDialog";

export const Hero = () => {
  const navigate = useNavigate();
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  return (
    <section className="hero-gradient min-h-[85vh] flex items-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-primary-foreground/90 font-medium">
              Admin-First • Privacy-Focused • India-Ready
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Better Roommates.
            <br />
            <span className="text-accent">Fewer Conflicts.</span>
            <br />
            Smarter Hostels.
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-6 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Reduce student complaints, eliminate manual room allocation, and build harmonious hostels—backed by data.
          </p>

          <p className="text-sm md:text-base text-primary-foreground/60 mb-10 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.15s" }}>
            SyncRoomies uses structured preference data and compatibility scoring to allocate roommates fairly and transparently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => setDemoDialogOpen(true)}
              className="group"
            >
              <Building2 className="w-5 h-5" />
              Request Demo (For Hostels)
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl"
              onClick={() => navigate("/admin/login")}
              className="group"
            >
              <Shield className="w-5 h-5" />
              Get Started as Admin
            </Button>
            <Button 
              variant="ghost" 
              size="xl"
              onClick={() => setVideoDialogOpen(true)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 group"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </Button>
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Privacy-first. No social tracking.</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span>Built for Indian hostels & PGs</span>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">50</div>
              <div className="text-sm text-primary-foreground/60">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">6</div>
              <div className="text-sm text-primary-foreground/60">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">&lt;10</div>
              <div className="text-sm text-primary-foreground/60">Minutes</div>
            </div>
          </div>
        </div>
      </div>

      <DemoRequestDialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen} />
      <VideoDialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen} />
    </section>
  );
};
