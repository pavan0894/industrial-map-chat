
import React from 'react';
import { NearbyLocation } from '@/data/nearbyLocations';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin } from 'lucide-react';

interface AmenityMarkerProps {
  location: NearbyLocation;
  onClick: () => void;
}

const AmenityMarker: React.FC<AmenityMarkerProps> = ({ location, onClick }) => {
  // Image paths for each location type
  const getLogo = () => {
    switch (location.type) {
      case 'fedex':
        return "/lovable-uploads/b7a35cb6-a1ea-4464-a860-57bc13e364fd.png";
      case 'starbucks':
        return "/lovable-uploads/d6ffb390-ac82-4031-ac45-3fecd3d7cf47.png";
      case 'ups':
        return "/lovable-uploads/5875062c-7a9e-4b53-8339-628c02b15898.png";
      default:
        return null;
    }
  };

  // Get the amenity type information
  const getAmenityInfo = () => {
    switch (location.type) {
      case 'fedex':
        return {
          title: 'FedEx Location',
          description: 'Ship, print, and access courier services',
          color: '#4D148C',
          hours: 'Mon-Fri: 8:00 AM - 7:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: Closed',
          services: ['Package Shipping', 'Printing Services', 'Document Services', 'Office Supplies']
        };
      case 'starbucks':
        return {
          title: 'Starbucks',
          description: 'Coffee, food and meeting space',
          color: '#066D38',
          hours: 'Mon-Fri: 5:30 AM - 8:00 PM, Sat-Sun: 6:00 AM - 8:00 PM',
          services: ['Coffee & Tea', 'Food Items', 'Free WiFi', 'Mobile Ordering']
        };
      case 'ups':
        return {
          title: 'UPS Location',
          description: 'Shipping, packaging and mailbox services',
          color: '#7C2629',
          hours: 'Mon-Fri: 8:00 AM - 7:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: Closed',
          services: ['Package Shipping', 'Mailbox Services', 'Packaging Supplies', 'Notary Services']
        };
      default:
        return {
          title: 'Location',
          description: 'Service location',
          color: '#64748b',
          hours: 'Call for hours',
          services: ['Various services available']
        };
    }
  };

  const amenityInfo = getAmenityInfo();
  const logoSrc = getLogo();

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <div 
                onClick={onClick}
                className="relative cursor-pointer transition-transform hover:scale-110"
              >
                <div className="w-7 h-7 bg-white rounded-full p-1 shadow-md flex items-center justify-center overflow-hidden">
                  {logoSrc ? (
                    <img 
                      src={logoSrc} 
                      alt={`${location.type} logo`} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs font-medium">{location.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {logoSrc ? (
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img 
                  src={logoSrc} 
                  alt={`${location.type} logo`} 
                  className="w-full h-full object-contain" 
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: amenityInfo.color }}>
                <div className="w-3 h-3 text-white">
                  <MapPin className="w-full h-full" />
                </div>
              </div>
            )}
            <span style={{ color: amenityInfo.color }}>{location.name}</span>
          </DialogTitle>
          <DialogDescription className="text-sm pt-2">
            {amenityInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-3 bg-muted/30">
            <p className="text-sm font-medium mb-1">Address</p>
            <p className="text-sm">{location.address}</p>
          </div>
          
          <div className="border rounded-lg p-3 bg-muted/30">
            <p className="text-sm font-medium mb-1">Hours of Operation</p>
            <p className="text-sm">{amenityInfo.hours}</p>
          </div>
          
          <div className="border rounded-lg p-3 bg-muted/30">
            <p className="text-sm font-medium mb-1">Services</p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              {amenityInfo.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <a 
              href={`https://maps.google.com/?q=${location.address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              Get Directions
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmenityMarker;
