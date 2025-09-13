import { Card } from "./ui/Card";
import { MapPin } from "lucide-react";

const PropertyMap = ({ latitude, longitude, address, title }) => {
  // Mock map component - replace with actual map implementation (Google Maps, Mapbox, etc.)
  return (
    <Card className="rounded-[18px] p-6">
      <h3 className="text-xl font-semibold mb-4">Location</h3>
      
      {/* Mock map placeholder */}
      <div className="relative bg-gray-100 rounded-lg h-64 mb-4 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Map will be displayed here</p>
          <p className="text-xs text-muted-foreground mt-1">
            Coordinates: {latitude}, {longitude}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">{title}</h4>
        <p className="text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {address}
        </p>
        <p className="text-sm text-muted-foreground">
          The exact location will be provided after booking confirmation.
        </p>
      </div>
    </Card>
  );
};

export default PropertyMap;
