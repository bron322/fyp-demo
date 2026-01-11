export type MobilityClass = 'Local Expert' | 'Explorer';

export interface User {
  id: string;
  name: string;
  reviewCount: number;
  mobilityClass: MobilityClass;
  areaRatio: number;
  centroid: [number, number]; // [lng, lat]
}

export interface VisitedRestaurant {
  id: string;
  name: string;
  category: string;
  location: [number, number]; // [lng, lat]
  distanceFromCentroid: number; // in km
  rating: number;
  reviewDate: string; // ISO date string
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: [number, number]; // [lng, lat]
  distanceFromCentroid: number; // in km
  rating: number;
}

export interface BoundingBox {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export interface MobilityData {
  visitedRestaurants: VisitedRestaurant[];
  generalBBox: BoundingBox;
  minimalBBox: BoundingBox;
}

export interface Recommendation {
  restaurant: Restaurant;
  score: number;
  tag?: 'closer' | 'exploratory';
}
