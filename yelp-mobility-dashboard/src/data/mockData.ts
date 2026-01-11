import { User, MobilityData, Recommendation, VisitedRestaurant } from '@/types';

// Philadelphia area mock data
export const mockUsers: User[] = [
  {
    id: 'user_001',
    name: 'Alex Chen',
    reviewCount: 156,
    mobilityClass: 'Local Expert',
    areaRatio: 0.23,
    centroid: [-75.1652, 39.9526],
  },
  {
    id: 'user_002',
    name: 'Jordan Smith',
    reviewCount: 89,
    mobilityClass: 'Explorer',
    areaRatio: 0.78,
    centroid: [-75.1452, 39.9426],
  },
  {
    id: 'user_003',
    name: 'Sam Williams',
    reviewCount: 234,
    mobilityClass: 'Local Expert',
    areaRatio: 0.15,
    centroid: [-75.1752, 39.9626],
  },
  {
    id: 'user_004',
    name: 'Taylor Brown',
    reviewCount: 67,
    mobilityClass: 'Explorer',
    areaRatio: 0.85,
    centroid: [-75.1552, 39.9326],
  },
];

export const mockMobilityData: Record<string, MobilityData> = {
  user_001: {
    visitedRestaurants: [
      { id: 'r1', name: 'Center City Bistro', category: 'American', location: [-75.1652, 39.9526], distanceFromCentroid: 0.1, rating: 4.2, reviewDate: '2024-03-15' },
      { id: 'r2', name: 'Rittenhouse Cafe', category: 'Cafe', location: [-75.1712, 39.9496], distanceFromCentroid: 0.5, rating: 4.5, reviewDate: '2024-02-28' },
      { id: 'r3', name: "Tony's Pizzeria", category: 'Italian', location: [-75.1622, 39.9556], distanceFromCentroid: 0.4, rating: 4.0, reviewDate: '2024-01-10' },
      { id: 'r4', name: 'Sushi Palace', category: 'Japanese', location: [-75.1682, 39.9506], distanceFromCentroid: 0.3, rating: 4.3, reviewDate: '2023-12-20' },
      { id: 'r5', name: 'The Reading Room', category: 'Bar', location: [-75.1592, 39.9536], distanceFromCentroid: 0.6, rating: 4.1, reviewDate: '2023-11-05' },
      { id: 'r6', name: 'Walnut Street Deli', category: 'Deli', location: [-75.1642, 39.9516], distanceFromCentroid: 0.2, rating: 4.0, reviewDate: '2024-04-02' },
      { id: 'r7', name: 'Locust Noodle House', category: 'Chinese', location: [-75.1702, 39.9546], distanceFromCentroid: 0.6, rating: 4.4, reviewDate: '2024-03-22' },
    ],
    generalBBox: {
      minLng: -75.1812,
      maxLng: -75.1492,
      minLat: 39.9396,
      maxLat: 39.9656,
    },
    minimalBBox: {
      minLng: -75.1722,
      maxLng: -75.1582,
      minLat: 39.9476,
      maxLat: 39.9576,
    },
  },
  user_002: {
    visitedRestaurants: [
      { id: 'r6', name: 'Old City Tavern', category: 'American', location: [-75.1452, 39.9426], distanceFromCentroid: 0.2, rating: 4.4, reviewDate: '2024-04-10' },
      { id: 'r7', name: 'Northern Liberties BBQ', category: 'BBQ', location: [-75.1352, 39.9626], distanceFromCentroid: 2.3, rating: 4.6, reviewDate: '2024-03-05' },
      { id: 'r8', name: 'University City Thai', category: 'Thai', location: [-75.1952, 39.9526], distanceFromCentroid: 4.5, rating: 4.2, reviewDate: '2024-02-18' },
      { id: 'r9', name: 'South Philly Cheesesteaks', category: 'American', location: [-75.1552, 39.9226], distanceFromCentroid: 2.8, rating: 4.7, reviewDate: '2024-01-25' },
      { id: 'r10', name: 'Fishtown Brewery', category: 'Bar', location: [-75.1252, 39.9726], distanceFromCentroid: 3.9, rating: 4.3, reviewDate: '2023-12-12' },
      { id: 'r11', name: 'Manayunk Grill', category: 'American', location: [-75.0252, 39.9826], distanceFromCentroid: 12.5, rating: 4.5, reviewDate: '2024-04-15' },
    ],
    generalBBox: {
      minLng: -75.2052,
      maxLng: -75.0152,
      minLat: 39.9126,
      maxLat: 39.9926,
    },
    minimalBBox: {
      minLng: -75.1552,
      maxLng: -75.1352,
      minLat: 39.9326,
      maxLat: 39.9526,
    },
  },
  user_003: {
    visitedRestaurants: [
      { id: 'r11', name: 'Manayunk Grill', category: 'American', location: [-75.1752, 39.9626], distanceFromCentroid: 0.1, rating: 4.1, reviewDate: '2024-04-08' },
      { id: 'r12', name: 'Main Street Deli', category: 'Deli', location: [-75.1782, 39.9606], distanceFromCentroid: 0.3, rating: 4.0, reviewDate: '2024-03-20' },
      { id: 'r13', name: 'Riverside Seafood', category: 'Seafood', location: [-75.1722, 39.9646], distanceFromCentroid: 0.4, rating: 4.4, reviewDate: '2024-02-14' },
      { id: 'r14', name: 'Coffee Corner', category: 'Cafe', location: [-75.1762, 39.9616], distanceFromCentroid: 0.2, rating: 4.2, reviewDate: '2024-01-30' },
      { id: 'r15', name: 'Ridge Avenue Pizza', category: 'Italian', location: [-75.1742, 39.9636], distanceFromCentroid: 0.15, rating: 4.3, reviewDate: '2024-04-01' },
    ],
    generalBBox: {
      minLng: -75.1852,
      maxLng: -75.1652,
      minLat: 39.9556,
      maxLat: 39.9696,
    },
    minimalBBox: {
      minLng: -75.1792,
      maxLng: -75.1712,
      minLat: 39.9596,
      maxLat: 39.9656,
    },
  },
  user_004: {
    visitedRestaurants: [
      { id: 'r15', name: 'Art Museum Cafe', category: 'Cafe', location: [-75.1752, 39.9656], distanceFromCentroid: 3.8, rating: 4.3, reviewDate: '2024-04-12' },
      { id: 'r16', name: 'Chinatown Dim Sum', category: 'Chinese', location: [-75.1552, 39.9556], distanceFromCentroid: 2.6, rating: 4.5, reviewDate: '2024-03-28' },
      { id: 'r17', name: 'Navy Yard Steakhouse', category: 'Steakhouse', location: [-75.1452, 39.9126], distanceFromCentroid: 2.4, rating: 4.6, reviewDate: '2024-02-22' },
      { id: 'r18', name: 'East Falls Pub', category: 'Pub', location: [-75.1852, 39.9826], distanceFromCentroid: 5.8, rating: 4.0, reviewDate: '2024-01-15' },
      { id: 'r19', name: 'Passyunk Pizza', category: 'Italian', location: [-75.1652, 39.9226], distanceFromCentroid: 1.2, rating: 4.4, reviewDate: '2023-12-28' },
      { id: 'r20', name: 'West Philly Curry', category: 'Indian', location: [-75.2152, 39.9526], distanceFromCentroid: 6.2, rating: 4.6, reviewDate: '2024-04-05' },
      { id: 'r21', name: 'Germantown Bistro', category: 'French', location: [-75.1752, 39.9926], distanceFromCentroid: 6.8, rating: 4.2, reviewDate: '2024-03-15' },
    ],
    generalBBox: {
      minLng: -75.2252,
      maxLng: -75.1352,
      minLat: 39.9026,
      maxLat: 40.0026,
    },
    minimalBBox: {
      minLng: -75.1752,
      maxLng: -75.1452,
      minLat: 39.9226,
      maxLat: 39.9556,
    },
  },
};

