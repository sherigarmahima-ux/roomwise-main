import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, Moon, BookOpen, Sparkles, Users, Coffee, MessageCircle, Home, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSummary {
  sleepStyle: string;
  studyStyle: string;
  cleanlinessLevel: string;
  socialStyle: string;
  adaptability: string;
}

const StudentResult = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/student/login");
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading, navigate]);

  const loadData = async () => {
    if (!user) return;

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setProfile(profileData);

    // Load scores
    const { data: scoresData } = await supabase
      .from("compatibility_scores")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (scoresData) {
      setScores(scoresData);
      generateProfileSummary(scoresData);
    } else {
      // No scores yet, redirect to questionnaire
      navigate("/student/questionnaire");
    }
  };

  const generateProfileSummary = (scores: any) => {
    setProfileSummary({
      sleepStyle: scores.sleep_score >= 70
        ? "Structured sleep routine with early bedtime preferences"
        : scores.sleep_score >= 50
        ? "Moderate sleep schedule with some flexibility"
        : "Flexible sleep patterns, comfortable with late nights",
      studyStyle: scores.study_score >= 70
        ? "Prefers quiet, focused study environments"
        : scores.study_score >= 50
        ? "Balanced study approach with moderate structure"
        : "Flexible study habits, adaptable to various environments",
      cleanlinessLevel: scores.cleanliness_score >= 70
        ? "Maintains high cleanliness standards"
        : scores.cleanliness_score >= 50
        ? "Reasonable cleanliness expectations"
        : "Relaxed approach to personal space organization",
      socialStyle: scores.social_score >= 70
        ? "Values privacy and quiet personal space"
        : scores.social_score >= 50
        ? "Balanced social and private time preferences"
        : "Enjoys an active, social room environment",
      adaptability: scores.conflict_score >= 70
        ? "Highly adaptable with strong conflict resolution skills"
        : scores.conflict_score >= 50
        ? "Moderately flexible with reasonable expectations"
        : "Prefers consistent, predictable arrangements",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !profile || !scores || !profileSummary) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const summaryItems = [
    { icon: Moon, label: "Sleep Pattern", value: profileSummary.sleepStyle },
    { icon: BookOpen, label: "Study Style", value: profileSummary.studyStyle },
    { icon: Sparkles, label: "Cleanliness", value: profileSummary.cleanlinessLevel },
    { icon: Users, label: "Social Style", value: profileSummary.socialStyle },
    { icon: MessageCircle, label: "Adaptability", value: profileSummary.adaptability },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="py-4 border-b border-border bg-card">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <Building2 className="w-8 h-8 text-accent" />
            <span className="text-xl font-display font-bold text-foreground">
              RoomMatch
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Banner */}
          <div className="bg-success/10 border border-success/20 rounded-xl p-6 mb-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground mb-1">
                Questionnaire Completed!
              </h1>
              <p className="text-muted-foreground">
                Thank you, {profile.full_name}. Your responses have been recorded and will be used for roommate matching.
              </p>
            </div>
          </div>

          {/* Profile Summary */}
          <Card className="shadow-elevated mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <Coffee className="w-5 h-5 text-accent" />
                Your Living Style Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {summaryItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {item.label}
                    </div>
                    <div className="text-foreground">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold mb-2">
                    What Happens Next?
                  </h3>
                  <p className="text-primary-foreground/80 mb-4">
                    Your responses are now with the hostel administration. The warden will review compatibility scores and make room allocation decisions. You will be notified once your room is assigned.
                  </p>
                  <p className="text-sm text-primary-foreground/60">
                    Note: Final room allocation is decided by hostel administration based on compatibility scores and availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentResult;
