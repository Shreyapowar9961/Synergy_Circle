import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Report } from "@/store/useStore";
import { MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

const ReportCard = ({ report, onClick }: ReportCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-destructive text-destructive-foreground";
      case "in-progress":
        return "bg-secondary text-secondary-foreground";
      case "resolved":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
          </div>
          {report.photos.length > 0 && (
            <div className="ml-4 flex-shrink-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                <img 
                  src={report.photos[0]} 
                  alt="Report" 
                  className="w-full h-full object-cover"
                />
                {report.photos.length > 1 && (
                  <div className="absolute bottom-0 right-0 bg-background/80 px-1 text-xs">
                    +{report.photos.length - 1}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getStatusColor(report.status)}>
            {report.status.replace("-", " ")}
          </Badge>
          <Badge variant="outline">
            {getCategoryLabel(report.category)}
          </Badge>
        </div>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{report.location.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Submitted {format(report.createdAt, "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
