import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Clock } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const reports = useStore((state) => state.reports);

  const stats = useMemo(() => {
    const categoryData = [
      { name: 'Infrastructure', value: reports.filter(r => r.category === 'infrastructure').length },
      { name: 'Environment', value: reports.filter(r => r.category === 'environment').length },
      { name: 'Safety', value: reports.filter(r => r.category === 'safety').length },
      { name: 'Other', value: reports.filter(r => r.category === 'other').length },
    ];

    const statusData = [
      { name: 'Pending', count: reports.filter(r => r.status === 'pending').length },
      { name: 'In Progress', count: reports.filter(r => r.status === 'in-progress').length },
      { name: 'Resolved', count: reports.filter(r => r.status === 'resolved').length },
    ];

    const resolvedReports = reports.filter(r => r.status === 'resolved');
    const avgResolutionTime = resolvedReports.length > 0
      ? resolvedReports.reduce((acc, r) => {
          const time = (r.updatedAt.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return acc + time;
        }, 0) / resolvedReports.length
      : 0;

    return {
      categoryData,
      statusData,
      avgResolutionTime: avgResolutionTime.toFixed(1),
      resolutionRate: ((resolvedReports.length / reports.length) * 100).toFixed(1),
    };
  }, [reports]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Performance metrics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.resolutionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                of all reports resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgResolutionTime}</div>
              <p className="text-xs text-muted-foreground mt-1">
                days to resolve
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                reports submitted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Reports by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Reports by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
