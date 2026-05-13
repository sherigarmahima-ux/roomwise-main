import { GraduationCap, Shield, Clock, BarChart3 } from "lucide-react";

const studentBenefits = [
  "Comfortable living environment from day one",
  "Matched with compatible sleep schedules",
  "Fewer adjustments and conflicts",
  "Better focus on academics",
];

const wardenBenefits = [
  "Objective, data-backed decisions",
  "Reduced room change requests",
  "Fewer mediation sessions",
  "Faster allocation process",
];

export const Benefits = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-success uppercase tracking-wide">
            Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Better Outcomes for Everyone
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Students Card */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                For Students
              </h3>
            </div>
            <ul className="space-y-4">
              {studentBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Wardens Card */}
          <div className="bg-primary rounded-2xl p-8 shadow-elevated">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary-foreground">
                For Wardens
              </h3>
            </div>
            <ul className="space-y-4">
              {wardenBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-primary-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">&lt;10</div>
            <div className="text-sm text-muted-foreground">Min to complete</div>
          </div>
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <BarChart3 className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">100+</div>
            <div className="text-sm text-muted-foreground">Students in 30 min</div>
          </div>
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Labels shown</div>
          </div>
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <GraduationCap className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">100%</div>
            <div className="text-sm text-muted-foreground">Privacy-first</div>
          </div>
        </div>
      </div>
    </section>
  );
};
