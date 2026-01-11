// Mock data for the Yelp Mobility Data Analysis Dashboard

export interface DatasetStats {
    totalUsers: number;
    totalReviews: number;
    totalBusinesses: number;
    totalTips: number;
    totalCheckins: number;
  }
  
  export interface CityData {
    city: string;
    state: string;
    businessCount: number;
    reviewCount: number;
  }
  
  export interface MobilitySummary {
    singleHubPercent: number;
    twoHubPercent: number;
    avgHubSeparation: number; // km
    medianTravelRange: number; // km
  }
  
  export interface UserProfile {
    id: string;
    name: string;
    reviewCount: number;
    tipCount: number;
    checkinCount: number;
    citiesVisited: number;
    restaurantsTried: number;
    detectedHubs: 1 | 2;
    hubData: {
      hubA?: { name: string; percent: number; area: string };
      hubB?: { name: string; percent: number; area: string };
      hubSeparation?: number;
    };
    mobilityType: 'single-hub' | 'two-hub' | 'explorer';
  }
  
  export interface VisitData {
    month: string;
    weekday: number;
    weekend: number;
  }
  
  // Dataset snapshot stats
  export const datasetStats: DatasetStats = {
    totalUsers: 10000,
    totalReviews: 287432,
    totalBusinesses: 15847,
    totalTips: 42156,
    totalCheckins: 89234,
  };
  
  // Top cities by restaurant count
  export const topCities: CityData[] = [
    { city: 'Philadelphia', state: 'PA', businessCount: 3421, reviewCount: 65432 },
    { city: 'Tampa', state: 'FL', businessCount: 2156, reviewCount: 43218 },
    { city: 'Indianapolis', state: 'IN', businessCount: 1823, reviewCount: 35621 },
    { city: 'Nashville', state: 'TN', businessCount: 1654, reviewCount: 32145 },
    { city: 'New Orleans', state: 'LA', businessCount: 1432, reviewCount: 28976 },
    { city: 'Tucson', state: 'AZ', businessCount: 1287, reviewCount: 24532 },
    { city: 'Reno', state: 'NV', businessCount: 1156, reviewCount: 21876 },
    { city: 'Santa Barbara', state: 'CA', businessCount: 987, reviewCount: 18654 },
  ];
  
  // Top states by restaurant count
  export const topStates: { state: string; fullName: string; businessCount: number }[] = [
    { state: 'PA', fullName: 'Pennsylvania', businessCount: 4532 },
    { state: 'FL', fullName: 'Florida', businessCount: 3214 },
    { state: 'TN', fullName: 'Tennessee', businessCount: 2156 },
    { state: 'IN', fullName: 'Indiana', businessCount: 1987 },
    { state: 'LA', fullName: 'Louisiana', businessCount: 1654 },
    { state: 'AZ', fullName: 'Arizona', businessCount: 1432 },
    { state: 'NV', fullName: 'Nevada', businessCount: 1287 },
    { state: 'CA', fullName: 'California', businessCount: 1156 },
  ];
  
  // Mobility summary stats
  export const mobilitySummary: MobilitySummary = {
    singleHubPercent: 42,
    twoHubPercent: 38,
    avgHubSeparation: 8.7,
    medianTravelRange: 5.2,
  };
  
  // Sample user profiles
  export const sampleUsers: UserProfile[] = [
    {
      id: 'user_001',
      name: 'Alex Chen',
      reviewCount: 156,
      tipCount: 23,
      checkinCount: 89,
      citiesVisited: 3,
      restaurantsTried: 78,
      detectedHubs: 1,
      hubData: {
        hubA: { name: 'Center City', percent: 92, area: 'Downtown Philadelphia' },
      },
      mobilityType: 'single-hub',
    },
    {
      id: 'user_002',
      name: 'Jordan Smith',
      reviewCount: 89,
      tipCount: 15,
      checkinCount: 45,
      citiesVisited: 5,
      restaurantsTried: 52,
      detectedHubs: 2,
      hubData: {
        hubA: { name: 'East Side', percent: 68, area: 'Near home' },
        hubB: { name: 'West District', percent: 32, area: 'Near workplace' },
        hubSeparation: 12.4,
      },
      mobilityType: 'two-hub',
    },
    {
      id: 'user_003',
      name: 'Sam Williams',
      reviewCount: 234,
      tipCount: 45,
      checkinCount: 156,
      citiesVisited: 2,
      restaurantsTried: 98,
      detectedHubs: 1,
      hubData: {
        hubA: { name: 'Manayunk', percent: 88, area: 'Northwest Philadelphia' },
      },
      mobilityType: 'single-hub',
    },
    {
      id: 'user_004',
      name: 'Taylor Brown',
      reviewCount: 67,
      tipCount: 8,
      checkinCount: 32,
      citiesVisited: 8,
      restaurantsTried: 45,
      detectedHubs: 2,
      hubData: {
        hubA: { name: 'Various', percent: 55, area: 'Multiple areas' },
        hubB: { name: 'Scattered', percent: 45, area: 'Wide spread' },
        hubSeparation: 25.8,
      },
      mobilityType: 'explorer',
    },
  ];
  
  // Visit timeline data
  export const visitTimeline: VisitData[] = [
    { month: 'Jan', weekday: 12, weekend: 8 },
    { month: 'Feb', weekday: 15, weekend: 10 },
    { month: 'Mar', weekday: 18, weekend: 12 },
    { month: 'Apr', weekday: 14, weekend: 15 },
    { month: 'May', weekday: 20, weekend: 18 },
    { month: 'Jun', weekday: 16, weekend: 14 },
    { month: 'Jul', weekday: 22, weekend: 20 },
    { month: 'Aug', weekday: 19, weekend: 16 },
    { month: 'Sep', weekday: 15, weekend: 12 },
    { month: 'Oct', weekday: 17, weekend: 14 },
    { month: 'Nov', weekday: 13, weekend: 11 },
    { month: 'Dec', weekday: 16, weekend: 18 },
  ];
  
  // Hub visualization mock data for the map
  export interface HubPoint {
    id: string;
    name: string;
    x: number; // percentage position
    y: number;
    isHub: boolean;
    hubType?: 'home' | 'work';
  }
  
  export const mockHubVisualization = {
    points: [
      { id: 'p1', name: 'Cafe Luna', x: 25, y: 30, isHub: false },
      { id: 'p2', name: 'Pasta Place', x: 28, y: 35, isHub: false },
      { id: 'p3', name: 'Morning Diner', x: 22, y: 28, isHub: false },
      { id: 'p4', name: 'Pizza Corner', x: 30, y: 32, isHub: false },
      { id: 'p5', name: 'Sushi Spot', x: 26, y: 38, isHub: false },
      { id: 'hub-home', name: 'Home Area Hub', x: 26, y: 33, isHub: true, hubType: 'home' },
      { id: 'p6', name: 'Lunch Bistro', x: 72, y: 55, isHub: false },
      { id: 'p7', name: 'Quick Bites', x: 75, y: 60, isHub: false },
      { id: 'p8', name: 'Sandwich Shop', x: 70, y: 52, isHub: false },
      { id: 'p9', name: 'Coffee Hub', x: 78, y: 58, isHub: false },
      { id: 'hub-work', name: 'Work Area Hub', x: 74, y: 56, isHub: true, hubType: 'work' },
    ] as HubPoint[],
    hubHomeCenter: { x: 26, y: 33 },
    hubWorkCenter: { x: 74, y: 56 },
    hubHomeRadius: 12,
    hubWorkRadius: 10,
  };
  