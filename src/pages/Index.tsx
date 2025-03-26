
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MapComponent from '@/components/MapComponent';
import ChatInterface from '@/components/ChatInterface';
import { Property, properties } from '@/data/properties';

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };
  
  return (
    <Layout>
      <div className="flex w-full h-full gap-4">
        <div className="w-1/3 h-full">
          <ChatInterface 
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            properties={properties}
          />
        </div>
        <div className="w-2/3 h-full">
          <MapComponent 
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
