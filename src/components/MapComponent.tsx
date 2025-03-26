
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import { Property, properties as allProperties } from '@/data/properties';
import PropertyMarker from './PropertyMarker';
import { NearbyLocation, nearbyLocations as allNearbyLocations } from '@/data/nearbyLocations';
import AmenityMarker from './AmenityMarker';

interface MapComponentProps {
  onPropertySelect: (property: Property) => void;
  selectedProperty: Property | null;
  properties: Property[];
  amenities?: NearbyLocation[];
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  onPropertySelect, 
  selectedProperty, 
  properties = allProperties,
  amenities = []
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [selectedAmenity, setSelectedAmenity] = useState<NearbyLocation | null>(null);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  
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
      refreshMarkers();

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
      const property = allProperties.find(p => p.id === propertyId);
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

  // Effect to handle filtered properties and amenities
  useEffect(() => {
    if (!map.current) return;
    
    refreshMarkers();
    
    // Adjust map bounds to show all filtered properties
    if (properties.length > 0) {
      fitMapToMarkers(properties.map(p => p.coordinates));
    }
  }, [properties, amenities]);

  // Function to remove all markers and add new ones based on filtered data
  const refreshMarkers = () => {
    if (!map.current) return;
    
    // Remove all existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Add filtered property markers
    properties.forEach(property => {
      addPropertyMarker(property);
    });

    // Add filtered amenity markers or show all if no filter
    const amenitiesToShow = amenities.length > 0 ? amenities : allNearbyLocations;
    amenitiesToShow.forEach(location => {
      addAmenityMarker(location);
    });
  };

  // Function to fit map to show all markers
  const fitMapToMarkers = (coordinates: [number, number][]) => {
    if (!map.current || coordinates.length === 0) return;
    
    const bounds = new mapboxgl.LngLatBounds();
    
    coordinates.forEach(coord => {
      bounds.extend(coord);
    });
    
    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
      duration: 1000
    });
  };

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

  // Toggle legend collapse
  const toggleLegend = () => {
    setIsLegendCollapsed(!isLegendCollapsed);
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-white/0 dark:from-black/10 dark:to-black/0" />
      
      {/* Improved Legend - Collapsible */}
      <div className={`absolute bottom-4 left-4 z-10 transition-all duration-300 ${isLegendCollapsed ? 'w-10' : 'w-48'}`}>
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-border/30">
          {/* Legend header with toggle button */}
          <div 
            className="flex items-center justify-between p-2.5 bg-secondary/10 cursor-pointer"
            onClick={toggleLegend}
          >
            <span className={`text-xs font-medium transition-opacity ${isLegendCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Map Legend
            </span>
            <div className="flex items-center justify-center w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <svg 
                className={`w-3 h-3 text-gray-600 dark:text-gray-300 transition-transform ${isLegendCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isLegendCollapsed ? "M13 7l5 5m0 0l-5 5" : "M11 17l-5-5m0 0l5-5"} />
              </svg>
            </div>
          </div>
          
          {/* Legend content */}
          <div className={`transition-all duration-300 ease-in-out ${isLegendCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'} overflow-hidden`}>
            <div className="p-2.5 space-y-2">
              {/* Property types */}
              <div className="text-xs font-medium mb-1">Properties</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs">Warehouse</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs">Manufacturing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs">Distribution</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs">Flex</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-xs">Office</span>
                </div>
              </div>
              
              {/* Amenity types */}
              <div className="text-xs font-medium mb-1 mt-2 pt-1.5 border-t border-gray-200 dark:border-gray-700">Nearby Services</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 flex items-center justify-center bg-white rounded-full">
                    <div className="w-2 h-2" style={{ backgroundColor: '#7C2629' }} />
                  </div>
                  <span className="text-xs">UPS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 flex items-center justify-center bg-white rounded-full">
                    <div className="w-2 h-2" style={{ backgroundColor: '#4D148C' }} />
                  </div>
                  <span className="text-xs">FedEx</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 flex items-center justify-center bg-white rounded-full">
                    <div className="w-2 h-2" style={{ backgroundColor: '#066D38' }} />
                  </div>
                  <span className="text-xs">Starbucks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      {properties.length !== allProperties.length && (
        <div className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-lg z-10">
          <div className="text-xs font-medium">
            Showing {properties.length} of {allProperties.length} properties
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