export const mockBaselineRecommendations: Record<string, Recommendation[]> = {
  user_001: [
    { restaurant: { id: 'br1', name: 'Market Street Fusion', category: 'Asian Fusion', location: [-75.1582, 39.9516], distanceFromCentroid: 0.8, rating: 4.4 }, score: 0.89 },
    { restaurant: { id: 'br2', name: 'Liberty Place Grill', category: 'American', location: [-75.1692, 39.9486], distanceFromCentroid: 0.9, rating: 4.2 }, score: 0.85 },
    { restaurant: { id: 'br3', name: 'Spring Garden Thai', category: 'Thai', location: [-75.1752, 39.9656], distanceFromCentroid: 1.6, rating: 4.5 }, score: 0.82 },
    { restaurant: { id: 'br4', name: 'Frankford Tacos', category: 'Mexican', location: [-75.1352, 39.9726], distanceFromCentroid: 3.2, rating: 4.3 }, score: 0.78 },
    { restaurant: { id: 'br5', name: 'West Philly Curry', category: 'Indian', location: [-75.2052, 39.9526], distanceFromCentroid: 4.1, rating: 4.6 }, score: 0.75 },
  ],
  user_002: [
    { restaurant: { id: 'br6', name: 'Delaware Ave Seafood', category: 'Seafood', location: [-75.1352, 39.9526], distanceFromCentroid: 1.4, rating: 4.5 }, score: 0.91 },
    { restaurant: { id: 'br7', name: 'Bella Vista Italian', category: 'Italian', location: [-75.1552, 39.9326], distanceFromCentroid: 1.2, rating: 4.3 }, score: 0.87 },
    { restaurant: { id: 'br8', name: 'Fairmount Brunch', category: 'Brunch', location: [-75.1752, 39.9726], distanceFromCentroid: 4.2, rating: 4.4 }, score: 0.83 },
    { restaurant: { id: 'br9', name: 'Chestnut Hill Bistro', category: 'French', location: [-75.2052, 39.9926], distanceFromCentroid: 8.5, rating: 4.7 }, score: 0.79 },
    { restaurant: { id: 'br10', name: 'Point Breeze Soul', category: 'Soul Food', location: [-75.1852, 39.9326], distanceFromCentroid: 4.5, rating: 4.2 }, score: 0.76 },
  ],
  user_003: [
    { restaurant: { id: 'br11', name: 'Roxborough Pizza', category: 'Italian', location: [-75.1852, 39.9726], distanceFromCentroid: 1.3, rating: 4.2 }, score: 0.88 },
    { restaurant: { id: 'br12', name: 'Ridge Ave Sushi', category: 'Japanese', location: [-75.1782, 39.9656], distanceFromCentroid: 0.5, rating: 4.4 }, score: 0.86 },
    { restaurant: { id: 'br13', name: 'Center City Steaks', category: 'Steakhouse', location: [-75.1652, 39.9526], distanceFromCentroid: 1.2, rating: 4.6 }, score: 0.82 },
    { restaurant: { id: 'br14', name: 'Germantown BBQ', category: 'BBQ', location: [-75.1752, 39.9926], distanceFromCentroid: 3.4, rating: 4.3 }, score: 0.78 },
    { restaurant: { id: 'br15', name: 'South Street Tacos', category: 'Mexican', location: [-75.1552, 39.9426], distanceFromCentroid: 2.6, rating: 4.1 }, score: 0.74 },
  ],
  user_004: [
    { restaurant: { id: 'br16', name: 'Girard Ave Ramen', category: 'Japanese', location: [-75.1452, 39.9626], distanceFromCentroid: 3.4, rating: 4.5 }, score: 0.90 },
    { restaurant: { id: 'br17', name: 'Temple Thai', category: 'Thai', location: [-75.1552, 39.9826], distanceFromCentroid: 5.6, rating: 4.3 }, score: 0.86 },
    { restaurant: { id: 'br18', name: 'Washington Ave Pho', category: 'Vietnamese', location: [-75.1652, 39.9226], distanceFromCentroid: 1.2, rating: 4.4 }, score: 0.83 },
    { restaurant: { id: 'br19', name: 'Penns Landing Oysters', category: 'Seafood', location: [-75.1352, 39.9426], distanceFromCentroid: 2.3, rating: 4.6 }, score: 0.80 },
    { restaurant: { id: 'br20', name: 'Spruce Hill Brunch', category: 'Brunch', location: [-75.2052, 39.9526], distanceFromCentroid: 5.4, rating: 4.2 }, score: 0.76 },
  ],
};

