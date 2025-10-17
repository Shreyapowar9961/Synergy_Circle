import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, ReportCategory } from "@/store/useStore";
import DashboardHeader from "@/components/DashboardHeader";
import { MapPin, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SubmitReport = () => {
  const user = useStore((state) => state.user);
  const addReport = useStore((state) => state.addReport);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>("infrastructure");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This is the NEW code you should use
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);

    // 1. Get user's current coordinates
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // 2. Create a Google Maps URL with those coordinates
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        // 3. Open the URL in a new browser tab
        window.open(googleMapsUrl, "_blank");
        
        setIsLoadingLocation(false); // Hide the spinner
      },
      (error) => {
        // Handle errors
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("You denied permission to access your location.");
        } else {
          toast.error("Unable to get your location.");
        }
        setIsLoadingLocation(false); // Hide the spinner on error
      }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock photo upload - in real app would upload to storage
      const photoUrls = Array.from(files).map((file) => URL.createObjectURL(file));
      setPhotos([...photos, ...photoUrls]);
      toast.success(`${files.length} photo(s) added`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit a report");
      return;
    }

    if (!location && !address) {
      toast.error("Please provide a location or address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      addReport({
        title,
        description,
        category,
        status: "pending",
        citizenId: user.id,
        citizenName: user.name,
        location: location 
          ? { ...location, address } 
          : { lat: 40.7128, lng: -74.0060, address },
        photos
      });

      toast.success("Report submitted successfully!");
      navigate("/citizen/dashboard");
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Report</CardTitle>
            <CardDescription>
              Report a community issue and help make your neighborhood better
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category *</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as ReportCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Accident Issue">Accident Issue</SelectItem>
                    <SelectItem value="Water Supply Issue">Water Supply Issue</SelectItem>
                    <SelectItem value="Drainage Problem">Drainage Problem</SelectItem>
                    <SelectItem value="Street Light Problem">Street Light Problem</SelectItem>
                    <SelectItem value="Garbage Issue">Garbage Issue</SelectItem>
                    <SelectItem value="Road Damage">Road Damage</SelectItem>
                    <SelectItem value="Other Issue ">Other Issue (Please Specify)</SelectItem>
              
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetLocation}
                    disabled={isLoadingLocation}
                    className="flex-shrink-0"
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <MapPin className="h-4 w-4 mr-2" />
                    )}
                    Use My Location
                  </Button>
                  <Input
                    placeholder="Or enter address manually"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                {location && (
                  <p className="text-sm text-muted-foreground">
                    Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Photos (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                  </label>
                </div>
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/citizen/dashboard")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitReport;
