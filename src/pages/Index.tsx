
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MapComponent from '@/components/MapComponent';
import { Property } from '@/data/properties';

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };
  
  return (
    <Layout>
      <div className="w-full h-full">
        <MapComponent 
          onPropertySelect={handlePropertySelect}
          selectedProperty={selectedProperty}
        />
      </div>
    </Layout>
  );
};

export default Index;