export const mockMobilityRecommendations: Record<string, Recommendation[]> = {
  user_001: [
    { restaurant: { id: 'mr1', name: 'Walnut St Bistro', category: 'French', location: [-75.1672, 39.9506], distanceFromCentroid: 0.3, rating: 4.5 }, score: 0.94, tag: 'closer' },
    { restaurant: { id: 'mr2', name: 'Market Street Fusion', category: 'Asian Fusion', location: [-75.1582, 39.9516], distanceFromCentroid: 0.8, rating: 4.4 }, score: 0.91 },
    { restaurant: { id: 'mr3', name: 'Locust Walk Noodles', category: 'Chinese', location: [-75.1702, 39.9536], distanceFromCentroid: 0.5, rating: 4.3 }, score: 0.88, tag: 'closer' },
    { restaurant: { id: 'mr4', name: 'Sansom St Wine Bar', category: 'Wine Bar', location: [-75.1632, 39.9496], distanceFromCentroid: 0.4, rating: 4.6 }, score: 0.85, tag: 'closer' },
    { restaurant: { id: 'mr5', name: 'Liberty Place Grill', category: 'American', location: [-75.1692, 39.9486], distanceFromCentroid: 0.9, rating: 4.2 }, score: 0.82 },
  ],
  user_002: [
    { restaurant: { id: 'mr6', name: 'Germantown Fusion', category: 'Fusion', location: [-75.1852, 39.9926], distanceFromCentroid: 7.2, rating: 4.7 }, score: 0.93, tag: 'exploratory' },
    { restaurant: { id: 'mr7', name: 'Manayunk Waterfront', category: 'American', location: [-75.0252, 39.9726], distanceFromCentroid: 12.8, rating: 4.5 }, score: 0.90, tag: 'exploratory' },
    { restaurant: { id: 'mr8', name: 'Delaware Ave Seafood', category: 'Seafood', location: [-75.1352, 39.9526], distanceFromCentroid: 1.4, rating: 4.5 }, score: 0.87 },
    { restaurant: { id: 'mr9', name: 'Northeast Philly Greek', category: 'Greek', location: [-75.0752, 40.0226], distanceFromCentroid: 11.5, rating: 4.4 }, score: 0.84, tag: 'exploratory' },
    { restaurant: { id: 'mr10', name: 'West Chester Farm Table', category: 'Farm-to-Table', location: [-75.6052, 39.9526], distanceFromCentroid: 45.2, rating: 4.8 }, score: 0.81, tag: 'exploratory' },
  ],
  user_003: [
    { restaurant: { id: 'mr11', name: 'Manayunk Terrace', category: 'Mediterranean', location: [-75.1762, 39.9636], distanceFromCentroid: 0.2, rating: 4.5 }, score: 0.95, tag: 'closer' },
    { restaurant: { id: 'mr12', name: 'Ridge Ave Sushi', category: 'Japanese', location: [-75.1782, 39.9656], distanceFromCentroid: 0.5, rating: 4.4 }, score: 0.92, tag: 'closer' },
    { restaurant: { id: 'mr13', name: 'Green Lane Gastropub', category: 'Gastropub', location: [-75.1742, 39.9606], distanceFromCentroid: 0.3, rating: 4.3 }, score: 0.89, tag: 'closer' },
    { restaurant: { id: 'mr14', name: 'Wissahickon Wine', category: 'Wine Bar', location: [-75.1812, 39.9666], distanceFromCentroid: 0.7, rating: 4.6 }, score: 0.86, tag: 'closer' },
    { restaurant: { id: 'mr15', name: 'Roxborough Pizza', category: 'Italian', location: [-75.1852, 39.9726], distanceFromCentroid: 1.3, rating: 4.2 }, score: 0.83 },
  ],
  user_004: [
    { restaurant: { id: 'mr16', name: 'Ardmore Main Line', category: 'American', location: [-75.2852, 40.0026], distanceFromCentroid: 15.4, rating: 4.6 }, score: 0.92, tag: 'exploratory' },
    { restaurant: { id: 'mr17', name: 'King of Prussia Fusion', category: 'Fusion', location: [-75.3852, 40.0926], distanceFromCentroid: 25.8, rating: 4.7 }, score: 0.89, tag: 'exploratory' },
    { restaurant: { id: 'mr18', name: 'Girard Ave Ramen', category: 'Japanese', location: [-75.1452, 39.9626], distanceFromCentroid: 3.4, rating: 4.5 }, score: 0.86 },
    { restaurant: { id: 'mr19', name: 'Media Borough Brunch', category: 'Brunch', location: [-75.3852, 39.9126], distanceFromCentroid: 24.2, rating: 4.5 }, score: 0.83, tag: 'exploratory' },
    { restaurant: { id: 'mr20', name: 'Bucks County Farm', category: 'Farm-to-Table', location: [-75.0052, 40.2226], distanceFromCentroid: 35.6, rating: 4.8 }, score: 0.80, tag: 'exploratory' },
  ],
};
