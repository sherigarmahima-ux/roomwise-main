import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, Users, CheckCircle2, AlertTriangle, Search, 
  LogOut, LayoutDashboard, UserCog, DoorOpen, Filter,
  ChevronRight, TrendingUp, Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type HostelType = Database["public"]["Enums"]["hostel_type"];

interface StudentData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  hostel: HostelType | null;
  year: string | null;
  completed: boolean;
  scores: {
    sleep: number;
    study: number;
    cleanliness: number;
    social: number;
    lifestyle: number;
    conflict: number;
    overall: number;
  } | null;
  risk_flags: string[];
}

const hostelLabels: Record<HostelType, string> = {
  "hostel-a": "Hostel A - Boys",
  "hostel-b": "Hostel B - Boys",
  "hostel-c": "Hostel C - Girls",
  "hostel-d": "Hostel D - Girls",
  "pg-block": "PG Block",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, role } = useAuth();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hostelFilter, setHostelFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "allocation">("overview");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
      return;
    }

    if (!loading && user && role !== "warden" && role !== "admin") {
      navigate("/");
      return;
    }

    if (user && (role === "warden" || role === "admin")) {
      loadStudents();
    }
  }, [user, loading, role, navigate]);

  const loadStudents = async () => {
    setDataLoading(true);

    // Get all profiles with student role
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");

    if (profilesError) {
      console.error("Error loading profiles:", profilesError);
      setDataLoading(false);
      return;
    }

    // Get questionnaire responses
    const { data: responses } = await supabase
      .from("questionnaire_responses")
      .select("user_id, completed");

    // Get compatibility scores
    const { data: scores } = await supabase
      .from("compatibility_scores")
      .select("*");

    // Get user roles to filter students
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "student");

    const studentUserIds = new Set(roles?.map(r => r.user_id) || []);

    // Combine data
    const studentData: StudentData[] = profiles
      .filter(p => studentUserIds.has(p.user_id))
      .map(profile => {
        const response = responses?.find(r => r.user_id === profile.user_id);
        const score = scores?.find(s => s.user_id === profile.user_id);

        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name,
          email: profile.full_name, // We don't have email in profiles, using name
          phone: profile.phone,
          hostel: profile.hostel,
          year: profile.year,
          completed: response?.completed || false,
          scores: score ? {
            sleep: score.sleep_score,
            study: score.study_score,
            cleanliness: score.cleanliness_score,
            social: score.social_score,
            lifestyle: score.lifestyle_score,
            conflict: score.conflict_score,
            overall: score.overall_score,
          } : null,
          risk_flags: score?.risk_flags || [],
        };
      });

    setStudents(studentData);
    setDataLoading(false);
  };

  const completedStudents = students.filter(s => s.completed);
  const pendingStudents = students.filter(s => !s.completed);
  const highRiskStudents = students.filter(s => s.risk_flags.length > 0);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHostel = hostelFilter === "all" || student.hostel === hostelFilter;
    return matchesSearch && matchesHostel;
  });

  const getScoreBadge = (score: number | undefined) => {
    if (score === undefined) return <Badge variant="secondary">Pending</Badge>;
    if (score >= 80) return <Badge className="bg-success/10 text-success border-success/20">High ({score})</Badge>;
    if (score >= 60) return <Badge className="bg-warning/10 text-warning border-warning/20">Medium ({score})</Badge>;
    return <Badge className="bg-danger/10 text-danger border-danger/20">Low ({score})</Badge>;
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-sidebar-primary" />
            <span className="text-xl font-display font-bold text-sidebar-foreground">
              RoomMatch
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "students"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <UserCog className="w-5 h-5" />
              Students
            </button>
            <button
              onClick={() => setActiveTab("allocation")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "allocation"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <DoorOpen className="w-5 h-5" />
              Room Allocation
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "students" && "Student Management"}
                {activeTab === "allocation" && "Room Allocation"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {activeTab === "overview" && "Monitor questionnaire completion and compatibility insights"}
                {activeTab === "students" && "View and manage student profiles and scores"}
                {activeTab === "allocation" && "Assign rooms based on compatibility scores"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Logged in as</div>
              <div className="font-medium capitalize">{role}</div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Students</p>
                        <p className="text-3xl font-bold text-foreground">{students.length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-3xl font-bold text-foreground">{completedStudents.length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-success font-medium">
                        {students.length > 0 ? Math.round((completedStudents.length / students.length) * 100) : 0}%
                      </span>
                      <span className="text-muted-foreground">completion rate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-3xl font-bold text-foreground">{pendingStudents.length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-warning" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">High Risk</p>
                        <p className="text-3xl font-bold text-foreground">{highRiskStudents.length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-danger" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Alerts */}
              {highRiskStudents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-danger">
                      <AlertTriangle className="w-5 h-5" />
                      Conflict Risk Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {highRiskStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-4 bg-danger/5 rounded-lg border border-danger/10">
                          <div>
                            <div className="font-medium text-foreground">{student.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.hostel ? hostelLabels[student.hostel] : "No hostel"} • Year {student.year || "N/A"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {student.risk_flags.map((flag, i) => (
                              <Badge key={i} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-elevated transition-shadow" onClick={() => setActiveTab("students")}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <UserCog className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">View All Students</h3>
                        <p className="text-sm text-muted-foreground">Browse student profiles and scores</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-elevated transition-shadow" onClick={() => setActiveTab("allocation")}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <DoorOpen className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Start Room Allocation</h3>
                        <p className="text-sm text-muted-foreground">Match students to rooms</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={hostelFilter} onValueChange={setHostelFilter}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by hostel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Hostels</SelectItem>
                        <SelectItem value="hostel-a">Hostel A - Boys</SelectItem>
                        <SelectItem value="hostel-b">Hostel B - Boys</SelectItem>
                        <SelectItem value="hostel-c">Hostel C - Girls</SelectItem>
                        <SelectItem value="hostel-d">Hostel D - Girls</SelectItem>
                        <SelectItem value="pg-block">PG Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Students Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Hostel</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Sleep</TableHead>
                        <TableHead>Study</TableHead>
                        <TableHead>Cleanliness</TableHead>
                        <TableHead>Social</TableHead>
                        <TableHead>Overall</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No students found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map(student => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{student.full_name}</div>
                                <div className="text-xs text-muted-foreground">{student.phone || "No phone"}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {student.hostel ? hostelLabels[student.hostel] : "Not set"}
                            </TableCell>
                            <TableCell className="text-sm">Year {student.year || "N/A"}</TableCell>
                            <TableCell>{student.scores ? student.scores.sleep : "-"}</TableCell>
                            <TableCell>{student.scores ? student.scores.study : "-"}</TableCell>
                            <TableCell>{student.scores ? student.scores.cleanliness : "-"}</TableCell>
                            <TableCell>{student.scores ? student.scores.social : "-"}</TableCell>
                            <TableCell>{getScoreBadge(student.scores?.overall)}</TableCell>
                            <TableCell>
                              {student.completed ? (
                                <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "allocation" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Allocation Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue placeholder="Room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2-Sharing</SelectItem>
                        <SelectItem value="3">3-Sharing</SelectItem>
                        <SelectItem value="4">4-Sharing</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Hostel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Hostels</SelectItem>
                        <SelectItem value="hostel-a">Hostel A - Boys</SelectItem>
                        <SelectItem value="hostel-b">Hostel B - Boys</SelectItem>
                        <SelectItem value="hostel-c">Hostel C - Girls</SelectItem>
                        <SelectItem value="hostel-d">Hostel D - Girls</SelectItem>
                        <SelectItem value="pg-block">PG Block</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full">
                      Generate Suggestions
                    </Button>
                  </div>

                  {completedStudents.length < 2 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Not enough students</p>
                      <p className="text-sm">At least 2 students need to complete the questionnaire to generate room allocations.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Available Students for Allocation</h4>
                      <div className="grid gap-3">
                        {completedStudents.map(student => (
                          <div key={student.id} className="p-4 border border-border bg-card rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{student.full_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {student.hostel ? hostelLabels[student.hostel] : "No hostel"} • Year {student.year || "N/A"} • Score: {student.scores?.overall || 0}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {student.risk_flags.map((flag, i) => (
                                  <Badge key={i} variant="destructive" className="text-xs">
                                    {flag}
                                  </Badge>
                                ))}
                                {getScoreBadge(student.scores?.overall)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
