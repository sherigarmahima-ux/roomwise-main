import { AlertTriangle, RefreshCw, MessageSquareWarning, Users } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Random Allocation",
    description: "Students paired without considering compatibility leads to friction from day one.",
  },
  {
    icon: MessageSquareWarning,
    title: "Constant Complaints",
    description: "Wardens spend hours mediating disputes over sleep schedules, cleanliness, and noise.",
  },
  {
    icon: RefreshCw,
    title: "Frequent Room Changes",
    description: "Mismatched roommates request transfers, disrupting hostel operations repeatedly.",
  },
  {
    icon: Users,
    title: "No Objective Basis",
    description: "Without data, allocation decisions feel arbitrary and are hard to justify.",
  },
];

export const Problem = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-danger uppercase tracking-wide">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Random Allocation Creates Real Problems
          </h2>
          <p className="text-lg text-muted-foreground">
            Traditional room allocation ignores compatibility, creating conflicts that affect students' well-being and academic performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border group"
            >
              <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center mb-4 group-hover:bg-danger/20 transition-colors">
                <problem.icon className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
