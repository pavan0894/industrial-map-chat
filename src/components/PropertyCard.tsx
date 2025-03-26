
import React from 'react';
import { Property } from '@/data/properties';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  isSelected: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, isSelected }) => {
  // Get type specific color
  const getTypeColor = () => {
    switch (property.type) {
      case 'warehouse':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'manufacturing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'distribution':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'flex':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'office':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Format price to display with commas and $ sign
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Format square feet with commas
  const formatSqFt = (sqft: number) => {
    return sqft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Card 
      className={`property-card cursor-pointer overflow-hidden transition-all duration-300
        ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
      `}
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={property.available ? "default" : "destructive"} className="text-xs font-medium">
            {property.available ? 'Available' : 'Leased'}
          </Badge>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-black/0 h-1/2" />
        <div className="absolute bottom-2 left-3 text-white">
          <h3 className="font-medium text-sm truncate max-w-[90%]">{property.name}</h3>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className={`${getTypeColor()} text-xs capitalize`}>
              {property.type}
            </Badge>
            <span className="text-sm font-semibold">{formatPrice(property.pricePerSqFt)}/SF</span>
          </div>
          
          <div className="text-xs text-muted-foreground truncate">
            {property.address}, {property.city}, {property.state} {property.zip}
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span>{formatSqFt(property.squareFeet)} SF</span>
            <span>Built {property.yearBuilt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
