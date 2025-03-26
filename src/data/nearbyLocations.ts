
export type LocationType = 'fedex' | 'starbucks' | 'ups';

export interface NearbyLocation {
  id: string;
  name: string;
  type: LocationType;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
}

// Sample data for nearby amenities around Dallas area
export const nearbyLocations: NearbyLocation[] = [
  // FedEx locations
  {
    id: 'fedex-1',
    name: 'FedEx Office Print & Ship Center',
    type: 'fedex',
    coordinates: [-96.8078, 32.7825],
    address: '2710 N Stemmons Fwy, Dallas, TX 75207'
  },
  {
    id: 'fedex-2',
    name: 'FedEx Ship Center',
    type: 'fedex',
    coordinates: [-96.8724, 32.8354],
    address: '4050 W Northwest Hwy, Dallas, TX 75220'
  },
  {
    id: 'fedex-3',
    name: 'FedEx Office Print & Ship Center',
    type: 'fedex',
    coordinates: [-96.7876, 32.7808],
    address: '1400 Main St, Dallas, TX 75202'
  },
  {
    id: 'fedex-4',
    name: 'FedEx Ground',
    type: 'fedex',
    coordinates: [-96.9303, 32.8793],
    address: '1703 W Frankford Rd, Carrollton, TX 75007'
  },
  
  // Starbucks locations
  {
    id: 'starbucks-1',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.8009, 32.7815],
    address: '1700 Pacific Ave, Dallas, TX 75201'
  },
  {
    id: 'starbucks-2',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.8095, 32.7932],
    address: '2917 State St, Dallas, TX 75204'
  },
  {
    id: 'starbucks-3',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.7869, 32.7846],
    address: '1401 Elm St, Dallas, TX 75202'
  },
  {
    id: 'starbucks-4',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.8486, 32.8129],
    address: '5334 Ross Ave, Dallas, TX 75206'
  },
  
  // UPS locations
  {
    id: 'ups-1',
    name: 'The UPS Store',
    type: 'ups',
    coordinates: [-96.8033, 32.7789],
    address: '1700 Commerce St, Dallas, TX 75201'
  },
  {
    id: 'ups-2',
    name: 'UPS Customer Center',
    type: 'ups',
    coordinates: [-96.8897, 32.8315],
    address: '9525 Chancellor Row, Dallas, TX 75247'
  },
  {
    id: 'ups-3',
    name: 'The UPS Store',
    type: 'ups',
    coordinates: [-96.7801, 32.7865],
    address: '500 N Akard St, Dallas, TX 75201'
  },
  {
    id: 'ups-4',
    name: 'UPS Ground Hub',
    type: 'ups',
    coordinates: [-96.9189, 32.7756],
    address: '1450 Valwood Pkwy, Carrollton, TX 75006'
  }
];
