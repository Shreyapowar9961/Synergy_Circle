import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useStore } from '@/store/useStore';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { ReportStatus, ReportCategory } from '@/store/useStore';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'in-progress': return 'bg-blue-500';
    case 'resolved': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const MapView = () => {
  const reports = useStore((state) => state.reports);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (statusFilter !== 'all' && report.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && report.category !== categoryFilter) return false;
      return true;
    });
  }, [reports, statusFilter, categoryFilter]);

  const center: [number, number] = [40.7128, -74.0060];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Map View</h1>
          <p className="text-muted-foreground">Geographic visualization of all reports</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ReportCategory | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(statusFilter !== 'all' || categoryFilter !== 'all') && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter('all');
                      setCategoryFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardContent className="p-0">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={center}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {filteredReports.map((report) => (
                  <Marker
                    key={report.id}
                    position={[report.location.lat, report.location.lng]}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold mb-2">{report.title}</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <Badge variant="secondary" className="capitalize">
                              {report.category}
                            </Badge>
                          </div>
                          <div>
                            <span className={`inline-block px-2 py-1 rounded text-white text-xs ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </div>
                          <p className="text-gray-600 line-clamp-2">{report.description}</p>
                          <p className="text-gray-500 text-xs">{report.location.address}</p>
                          <Button asChild size="sm" className="w-full mt-2">
                            <Link to={`/admin/reports/${report.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MapView;
