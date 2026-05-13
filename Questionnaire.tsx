import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2, ArrowLeft, ArrowRight, CheckCircle2, User, Phone, Building, GraduationCap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { questions, sections } from "@/data/questions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { calculateScores } from "@/lib/scoring";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type HostelType = Database["public"]["Enums"]["hostel_type"];
type YearType = Database["public"]["Enums"]["year_of_study"];

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState<"profile" | "questions">("profile");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [existingResponses, setExistingResponses] = useState<any>(null);
  
  const [profileData, setProfileData] = useState({
    phone: "",
    hostel: "" as HostelType | "",
    year: "" as YearType | "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/student/login");
      return;
    }

    if (user) {
      loadExistingData();
    }
  }, [user, loading, navigate]);

  const loadExistingData = async () => {
    if (!user) return;

    // Check for existing profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      setExistingProfile(profile);
      setProfileData({
        phone: profile.phone || "",
        hostel: profile.hostel || "",
        year: profile.year || "",
      });
      
      // Check if profile is complete
      if (profile.phone && profile.hostel && profile.year) {
        setStep("questions");
      }
    }

    // Check for existing responses
    const { data: responses } = await supabase
      .from("questionnaire_responses")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (responses) {
      setExistingResponses(responses);
      if (responses.completed) {
        navigate("/student/result");
        return;
      }
      // Load saved answers
      if (responses.responses && typeof responses.responses === 'object') {
        const savedAnswers: Record<number, string> = {};
        Object.entries(responses.responses as Record<string, string>).forEach(([key, value]) => {
          savedAnswers[parseInt(key)] = value;
        });
        setAnswers(savedAnswers);
        // Find first unanswered question
        const firstUnanswered = questions.findIndex(q => !savedAnswers[q.id]);
        if (firstUnanswered > 0) {
          setCurrentQuestion(firstUnanswered);
        }
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          phone: profileData.phone,
          hostel: profileData.hostel as HostelType,
          year: profileData.year as YearType,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setStep("questions");
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsSubmitting(false);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentSection = question?.section || "";
  const sectionQuestions = questions.filter(q => q.section === currentSection);
  const questionInSection = sectionQuestions.findIndex(q => q.id === question?.id) + 1;

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Auto-save to database
    if (user) {
      await supabase
        .from("questionnaire_responses")
        .upsert({
          user_id: user.id,
          responses: newAnswers,
          completed: false,
        }, { onConflict: "user_id" });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Calculate scores
      const { scores, riskFlags } = calculateScores(answers);

      // Save final responses
      await supabase
        .from("questionnaire_responses")
        .upsert({
          user_id: user.id,
          responses: answers,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      // Save compatibility scores
      await supabase
        .from("compatibility_scores")
        .upsert({
          user_id: user.id,
          sleep_score: scores.sleep,
          study_score: scores.study,
          cleanliness_score: scores.cleanliness,
          social_score: scores.social,
          lifestyle_score: scores.lifestyle,
          conflict_score: scores.conflict,
          overall_score: scores.overall,
          risk_flags: riskFlags,
        }, { onConflict: "user_id" });

      toast.success("Questionnaire completed!");
      navigate("/student/result");
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsSubmitting(false);
  };

  const isAnswered = question && answers[question.id] !== undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="py-4 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <Building2 className="w-8 h-8 text-accent" />
            <span className="text-xl font-display font-bold text-foreground">
              RoomMatch
            </span>
          </Link>
        </div>
      </header>

      {step === "profile" ? (
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-elevated">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Complete Your Profile
              </h2>
              <p className="text-muted-foreground mb-6">
                We need a few more details before you start the questionnaire.
              </p>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hostel" className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    Hostel / Block
                  </Label>
                  <Select
                    value={profileData.hostel}
                    onValueChange={(value) => setProfileData({ ...profileData, hostel: value as HostelType })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hostel-a">Hostel A - Boys</SelectItem>
                      <SelectItem value="hostel-b">Hostel B - Boys</SelectItem>
                      <SelectItem value="hostel-c">Hostel C - Girls</SelectItem>
                      <SelectItem value="hostel-d">Hostel D - Girls</SelectItem>
                      <SelectItem value="pg-block">PG Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    Year of Study
                  </Label>
                  <Select
                    value={profileData.year}
                    onValueChange={(value) => setProfileData({ ...profileData, year: value as YearType })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="pg">Post Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Continue to Questionnaire"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="bg-card border-b border-border py-4">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {currentSection}
                </span>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  Section {question?.sectionIndex + 1} of {sections.length} • Q{questionInSection} of {sectionQuestions.length}
                </span>
                <span className="text-xs font-medium text-accent">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-elevated animate-scale-in" key={currentQuestion}>
              <CardContent className="p-8">
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    {currentSection}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {question?.question}
                  </h2>
                </div>

                <RadioGroup
                  value={answers[question?.id] || ""}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {question?.options.map((option, index) => (
                    <div key={index} className="relative">
                      <RadioGroupItem
                        value={option}
                        id={`option-${index}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-card cursor-pointer transition-all duration-200 hover:border-accent/50 hover:bg-accent/5 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10"
                      >
                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center transition-all peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent">
                          {answers[question?.id] === option && (
                            <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
                          )}
                        </div>
                        <span className="text-lg text-foreground">{option}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex items-center justify-between mt-10">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isAnswered || isSubmitting}
                    className="min-w-[140px]"
                  >
                    {currentQuestion === questions.length - 1 ? (
                      isSubmitting ? "Submitting..." : <>Submit <CheckCircle2 className="w-4 h-4 ml-2" /></>
                    ) : (
                      <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Section Indicators */}
          <footer className="py-4 bg-card border-t border-border">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-2">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index < (question?.sectionIndex ?? 0)
                        ? "w-8 bg-accent"
                        : index === (question?.sectionIndex ?? 0)
                        ? "w-12 bg-accent"
                        : "w-8 bg-border"
                    }`}
                    title={section}
                  />
                ))}
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
