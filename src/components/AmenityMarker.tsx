
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
  // SVG logos for each location type
  const getLogo = () => {
    switch (location.type) {
      case 'fedex':
        return (
          <svg viewBox="0 0 512 113" className="w-full h-full">
            <path fill="#4D148C" d="M480.08 5.44h31.2V50.8h-31.2V5.44zm-245.41 67.1l19.13-20.67c3.04-3.22 4.93-5.1 7.77-8.52 8.88-10.77 3.64-24.08-9.87-24.08h-31.85v78.44h14.98V49.18l24.08 48.53h18.53l-27.92-54.06c-1.95-4.15-7.96-7.95-14.85-6.05zM117.44 19.28H88.08v78.44h29.36c27.33 0 44.46-14.21 44.46-39.22 0-25.02-17.13-39.22-44.46-39.22zm-.59 64.89h-13.85V32.82h13.85c18.04 0 29.98 8.5 29.98 25.68-.01 17.17-11.95 25.67-29.98 25.67zm87.92-35.37v-15.2h-44.76v63.99h44.76V82.38h-29.77V66.9h26.13V51.6h-26.13V48.8h29.77zM34.13 19.28H0v78.44h14.99V71.29h19.14c15.24 0 23.52-8.3 23.52-25.9 0-16.9-7.75-26.11-23.52-26.11zm-3.82 38.47H14.99V32.82h15.34c8.57 0 12.32 4.24 12.32 12.36-.02 9.08-4.29 12.57-12.34 12.57zm214.14-23.36c-8.78-23.54-42.95-7.5-42.95 14.37v48.97h14.17V48.76c0-.71.06-1.41.2-2.08.72-3.48 3.5-7.07 9.5-7.07 5.99 0 9.76 3.96 9.76 9.15v49.95h14.18V48.76c0-1.91-.27-3.78-.83-5.54-.58-1.82-1.51-3.49-2.78-4.84-.53-.57-1.1-1.07-1.71-1.5.17.19.32.35.46.51zM325.4 19.28h-14.17v78.44H325.4V19.28z"/>
          </svg>
        );
      case 'starbucks':
        return (
          <svg viewBox="0 0 512 512" className="w-full h-full">
            <path fill="#066D38" d="M256 32c-31.71 0-61.09 5.36-85.31 14.37a219.33 219.33 0 0 0-68.32 42.75c-4.44 4.21-8.64 8.54-12.51 13-18.1 18-32.11 38.21-40.42 59.67C43.44 174.25 40 185.82 40 197.33s3.44 23.08 9.44 35.58c5.53 11.54 13.65 22.81 24.09 33 32 39.94 32 39.94 0 79.89-10.44 10.19-18.56 21.46-24.09 33C43.44 390.25 40 401.82 40 413.33s3.44 23.08 9.44 35.58c8.31 21.46 22.32 41.67 40.42 59.68 3.87 4.46 8.07 8.79 12.51 13a219.33 219.33 0 0 0 68.32 42.75C194.91 473.36 224.29 480 256 480s61.09-5.36 85.31-14.37a219.33 219.33 0 0 0 68.32-42.75c4.44-4.21 8.64-8.54 12.51-13 18.1-18 32.11-38.21 40.42-59.68C468.56 339.75 472 328.18 472 316.67s-3.44-23.08-9.44-35.58c-5.53-11.54-13.65-22.81-24.09-33-32-39.94-32-39.94 0-79.89 10.44-10.19 18.56-21.46 24.09-33C468.56 123.75 472 112.18 472 100.67s-3.44-23.08-9.44-35.58c-8.31-21.46-22.32-41.67-40.42-59.67-3.87-4.46-8.07-8.79-12.51-13a219.33 219.33 0 0 0-68.32-42.75C317.09 40 287.71 32 256 32zm0 56.81a46.16 46.16 0 0 1 40.93 24.09c6.8 11.26 7.34 25.53 7.34 34.94 0 32.73-44.36 11.47-48.27 55.59-3.37 27.56 14.84 54.52 52.46 56.47 20.5 1.16 29.11-5.93 29.11-5.93-9.13 48.27-59.22 46.59-65.61 46.59a64 64 0 0 1-64-64v-83.66c0-35.35 21.06-64.09 48.04-64.09zM412.9 96c4.09 0 7.1 4 7.1 9.24v55.52c0 5.24-3 9.24-7.1 9.24s-7.1-4-7.1-9.24v-55.52c0-5.24 3.01-9.24 7.1-9.24zM99.1 96c4.09 0 7.1 4 7.1 9.24v55.52c0 5.24-3 9.24-7.1 9.24s-7.1-4-7.1-9.24v-55.52c0-5.24 3.01-9.24 7.1-9.24zM412.9 342c4.09 0 7.1 4 7.1 9.24v55.52c0 5.24-3 9.24-7.1 9.24s-7.1-4-7.1-9.24v-55.52c0-5.24 3.01-9.24 7.1-9.24zM99.1 342c4.09 0 7.1 4 7.1 9.24v55.52c0 5.24-3 9.24-7.1 9.24s-7.1-4-7.1-9.24v-55.52c0-5.24 3.01-9.24 7.1-9.24z"/>
          </svg>
        );
      case 'ups':
        return (
          <svg viewBox="0 0 512 376" className="w-full h-full">
            <path fill="#7C2629" d="M512 83.17v209.66c0 45.844-37.156 83-83 83H83c-45.844 0-83-37.156-83-83V83.17C0 37.326 37.156.17 83 .17h346c45.844 0 83 37.156 83 83zM221.797 272.245V180.12c0-19.156 28.813-19.156 28.813 0v92.125c0 19.156-28.813 19.156-28.813 0zm-85.172-92.125c-2.906-27.266-43.218-22.344-43.218 4.422v87.703c0 18.906 28.813 18.906 28.813 0v-29.938h14.406v29.938c0 19.156 28.813 19.156 28.813 0v-87.703c0-26.766-39-31.688-41.906-4.422h13.093zm160.438 56.344h14.406c-1.93 16.734-19.653 37.266-44.453 37.266-25.047 0-44.703-18.172-44.703-48.36 0-31.687 17.313-51.59 44.703-51.593 25.047 0 42.609 18.172 44.453 37.281h-14.406c-3.281-10.312-14.656-18.656-30.047-18.906-16.86 0-30.094 13.234-30.094 33.218 0 17.391 13.25 31.14 30.094 29.938 15.391-.266 27.016-7.16 30.047-18.844zM140.11 196.01h-14.484v-15.89h-15.173v15.89H95.97v11.86h14.484v39.515c0 11.375 8.23 21.61 21.218 21.61 2.657 0 5.32-.516 7.953-1.562v-13.063c-2.64.532-4.64.813-6.328.813-6.578 0-7.672-6.578-7.672-10.735v-36.579h14.485V196.01zm245.844-15.891h14.156v87.969h-14.156v-87.969zm-48.797 87.969h14.156v-87.969h-14.156v57.38l-43.984-57.38h-14.156v87.968h14.156v-57.38l43.984 57.38zM395.75 196.01h-17.078v-15.89h-14.156v15.89h-14.484v13.969h14.484v41.313c0 14.781 8.23 16.906 21.22 16.906h10.015v-13.969h-10.015c-3.876 0-7.063-2.64-7.063-6.579v-37.671h17.078V196.01z"/>
          </svg>
        );
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
                <div className="w-7 h-7 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                  {getLogo()}
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
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: amenityInfo.color }}>
              <div className="w-3 h-3 text-white">
                <MapPin className="w-full h-full" />
              </div>
            </div>
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
