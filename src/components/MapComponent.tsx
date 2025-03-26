
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import { Property, properties } from '@/data/properties';
import PropertyMarker from './PropertyMarker';
import { NearbyLocation, nearbyLocations } from '@/data/nearbyLocations';
import AmenityMarker from './AmenityMarker';

interface MapComponentProps {
  onPropertySelect: (property: Property) => void;
  selectedProperty: Property | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ onPropertySelect, selectedProperty }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [selectedAmenity, setSelectedAmenity] = useState<NearbyLocation | null>(null);
  
  // Your Mapbox access token
  const MAPBOX_TOKEN = 'pk.eyJ1IjoicGF2YW4wODk0IiwiYSI6ImNtOG96eTFocTA1dXoyanBzcXhuYmY3b2kifQ.hxIlEcLal8KBl_1005RHeA';

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-96.8, 32.78], // Dallas area
      zoom: 10,
      attributionControl: false,
      pitchWithRotate: false,
    });

    map.current = mapInstance;

    // Add navigation controls with a clean design
    mapInstance.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: false,
      }),
      'bottom-right'
    );

    // Add attributions in a custom container
    mapInstance.addControl(new mapboxgl.AttributionControl({
      compact: true,
    }));

    // Setup map load event
    mapInstance.on('load', () => {
      // Add properties markers
      properties.forEach(property => {
        addPropertyMarker(property);
      });

      // Add nearby locations markers
      nearbyLocations.forEach(location => {
        addAmenityMarker(location);
      });

      // Fly to selected property if available
      if (selectedProperty) {
        flyToProperty(selectedProperty);
      }
    });

    // Cleanup on unmount
    return () => {
      // Clean up markers
      Object.values(markersRef.current).forEach(marker => marker.remove());
      
      // Clean up map
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // Only run once on component mount

  // Effect to handle selected property changes
  useEffect(() => {
    if (!map.current || !selectedProperty) return;
    
    // Fly to the selected property
    flyToProperty(selectedProperty);
    
    // Update marker appearances
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      // Skip if not a property marker (amenity markers have different prefix)
      if (!id.startsWith('property-')) return;
      
      // Get the marker element and update its appearance based on selection
      const markerElement = marker.getElement();
      const propertyId = id.replace('property-', '');
      const isSelected = propertyId === selectedProperty.id;
      
      // Create a temporary div to render the updated marker
      const div = document.createElement('div');
      const root = createRoot(div);
      
      // Find the property data from our markers
      const property = properties.find(p => p.id === propertyId);
      if (!property) return;
      
      // Render the updated marker
      root.render(
        <PropertyMarker 
          property={property} 
          selected={isSelected}
          onClick={() => onPropertySelect(property)}
        />
      );
      
      // Replace the marker element's content
      markerElement.innerHTML = '';
      markerElement.appendChild(div);
    });
  }, [selectedProperty, onPropertySelect]);

  // Function to show amenity popup
  const handleAmenityClick = (location: NearbyLocation) => {
    setSelectedAmenity(location);
    
    if (!map.current) return;
    
    // Create popup
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: '300px',
      className: 'amenity-popup'
    })
      .setLngLat(location.coordinates)
      .setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${location.name}</h3>
          <p class="text-xs text-gray-600">${location.address}</p>
        </div>
      `)
      .addTo(map.current);
    
    // Close popup when closed
    popup.on('close', () => {
      setSelectedAmenity(null);
    });
    
    // Fly to the amenity
    map.current.flyTo({
      center: location.coordinates,
      zoom: 14,
      duration: 1500,
      essential: true,
    });
  };

  // Function to add a marker for a property
  const addPropertyMarker = (property: Property) => {
    if (!map.current) return;
    
    // Create a div element for the marker
    const markerElement = document.createElement('div');
    const root = createRoot(markerElement);
    
    // Render our custom PropertyMarker component into the div
    root.render(
      <PropertyMarker 
        property={property} 
        selected={selectedProperty?.id === property.id}
        onClick={() => onPropertySelect(property)}
      />
    );
    
    // Create a Mapbox marker with the custom element
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat(property.coordinates)
      .addTo(map.current);
    
    // Store the marker reference
    markersRef.current[`property-${property.id}`] = marker;
  };

  // Function to add a marker for a nearby amenity
  const addAmenityMarker = (location: NearbyLocation) => {
    if (!map.current) return;
    
    // Create a div element for the marker
    const markerElement = document.createElement('div');
    const root = createRoot(markerElement);
    
    // Render our custom AmenityMarker component into the div
    root.render(
      <AmenityMarker 
        location={location}
        onClick={() => handleAmenityClick(location)}
      />
    );
    
    // Create a Mapbox marker with the custom element
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat(location.coordinates)
      .addTo(map.current);
    
    // Store the marker reference
    markersRef.current[`amenity-${location.id}`] = marker;
  };

  // Function to fly to a property
  const flyToProperty = (property: Property) => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: property.coordinates,
      zoom: 15,
      duration: 1500,
      essential: true,
    });
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-white/0 dark:from-black/10 dark:to-black/0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-lg z-10">
        <div className="text-xs font-medium mb-2">Map Legend</div>
        <div className="space-y-1.5">
          {/* Property types */}
          <div className="text-xs font-medium mb-1 mt-2">Properties</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs">Warehouse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs">Manufacturing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Distribution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-xs">Flex</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
            <span className="text-xs">Office</span>
          </div>
          
          {/* Amenity types */}
          <div className="text-xs font-medium mb-1 mt-2">Nearby Services</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 flex items-center justify-center bg-white rounded-full">
              <div className="w-2 h-2" style={{ backgroundColor: '#7C2629' }} />
            </div>
            <span className="text-xs">UPS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 flex items-center justify-center bg-white rounded-full">
              <div className="w-2 h-2" style={{ backgroundColor: '#4D148C' }} />
            </div>
            <span className="text-xs">FedEx</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 flex items-center justify-center bg-white rounded-full">
              <div className="w-2 h-2" style={{ backgroundColor: '#066D38' }} />
            </div>
            <span className="text-xs">Starbucks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
