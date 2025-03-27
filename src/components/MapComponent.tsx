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
  
  const MAPBOX_TOKEN = 'pk.eyJ1IjoicGF2YW4wODk0IiwiYSI6ImNtOG96eTFocTA1dXoyanBzcXhuYmY3b2kifQ.hxIlEcLal8KBl_1005RHeA';

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-96.8, 32.78],
      zoom: 10,
      attributionControl: false,
      pitchWithRotate: false,
    });

    map.current = mapInstance;

    mapInstance.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: false,
      }),
      'bottom-right'
    );

    mapInstance.addControl(new mapboxgl.AttributionControl({
      compact: true,
    }));

    mapInstance.on('load', () => {
      refreshMarkers();

      if (selectedProperty) {
        flyToProperty(selectedProperty);
      }
    });

    return () => {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !selectedProperty) return;
    
    flyToProperty(selectedProperty);
    
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      if (!id.startsWith('property-')) return;
      
      const markerElement = marker.getElement();
      const propertyId = id.replace('property-', '');
      const isSelected = propertyId === selectedProperty.id;
      
      const div = document.createElement('div');
      const root = createRoot(div);
      
      const property = allProperties.find(p => p.id === propertyId);
      if (!property) return;
      
      root.render(
        <PropertyMarker 
          property={property} 
          selected={isSelected}
          onClick={() => onPropertySelect(property)}
        />
      );
      
      markerElement.innerHTML = '';
      markerElement.appendChild(div);
    });
  }, [selectedProperty, onPropertySelect]);

  useEffect(() => {
    if (!map.current) return;
    
    console.log("Refreshing markers with amenities:", amenities.map(a => a.type));
    refreshMarkers();
    
    if (properties.length > 0 || amenities.length > 0) {
      const coordinatesToFit = [
        ...properties.map(p => p.coordinates),
        ...amenities.map(a => a.coordinates)
      ];
      fitMapToMarkers(coordinatesToFit);
    }
  }, [properties, amenities]);

  const refreshMarkers = () => {
    if (!map.current) return;
    
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    properties.forEach(property => {
      addPropertyMarker(property);
    });

    if (amenities.length > 0) {
      console.log(`Adding ${amenities.length} filtered amenities to map`);
      amenities.forEach(location => {
        addAmenityMarker(location);
      });
    } else {
      allNearbyLocations.forEach(location => {
        addAmenityMarker(location);
      });
    }
  };

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

  const handleAmenityClick = (location: NearbyLocation) => {
    setSelectedAmenity(location);
    
    if (!map.current) return;
    
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
    
    popup.on('close', () => {
      setSelectedAmenity(null);
    });
    
    map.current.flyTo({
      center: location.coordinates,
      zoom: 14,
      duration: 1500,
      essential: true,
    });
  };

  const addPropertyMarker = (property: Property) => {
    if (!map.current) return;
    
    const markerElement = document.createElement('div');
    const root = createRoot(markerElement);
    
    root.render(
      <PropertyMarker 
        property={property} 
        selected={selectedProperty?.id === property.id}
        onClick={() => onPropertySelect(property)}
      />
    );
    
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat(property.coordinates)
      .addTo(map.current);
    
    markersRef.current[`property-${property.id}`] = marker;
  };

  const addAmenityMarker = (location: NearbyLocation) => {
    if (!map.current) return;
    
    const markerElement = document.createElement('div');
    const root = createRoot(markerElement);
    
    root.render(
      <AmenityMarker 
        location={location}
        onClick={() => handleAmenityClick(location)}
      />
    );
    
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat(location.coordinates)
      .addTo(map.current);
    
    markersRef.current[`amenity-${location.id}`] = marker;
  };

  const flyToProperty = (property: Property) => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: property.coordinates,
      zoom: 15,
      duration: 1500,
      essential: true,
    });
  };

  const toggleLegend = () => {
    setIsLegendCollapsed(!isLegendCollapsed);
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-white/0 dark:from-black/10 dark:to-black/0" />
      
      <div className={`absolute bottom-4 left-4 z-10 transition-all duration-300 ${isLegendCollapsed ? 'w-10' : 'w-48'}`}>
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-border/30">
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
          
          <div className={`transition-all duration-300 ease-in-out ${isLegendCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'} overflow-hidden`}>
            <div className="p-2.5 space-y-2">
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
              
              <div className="text-xs font-medium mb-1 mt-2 pt-1.5 border-t border-gray-200 dark:border-gray-700">Nearby Services</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center bg-white rounded-full overflow-hidden">
                    <img 
                      src="/lovable-uploads/5875062c-7a9e-4b53-8339-628c02b15898.png" 
                      alt="UPS Logo" 
                      className="w-3 h-3 object-contain"
                    />
                  </div>
                  <span className="text-xs">UPS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center bg-white rounded-full overflow-hidden">
                    <img 
                      src="/lovable-uploads/b7a35cb6-a1ea-4464-a860-57bc13e364fd.png" 
                      alt="FedEx Logo" 
                      className="w-3 h-3 object-contain"
                    />
                  </div>
                  <span className="text-xs">FedEx</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center bg-white rounded-full overflow-hidden">
                    <img 
                      src="/lovable-uploads/d6ffb390-ac82-4031-ac45-3fecd3d7cf47.png" 
                      alt="Starbucks Logo" 
                      className="w-3 h-3 object-contain"
                    />
                  </div>
                  <span className="text-xs">Starbucks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
