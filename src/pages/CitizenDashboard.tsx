import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore, ReportStatus } from "@/store/useStore";
import ReportCard from "@/components/ReportCard";
import DashboardHeader from "@/components/DashboardHeader";
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

const CitizenDashboard = () => {
  const user = useStore((state) => state.user);
  const reports = useStore((state) => state.reports);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");

  if (!user) {
    return null;
  }

  // Filter reports for current user
  const userReports = reports.filter((report) => report.citizenId === user.id);
  
  const filteredReports = filter === "all" 
    ? userReports 
    : userReports.filter((report) => report.status === filter);

  const pendingCount = userReports.filter((r) => r.status === "pending").length;
  const inProgressCount = userReports.filter((r) => r.status === "in-progress").length;
  const resolvedCount = userReports.filter((r) => r.status === "resolved").length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Track and manage your community reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userReports.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Report Button */}
        <div className="mb-6">
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link to="/submit-report">
              <Plus className="mr-2 h-5 w-5" />
              Submit New Report
            </Link>
          </Button>
        </div>

        {/* Reports List with Filters */}
        <Card>
          <CardHeader>
            <CardTitle>My Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as ReportStatus | "all")}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="space-y-4">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reports found</p>
                    {filter === "all" && (
                      <Button asChild className="mt-4">
                        <Link to="/submit-report">Submit Your First Report</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
