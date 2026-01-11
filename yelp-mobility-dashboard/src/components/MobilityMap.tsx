import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MobilityData, User } from '@/types';
import { Input } from '@/components/ui/input';
import { MapPin, Info, Map, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SchematicMobilityMap from './SchematicMobilityMap';

interface MobilityMapProps {
  user: User | null;
  mobilityData: MobilityData | null;
}

type ViewMode = 'schematic' | 'mapbox';

const MobilityMap: React.FC<MobilityMapProps> = ({ user, mobilityData }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isMapReady, setIsMapReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('schematic');

  // Initialize map
  useEffect(() => {
    if (viewMode !== 'mapbox' || !mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-75.1652, 39.9526], // Philadelphia
        zoom: 12,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsMapReady(true);
      });

      return () => {
        map.current?.remove();
        setIsMapReady(false);
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapboxToken, viewMode]);

  // Update map with mobility data
  useEffect(() => {
    if (viewMode !== 'mapbox' || !map.current || !isMapReady || !mobilityData || !user) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Remove existing layers and sources
    const layers = ['general-bbox-fill', 'minimal-bbox-fill', 'general-bbox-line', 'minimal-bbox-line'];
    layers.forEach((layer) => {
      if (map.current?.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
    });

    const sources = ['general-bbox', 'minimal-bbox'];
    sources.forEach((source) => {
      if (map.current?.getSource(source)) {
        map.current.removeSource(source);
      }
    });

    const { generalBBox, minimalBBox, visitedRestaurants } = mobilityData;

    // Add General Bounding Box (Full Spatial Footprint)
    map.current.addSource('general-bbox', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: { label: 'General Bounding Box' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [generalBBox.minLng, generalBBox.minLat],
              [generalBBox.maxLng, generalBBox.minLat],
              [generalBBox.maxLng, generalBBox.maxLat],
              [generalBBox.minLng, generalBBox.maxLat],
              [generalBBox.minLng, generalBBox.minLat],
            ],
          ],
        },
      },
    });

    map.current.addLayer({
      id: 'general-bbox-fill',
      type: 'fill',
      source: 'general-bbox',
      paint: {
        'fill-color': '#1890b8',
        'fill-opacity': 0.08,
      },
    });

    map.current.addLayer({
      id: 'general-bbox-line',
      type: 'line',
      source: 'general-bbox',
      paint: {
        'line-color': '#1890b8',
        'line-width': 2.5,
        'line-dasharray': [6, 3],
      },
    });

    // Add Minimal Bounding Box (Core Region)
    map.current.addSource('minimal-bbox', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: { label: 'Minimal Bounding Box' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [minimalBBox.minLng, minimalBBox.minLat],
              [minimalBBox.maxLng, minimalBBox.minLat],
              [minimalBBox.maxLng, minimalBBox.maxLat],
              [minimalBBox.minLng, minimalBBox.maxLat],
              [minimalBBox.minLng, minimalBBox.minLat],
            ],
          ],
        },
      },
    });

    map.current.addLayer({
      id: 'minimal-bbox-fill',
      type: 'fill',
      source: 'minimal-bbox',
      paint: {
        'fill-color': '#e67e22',
        'fill-opacity': 0.12,
      },
    });

    map.current.addLayer({
      id: 'minimal-bbox-line',
      type: 'line',
      source: 'minimal-bbox',
      paint: {
        'line-color': '#e67e22',
        'line-width': 2.5,
      },
    });

    // Add restaurant markers with tooltips
    visitedRestaurants.forEach((restaurant) => {
      const el = document.createElement('div');
      el.className = 'restaurant-marker';
      el.style.cssText = `
        width: 14px;
        height: 14px;
        background-color: hsl(200, 80%, 40%);
        border: 2.5px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        cursor: pointer;
        transition: transform 0.15s ease;
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Format date for display
      const reviewDate = new Date(restaurant.reviewDate);
      const formattedDate = reviewDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: false,
        className: 'restaurant-popup',
      }).setHTML(`
        <div style="font-family: 'IBM Plex Sans', system-ui, sans-serif; padding: 4px 0;">
          <div style="font-weight: 600; font-size: 13px; color: #1a2733; margin-bottom: 6px;">
            ${restaurant.name}
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 10px; font-weight: 500; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Category</span>
              <span style="font-size: 12px; color: #333;">${restaurant.category}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 10px; font-weight: 500; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Reviewed</span>
              <span style="font-size: 12px; color: #333;">${formattedDate}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 10px; font-weight: 500; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Distance</span>
              <span style="font-size: 12px; color: #333;">${restaurant.distanceFromCentroid.toFixed(2)} km from centroid</span>
            </div>
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(restaurant.location)
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add user centroid marker
    const centroidEl = document.createElement('div');
    centroidEl.style.cssText = `
      width: 18px;
      height: 18px;
      background-color: hsl(175, 60%, 45%);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;

    const centroidPopup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    }).setHTML(`
      <div style="font-family: 'IBM Plex Sans', system-ui, sans-serif; padding: 4px 0;">
        <div style="font-weight: 600; font-size: 13px; color: #1a2733; margin-bottom: 4px;">
          User Centroid
        </div>
        <div style="font-size: 11px; color: #666;">
          Geographic center of dining activity
        </div>
      </div>
    `);

    const centroidMarker = new mapboxgl.Marker(centroidEl)
      .setLngLat(user.centroid)
      .setPopup(centroidPopup)
      .addTo(map.current);

    markersRef.current.push(centroidMarker);

    // Fit map to general bounding box with padding
    map.current.fitBounds(
      [
        [generalBBox.minLng - 0.015, generalBBox.minLat - 0.015],
        [generalBBox.maxLng + 0.015, generalBBox.maxLat + 0.015],
      ],
      { padding: 50, duration: 800 }
    );
  }, [mobilityData, user, isMapReady, viewMode]);

  // View Mode Toggle Component
  const ViewModeToggle = () => (
    <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-lg">
      <Button
        variant={viewMode === 'schematic' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2.5 text-xs gap-1.5"
        onClick={() => setViewMode('schematic')}
      >
        <Grid3X3 className="h-3.5 w-3.5" />
        Schematic
      </Button>
      <Button
        variant={viewMode === 'mapbox' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2.5 text-xs gap-1.5"
        onClick={() => setViewMode('mapbox')}
      >
        <Map className="h-3.5 w-3.5" />
        Live Map
      </Button>
    </div>
  );

  // Schematic mode - render the schematic component
  if (viewMode === 'schematic') {
    return (
      <div className="dashboard-card h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2 mb-0">
            <MapPin className="h-4 w-4" />
            Mobility Visualization
          </h2>
          <ViewModeToggle />
        </div>
        <div className="flex-1 -mt-4">
          <SchematicMobilityMap user={user} mobilityData={mobilityData} />
        </div>
      </div>
    );
  }

  // Mapbox mode - need token
  if (!mapboxToken) {
    return (
      <div className="dashboard-card h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2 mb-0">
            <MapPin className="h-4 w-4" />
            Mobility Visualization
          </h2>
          <ViewModeToggle />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-md">
          <Map className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground text-center mb-4">
            Enter your Mapbox public token to enable live map visualization.
            <br />
            Get one at{' '}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
          <Input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            className="max-w-md bg-background"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Mapbox mode with token
  return (
    <div className="dashboard-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title flex items-center gap-2 mb-0">
          <MapPin className="h-4 w-4" />
          Mobility Visualization
        </h2>
        <ViewModeToggle />
      </div>

      <div className="flex-1 relative rounded-md overflow-hidden border border-border min-h-[300px]">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Legend Panel */}
        <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-md max-w-[280px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Map Legend
            </span>
          </div>

          <div className="space-y-3">
            {/* Visited Restaurants */}
            <div className="flex items-start gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-card flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">Visited Restaurants</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  Locations reviewed by the user (hover for details)
                </p>
              </div>
            </div>

            {/* User Centroid */}
            <div className="flex items-start gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-accent border-2 border-card flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">User Centroid</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  Geographic center of dining activity
                </p>
              </div>
            </div>

            {/* General Bounding Box */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-3 rounded-sm border-2 border-dashed border-general-bbox bg-general-bbox/15 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">General Bounding Box</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  Full spatial footprint enclosing all visited locations
                </p>
              </div>
            </div>

            {/* Minimal Bounding Box */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-3 rounded-sm border-2 border-minimal-bbox bg-minimal-bbox/20 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">Minimal Bounding Box</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  Core dining region used in area ratio computation
                </p>
              </div>
            </div>
          </div>

          {/* Area Ratio Formula */}
          {user && mobilityData && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5">
                Area Ratio Computation
              </p>
              <div className="bg-secondary/50 rounded p-2 font-mono text-[10px] text-foreground">
                <div className="flex items-center justify-between">
                  <span>A<sub>minimal</sub> / A<sub>general</sub></span>
                  <span className="font-semibold">= {user.areaRatio.toFixed(3)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Box Labels on Map */}
        {user && mobilityData && (
          <>
            {/* General BBox Label */}
            <div className="absolute top-3 left-3 bg-general-bbox/90 text-card px-2 py-1 rounded text-[10px] font-medium shadow-sm">
              General Bounding Box (Full Spatial Footprint)
            </div>

            {/* Minimal BBox Label */}
            <div className="absolute top-10 left-3 bg-minimal-bbox/90 text-card px-2 py-1 rounded text-[10px] font-medium shadow-sm">
              Minimal Bounding Box (Core Region)
            </div>
          </>
        )}
      </div>

      {!user && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Select a user to view their geospatial mobility pattern
        </p>
      )}
    </div>
  );
};

export default MobilityMap;
