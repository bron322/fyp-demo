import React, { useState, useMemo } from 'react';
import { MobilityData, User } from '@/types';
import { MapPin, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SchematicMobilityMapProps {
  user: User | null;
  mobilityData: MobilityData | null;
}

const SchematicMobilityMap: React.FC<SchematicMobilityMapProps> = ({ user, mobilityData }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Transform coordinates to SVG space
  const transformedData = useMemo(() => {
    if (!mobilityData) return null;

    const { generalBBox, minimalBBox, visitedRestaurants } = mobilityData;

    // Calculate padding around the general bbox
    const padding = 0.15;
    const lngRange = generalBBox.maxLng - generalBBox.minLng;
    const latRange = generalBBox.maxLat - generalBBox.minLat;

    const viewMinLng = generalBBox.minLng - lngRange * padding;
    const viewMaxLng = generalBBox.maxLng + lngRange * padding;
    const viewMinLat = generalBBox.minLat - latRange * padding;
    const viewMaxLat = generalBBox.maxLat + latRange * padding;

    const viewLngRange = viewMaxLng - viewMinLng;
    const viewLatRange = viewMaxLat - viewMinLat;

    // SVG dimensions
    const svgWidth = 600;
    const svgHeight = 400;

    // Transform function
    const toSVG = (lng: number, lat: number) => ({
      x: ((lng - viewMinLng) / viewLngRange) * svgWidth,
      y: svgHeight - ((lat - viewMinLat) / viewLatRange) * svgHeight, // Flip Y axis
    });

    // Transform bounding boxes
    const generalBoxSVG = {
      topLeft: toSVG(generalBBox.minLng, generalBBox.maxLat),
      bottomRight: toSVG(generalBBox.maxLng, generalBBox.minLat),
    };

    const minimalBoxSVG = {
      topLeft: toSVG(minimalBBox.minLng, minimalBBox.maxLat),
      bottomRight: toSVG(minimalBBox.maxLng, minimalBBox.minLat),
    };

    // Transform restaurant points
    const pointsSVG = visitedRestaurants.map((restaurant, index) => ({
      ...restaurant,
      svgX: toSVG(restaurant.location[0], restaurant.location[1]).x,
      svgY: toSVG(restaurant.location[0], restaurant.location[1]).y,
      id: index,
    }));

    // Transform centroid
    const centroidSVG = user ? toSVG(user.centroid[0], user.centroid[1]) : null;

    return {
      generalBoxSVG,
      minimalBoxSVG,
      pointsSVG,
      centroidSVG,
      svgWidth,
      svgHeight,
    };
  }, [mobilityData, user]);

  if (!user || !mobilityData || !transformedData) {
    return (
      <div className="dashboard-card h-full flex flex-col">
        <h2 className="section-title flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Mobility Visualization (Schematic)
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-md">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            Select a user to view their geospatial mobility pattern
          </p>
        </div>
      </div>
    );
  }

  const { generalBoxSVG, minimalBoxSVG, pointsSVG, centroidSVG, svgWidth, svgHeight } = transformedData;

  const generalWidth = generalBoxSVG.bottomRight.x - generalBoxSVG.topLeft.x;
  const generalHeight = generalBoxSVG.bottomRight.y - generalBoxSVG.topLeft.y;
  const minimalWidth = minimalBoxSVG.bottomRight.x - minimalBoxSVG.topLeft.x;
  const minimalHeight = minimalBoxSVG.bottomRight.y - minimalBoxSVG.topLeft.y;

  return (
    <div className="dashboard-card h-full flex flex-col">
      <h2 className="section-title flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Mobility Visualization (Schematic)
      </h2>

      <div className="flex-1 relative rounded-md overflow-hidden border border-border bg-secondary/20 min-h-[300px]">
        <TooltipProvider delayDuration={0}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* General Bounding Box (Full Spatial Footprint) */}
            <rect
              x={generalBoxSVG.topLeft.x}
              y={generalBoxSVG.topLeft.y}
              width={generalWidth}
              height={generalHeight}
              fill="hsl(var(--general-bbox) / 0.08)"
              stroke="hsl(var(--general-bbox))"
              strokeWidth="2.5"
              strokeDasharray="8 4"
            />

            {/* Minimal Bounding Box (Core Region) */}
            <rect
              x={minimalBoxSVG.topLeft.x}
              y={minimalBoxSVG.topLeft.y}
              width={minimalWidth}
              height={minimalHeight}
              fill="hsl(var(--minimal-bbox) / 0.12)"
              stroke="hsl(var(--minimal-bbox))"
              strokeWidth="2.5"
            />

            {/* Restaurant Points */}
            {pointsSVG.map((point) => (
              <Tooltip key={point.id}>
                <TooltipTrigger asChild>
                  <circle
                    cx={point.svgX}
                    cy={point.svgY}
                    r={hoveredPoint === point.id ? 10 : 8}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--card))"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-150"
                    style={{
                      filter: hoveredPoint === point.id ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                    }}
                    onMouseEnter={() => setHoveredPoint(point.id)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px]">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{point.name}</p>
                    <div className="text-xs space-y-0.5 text-muted-foreground">
                      <p><span className="font-medium text-foreground">Category:</span> {point.category}</p>
                      <p><span className="font-medium text-foreground">Reviewed:</span> {new Date(point.reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      <p><span className="font-medium text-foreground">Distance:</span> {point.distanceFromCentroid.toFixed(2)} km from centroid</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* User Centroid */}
            {centroidSVG && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <circle
                    cx={centroidSVG.x}
                    cy={centroidSVG.y}
                    r={10}
                    fill="hsl(var(--accent))"
                    stroke="hsl(var(--card))"
                    strokeWidth="3"
                    className="cursor-pointer"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm">User Centroid</p>
                    <p className="text-xs text-muted-foreground">Geographic center of dining activity</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Axis Labels */}
            <text x={svgWidth / 2} y={svgHeight - 8} textAnchor="middle" className="fill-muted-foreground text-xs font-medium">
              Longitude →
            </text>
            <text x={14} y={svgHeight / 2} textAnchor="middle" className="fill-muted-foreground text-xs font-medium" transform={`rotate(-90, 14, ${svgHeight / 2})`}>
              Latitude →
            </text>
          </svg>
        </TooltipProvider>

        {/* Box Labels */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className="bg-general-bbox/90 text-card px-2.5 py-1 rounded text-[10px] font-medium shadow-sm">
            General Bounding Box (Full Spatial Footprint)
          </div>
          <div className="bg-minimal-bbox/90 text-card px-2.5 py-1 rounded text-[10px] font-medium shadow-sm">
            Minimal Bounding Box (Core Region)
          </div>
        </div>

        {/* Legend Panel */}
        <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-md max-w-[260px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Map Legend
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Visited Restaurants */}
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-card flex-shrink-0 shadow-sm" />
              <p className="text-xs text-foreground">Visited Restaurants</p>
            </div>

            {/* User Centroid */}
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-accent border-2 border-card flex-shrink-0 shadow-sm" />
              <p className="text-xs text-foreground">User Centroid</p>
            </div>

            {/* General Bounding Box */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-3.5 rounded-sm border-2 border-dashed border-general-bbox bg-general-bbox/15 flex-shrink-0" />
              <p className="text-xs text-foreground">General Bounding Box</p>
            </div>

            {/* Minimal Bounding Box */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-3.5 rounded-sm border-2 border-minimal-bbox bg-minimal-bbox/20 flex-shrink-0" />
              <p className="text-xs text-foreground">Minimal Bounding Box</p>
            </div>
          </div>

          {/* Area Ratio Formula */}
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
        </div>

        {/* Schematic Mode Indicator */}
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2.5 py-1.5 rounded border border-border shadow-sm">
          <p className="text-[10px] text-muted-foreground font-medium">
            Schematic View • No API Required
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchematicMobilityMap;
