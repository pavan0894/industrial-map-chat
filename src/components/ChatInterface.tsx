import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Property } from '@/data/properties';
import { Send, MapPin, Building, Warehouse, Info } from 'lucide-react';
import { NearbyLocation, nearbyLocations } from '@/data/nearbyLocations';

interface ChatInterfaceProps {
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
  properties: Property[];
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  property?: Property;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedProperty, 
  onPropertySelect,
  properties 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi there! I'm your industrial property assistant. How can I help you find the perfect property in Dallas?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (!selectedProperty) return;
    
    const propertyExists = messages.some(m => 
      m.property?.id === selectedProperty.id && 
      m.text.includes(selectedProperty.name)
    );
    
    if (!propertyExists) {
      handlePropertySelection(selectedProperty);
    }
  }, [selectedProperty]);
  
  const handlePropertySelection = (property: Property) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Here's information about ${property.name}:`,
      sender: 'bot',
      timestamp: new Date(),
      property
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  const handleUserInput = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      processUserQuery(userMessage.text);
      setIsTyping(false);
    }, 1000);
  };
  
  const processUserQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('nearby') || lowerQuery.includes('close') || lowerQuery.includes('near')) {
      if (lowerQuery.includes('fedex') || lowerQuery.includes('shipping')) {
        findNearbyAmenities('fedex', selectedProperty);
        return;
      } else if (lowerQuery.includes('ups') || lowerQuery.includes('parcel')) {
        findNearbyAmenities('ups', selectedProperty);
        return;
      } else if (lowerQuery.includes('starbucks') || lowerQuery.includes('coffee')) {
        findNearbyAmenities('starbucks', selectedProperty);
        return;
      } else if (selectedProperty) {
        const response = `There are several amenities near ${selectedProperty.name}. Would you like to know about nearby FedEx, UPS, or Starbucks locations?`;
        addBotResponse(response);
        return;
      }
    }
    
    if ((lowerQuery.includes('fedex') || lowerQuery.includes('ups') || lowerQuery.includes('starbucks')) && 
        (lowerQuery.includes('which') || lowerQuery.includes('what') || lowerQuery.includes('where') || lowerQuery.includes('property'))) {
      let amenityType: 'fedex' | 'ups' | 'starbucks' | null = null;
      
      if (lowerQuery.includes('fedex')) amenityType = 'fedex';
      else if (lowerQuery.includes('ups')) amenityType = 'ups';
      else if (lowerQuery.includes('starbucks')) amenityType = 'starbucks';
      
      if (amenityType) {
        findPropertiesNearAmenities(amenityType);
        return;
      }
    }
    
    if (lowerQuery.includes('type') || lowerQuery.includes('types')) {
      const types = [...new Set(properties.map(p => p.type))];
      const response = `We have several types of industrial properties: ${types.join(', ')}.`;
      addBotResponse(response);
      return;
    }
    
    const propertyTypes = ['warehouse', 'manufacturing', 'distribution', 'flex', 'office'];
    for (const type of propertyTypes) {
      if (lowerQuery.includes(type)) {
        const filteredProperties = properties.filter(p => p.type === type);
        if (filteredProperties.length > 0) {
          const response = `I found ${filteredProperties.length} ${type} properties. Here's one example:`;
          addBotResponse(response);
          handlePropertySelection(filteredProperties[0]);
          return;
        }
      }
    }
    
    if (lowerQuery.includes('size') || lowerQuery.includes('square') || lowerQuery.includes('sq ft') || lowerQuery.includes('sqft')) {
      const sizesResponse = "Properties range from 65,000 to 327,000 square feet. What size range are you looking for?";
      addBotResponse(sizesResponse);
      return;
    }
    
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('rate') || lowerQuery.includes('rent')) {
      const pricesResponse = "Rental rates range from $4.65 to $9.50 per square foot. What's your budget range?";
      addBotResponse(pricesResponse);
      return;
    }
    
    const dallasAreas = ['north', 'south', 'east', 'west', 'downtown', 'central'];
    for (const area of dallasAreas) {
      if (lowerQuery.includes(area)) {
        const response = `Looking for properties in ${area} Dallas. Let me find some options for you.`;
        addBotResponse(response);
        const randomProperty = properties[Math.floor(Math.random() * properties.length)];
        handlePropertySelection(randomProperty);
        return;
      }
    }
    
    addBotResponse("I can help you find industrial properties in Dallas and information about nearby FedEx, UPS, and Starbucks locations. What specific information are you looking for?");
  };
  
  const findNearbyAmenities = (amenityType: 'fedex' | 'ups' | 'starbucks', property: Property | null) => {
    if (!property) {
      addBotResponse("Please select a property first so I can find nearby amenities.");
      return;
    }
    
    const amenities = nearbyLocations.filter(loc => loc.type === amenityType);
    if (!amenities.length) {
      addBotResponse(`I couldn't find any ${amenityType.toUpperCase()} locations in our database.`);
      return;
    }
    
    const nearbyAmenities = amenities.map(amenity => {
      const distance = calculateDistance(
        property.coordinates[1], property.coordinates[0],
        amenity.coordinates[1], amenity.coordinates[0]
      );
      return { ...amenity, distance };
    }).sort((a, b) => a.distance - b.distance).slice(0, 3);
    
    if (nearbyAmenities.length) {
      const amenityName = amenityType === 'fedex' ? 'FedEx' : 
                           amenityType === 'ups' ? 'UPS' : 'Starbucks';
      
      let response = `Here are the closest ${amenityName} locations to ${property.name}:\n`;
      nearbyAmenities.forEach((loc, index) => {
        response += `\n${index + 1}. ${loc.name} - ${(loc.distance * 0.621371).toFixed(2)} miles away at ${loc.address}`;
      });
      
      addBotResponse(response);
    } else {
      addBotResponse(`I couldn't find any ${amenityType.toUpperCase()} locations near ${property.name}.`);
    }
  };
  
  const findPropertiesNearAmenities = (amenityType: 'fedex' | 'ups' | 'starbucks') => {
    const amenities = nearbyLocations.filter(loc => loc.type === amenityType);
    if (!amenities.length) {
      addBotResponse(`I couldn't find any ${amenityType.toUpperCase()} locations in our database.`);
      return;
    }
    
    const propertiesWithDistance = properties.map(property => {
      let closestDistance = Number.MAX_VALUE;
      let closestAmenity: NearbyLocation | null = null;
      
      amenities.forEach(amenity => {
        const distance = calculateDistance(
          property.coordinates[1], property.coordinates[0],
          amenity.coordinates[1], amenity.coordinates[0]
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestAmenity = amenity;
        }
      });
      
      return {
        property,
        distance: closestDistance,
        amenity: closestAmenity
      };
    }).sort((a, b) => a.distance - b.distance).slice(0, 3);
    
    const amenityName = amenityType === 'fedex' ? 'FedEx' : 
                         amenityType === 'ups' ? 'UPS' : 'Starbucks';
                         
    if (propertiesWithDistance.length) {
      const response = `Here are ${propertiesWithDistance.length} properties closest to ${amenityName} locations:`;
      addBotResponse(response);
      
      handlePropertySelection(propertiesWithDistance[0].property);
      
      if (propertiesWithDistance[0].amenity) {
        const additionalInfo = `This property is approximately ${(propertiesWithDistance[0].distance * 0.621371).toFixed(2)} miles from ${propertiesWithDistance[0].amenity.name} at ${propertiesWithDistance[0].amenity.address}.`;
        addBotResponse(additionalInfo);
      }
    } else {
      addBotResponse(`I couldn't find properties near ${amenityName} locations.`);
    }
  };
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };
  
  const addBotResponse = (text: string) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
      <div className="px-4 py-3 border-b bg-white dark:bg-gray-900 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <Building size={18} />
          </div>
          <div>
            <h3 className="font-medium text-sm">Property Assistant</h3>
            <p className="text-xs text-muted-foreground">Dallas Industrial Properties</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] rounded-xl px-4 py-2
                  ${message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-12' 
                    : 'bg-muted dark:bg-gray-800 mr-12'}
                  animate-slide-in
                `}
              >
                <div className="text-sm">{message.text}</div>
                
                {message.property && (
                  <div 
                    className="mt-2 p-2 bg-background dark:bg-gray-900 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => onPropertySelect(message.property!)}
                  >
                    <div className="flex space-x-2">
                      <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={message.property.image} 
                          alt={message.property.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs text-foreground truncate">{message.property.name}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <MapPin size={10} className="mr-1" />
                          <span className="truncate">{message.property.city}, {message.property.state}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <Warehouse size={10} className="mr-1" />
                          <span>{message.property.squareFeet.toLocaleString()} SF</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <Info size={10} className="mr-1" />
                          <span className="capitalize">{message.property.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted dark:bg-gray-800 rounded-xl px-4 py-2 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleUserInput} className="p-4 border-t bg-background dark:bg-gray-900">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about industrial properties..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
