import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import type { ReportStatus } from '@/store/useStore';

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'in-progress': return 'bg-blue-500';
    case 'resolved': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reports = useStore((state) => state.reports);
  const updateReportStatus = useStore((state) => state.updateReportStatus);
  const user = useStore((state) => state.user);

  const report = reports.find((r) => r.id === id);
  const [newStatus, setNewStatus] = useState<ReportStatus>(report?.status || 'pending');

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Report not found</p>
              <Button asChild>
                <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'}>
                  Go Back
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (newStatus !== report.status) {
      updateReportStatus(report.id, newStatus);
      toast.success('Report status updated successfully');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{report.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="capitalize">
                      {report.category}
                    </Badge>
                    <span className={`inline-block px-3 py-1 rounded-md text-white text-sm font-medium ${getStatusColor(report.status)}`}>
                      {report.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Report ID: <span className="font-mono">{report.id}</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Status Update - Admin Only */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ReportStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleStatusUpdate}
                    disabled={newStatus === report.status}
                  >
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{report.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Reported By</p>
                    <p className="text-sm text-muted-foreground">{report.citizenName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {report.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{report.location.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Coordinates: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          {report.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.photos.map((photo, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={photo}
                        alt={`Report photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="flex-1 w-px bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">Report Created</p>
                    <p className="text-sm text-muted-foreground">
                      {report.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-border" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {report.updatedAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportDetails;
