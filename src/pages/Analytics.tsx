import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Clock } from 'lucide-react';

// Define the new color palettes as requested
// Pie Chart: Pink, Brown, Purple, Orange
const PIE_COLORS = ['#ec4899', '#78350f', '#a855f7', '#f97316'];

// Bar Chart: Red (Pending), Yellow (In Progress), Green (Resolved)
const STATUS_COLORS = ['#ef4444', '#f59e0b', '#10b981'];

const Analytics = () => {
  const reports = useStore((state) => state.reports);

  const stats = useMemo(() => {
    const categoryData = [
        { name: 'Accident Issue', value: reports.filter(r => String(r.category) === 'Accident Issue').length },
        { name: 'Water Supply Issue', value: reports.filter(r => String(r.category) === 'Water Supply Issue').length },
        { name: 'Drainage Problem', value: reports.filter(r => String(r.category) === 'Drainage Problem').length },
        { name: 'Street Light Problem', value: reports.filter(r => String(r.category) === 'Street Light Problem').length },
        { name: 'Garbage Issue', value: reports.filter(r => String(r.category) === 'Garbage Issue').length },
        { name: 'Road Damage', value: reports.filter(r => String(r.category) === 'Road Damage').length },
        { name: 'Other Issue', value: reports.filter(r => String(r.category) === 'Other Issue').length },
    ].filter(item => item.value > 0);

    // Data is already in the order: Pending, In Progress, Resolved
    const statusData = [
      { name: 'Pending', count: reports.filter(r => r.status === 'pending').length },
      { name: 'In Progress', count: reports.filter(r => r.status === 'in-progress').length },
      { name: 'Resolved', count: reports.filter(r => r.status === 'resolved').length },
    ];

    const resolvedReports = reports.filter(r => r.status === 'resolved');
    const avgResolutionTime = resolvedReports.length > 0
      ? resolvedReports.reduce((acc, r) => {
          // Ensure createdAt and updatedAt are Date objects
          const created = new Date(r.createdAt);
          const updated = new Date(r.updatedAt);
          const time = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // time in days
          return acc + time;
        }, 0) / resolvedReports.length
      : 0;

    const totalReports = reports.length;
    const resolutionRate = totalReports > 0 ? (resolvedReports.length / totalReports) * 100 : 0;

    return {
      categoryData,
      statusData,
      avgResolutionTime: avgResolutionTime.toFixed(1),
      resolutionRate: resolutionRate.toFixed(1),
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
                  <Bar dataKey="count">
                    {/* Map over data to apply specific colors */}
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Bar>
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
                      // Use the new PIE_COLORS array
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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