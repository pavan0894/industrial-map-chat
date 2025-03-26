
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
  {
    id: 'fedex-5',
    name: 'FedEx Office Print & Ship Center',
    type: 'fedex',
    coordinates: [-96.7515, 32.8122],
    address: '5334 Ross Ave, Dallas, TX 75206'
  },
  {
    id: 'fedex-6',
    name: 'FedEx Office Print & Ship Center',
    type: 'fedex',
    coordinates: [-96.8361, 32.7393],
    address: '3917 Oak Lawn Ave, Dallas, TX 75219'
  },
  {
    id: 'fedex-7',
    name: 'FedEx Office Print & Ship Center',
    type: 'fedex',
    coordinates: [-96.7692, 32.8385],
    address: '8687 N Central Expy, Dallas, TX 75225'
  },
  {
    id: 'fedex-8',
    name: 'FedEx Office Print & Ship Center',
    type: 'fedex',
    coordinates: [-96.9153, 32.9112],
    address: '3737 Forest Ln, Dallas, TX 75244'
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
  {
    id: 'starbucks-5',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.7779, 32.7934],
    address: '2425 McKinney Ave, Dallas, TX 75201'
  },
  {
    id: 'starbucks-6',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.8252, 32.8438],
    address: '8021 Walnut Hill Ln, Dallas, TX 75231'
  },
  {
    id: 'starbucks-7',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.7732, 32.8121],
    address: '6333 E Mockingbird Ln, Dallas, TX 75214'
  },
  {
    id: 'starbucks-8',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.8083, 32.7344],
    address: '3878 Oak Lawn Ave, Dallas, TX 75219'
  },
  {
    id: 'starbucks-9',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.7925, 32.9012],
    address: '7700 N MacArthur Blvd, Irving, TX 75063'
  },
  {
    id: 'starbucks-10',
    name: 'Starbucks',
    type: 'starbucks',
    coordinates: [-96.8587, 32.8649],
    address: '11661 Preston Rd, Dallas, TX 75230'
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
  },
  {
    id: 'ups-5',
    name: 'The UPS Store',
    type: 'ups',
    coordinates: [-96.7852, 32.8355],
    address: '5959 Royal Ln #542, Dallas, TX 75230'
  },
  {
    id: 'ups-6',
    name: 'The UPS Store',
    type: 'ups',
    coordinates: [-96.8149, 32.8763],
    address: '11909 Preston Rd #1426, Dallas, TX 75230'
  },
  {
    id: 'ups-7',
    name: 'The UPS Store',
    type: 'ups',
    coordinates: [-96.7687, 32.8122],
    address: '6440 N Central Expy, Dallas, TX 75206'
  },
  {
    id: 'ups-8',
    name: 'The UPS Store',
    type: 'ups',
    coordinates: [-96.8359, 32.7391],
    address: '3838 Oak Lawn Ave #100, Dallas, TX 75219'
  },
  {
    id: 'ups-9',
    name: 'The UPS Store',
    type: 'ups',
    coordinates: [-96.8229, 32.9110],
    address: '14999 Preston Rd #400A, Dallas, TX 75254'
  }
];
