
import React, { useState } from 'react';
import { Property, properties } from '@/data/properties';
import MapComponent from './MapComponent';
import ChatInterface from './ChatInterface';
import PropertyCard from './PropertyCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Building, MapPin, X } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(true);
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    // On mobile, switch to map view when property is selected
    setShowMobileChat(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Industrial Map Chat</span>
          </div>
          
          {/* Mobile toggle buttons */}
          <div className="flex md:hidden">
            <Button 
              variant={showMobileChat ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowMobileChat(true)}
              className="mr-2"
            >
              Chat
            </Button>
            <Button 
              variant={!showMobileChat ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowMobileChat(false)}
            >
              Map
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Property list and chat (left side) */}
        <div 
          className={`
            flex flex-col w-full md:w-2/5 p-4
            ${showMobileChat ? 'flex' : 'hidden'} md:flex
          `}
        >
          <div className="flex-1 flex flex-col h-full space-y-4">
            <ChatInterface 
              selectedProperty={selectedProperty} 
              onPropertySelect={handlePropertySelect}
              properties={properties}
            />
            
            {/* Property list */}
            <div className="rounded-xl border overflow-hidden h-1/3 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
              <div className="p-3 border-b bg-white dark:bg-gray-900">
                <h2 className="font-medium text-sm">Featured Properties</h2>
              </div>
              <ScrollArea className="h-[calc(100%-40px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 p-3">
                  {properties.slice(0, 6).map(property => (
                    <PropertyCard 
                      key={property.id}
                      property={property}
                      onClick={() => handlePropertySelect(property)}
                      isSelected={selectedProperty?.id === property.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        
        {/* Map (right side) */}
        <div 
          className={`
            flex-1 p-4 relative
            ${!showMobileChat ? 'flex' : 'hidden'} md:flex
          `}
        >
          <MapComponent
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty}
          />
          
          {/* Selected property overlay */}
          {selectedProperty && (
            <div className="absolute top-8 left-8 right-8 glass-panel rounded-lg shadow-lg border p-4 z-10 max-w-md animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start space-x-2">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{selectedProperty.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setSelectedProperty(null)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="flex mb-4">
                <div className="w-1/3 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={selectedProperty.image} 
                    alt={selectedProperty.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Size:</span>
                      <span className="text-sm">{selectedProperty.squareFeet.toLocaleString()} SF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="text-sm">${selectedProperty.pricePerSqFt}/SF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="text-sm capitalize">{selectedProperty.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Year built:</span>
                      <span className="text-sm">{selectedProperty.yearBuilt}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm">{selectedProperty.description}</p>
              
              <div className="mt-4 flex justify-end">
                <Button size="sm" className="mr-2" variant="outline">Contact Agent</Button>
                <Button size="sm">Schedule Tour</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
