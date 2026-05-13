import { ClipboardList, Calculator, Settings, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Structured Questionnaire",
    description: "50 carefully designed questions covering sleep habits, cleanliness, study preferences, and lifestyle choices specific to Indian hostel life.",
  },
  {
    icon: Calculator,
    step: "02",
    title: "Compatibility Scoring",
    description: "Transparent scoring algorithm with weighted categories. Admins see exactly why students are compatible or flagged as high-risk.",
  },
  {
    icon: Settings,
    step: "03",
    title: "Admin-Controlled Allocation",
    description: "Wardens make final decisions with data-backed recommendations. Drag-and-drop interface for manual adjustments.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Conflict Prevention",
    description: "Risk indicators highlight potential issues before they happen. Critical mismatches like smoking preferences are flagged automatically.",
  },
];

export const Solution = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-accent uppercase tracking-wide">
            Our Solution
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Data-Driven, Admin-Controlled
          </h2>
          <p className="text-lg text-muted-foreground">
            A systematic approach that respects both student preferences and administrative authority.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-8 shadow-card border border-border flex gap-6 group hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl accent-gradient flex items-center justify-center shadow-md">
                  <step.icon className="w-7 h-7 text-accent-foreground" />
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-accent tracking-wider">
                  STEP {step.step}
                </span>
                <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
