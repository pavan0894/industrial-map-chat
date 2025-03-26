
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MapComponent from '@/components/MapComponent';
import ChatInterface from '@/components/ChatInterface';
import { Property, properties } from '@/data/properties';
import { NearbyLocation, nearbyLocations } from '@/data/nearbyLocations';

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [filteredAmenities, setFilteredAmenities] = useState<NearbyLocation[]>([]);
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };
  
  const handleFilterProperties = (properties: Property[], amenityType?: 'fedex' | 'ups' | 'starbucks') => {
    setFilteredProperties(properties);
    
    if (amenityType) {
      const relevantAmenities = nearbyLocations.filter(loc => loc.type === amenityType);
      setFilteredAmenities(relevantAmenities);
    } else {
      setFilteredAmenities([]);
    }
  };
  
  return (
    <Layout>
      <div className="flex w-full h-full gap-4">
        <div className="w-1/3 h-full">
          <ChatInterface 
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            properties={properties}
            onFilterProperties={handleFilterProperties}
          />
        </div>
        <div className="w-2/3 h-full">
          <MapComponent 
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty}
            properties={filteredProperties}
            amenities={filteredAmenities}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
