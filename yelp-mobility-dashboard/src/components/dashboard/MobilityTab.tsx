import React, { useState } from 'react';
import {
  Home,
  Briefcase,
  Compass,
  MapPin,
  ArrowRight,
  Info,
  Eye,
  EyeOff,
  Target,
} from 'lucide-react';
import { MobilitySummary, mockHubVisualization } from '@/data/dashboardData';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MobilityTabProps {
  summary: MobilitySummary;
}

const MobilityTab: React.FC<MobilityTabProps> = ({ summary }) => {
  const [showHubs, setShowHubs] = useState(true);
  const [showRadius, setShowRadius] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mobility Summary Cards */}
      <div>
        <h2 className="section-title flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple" />
          Mobility Summary
        </h2>
        <p className="section-subtitle">
          Understanding how users travel to eat
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card teal">
          <div className="icon-container teal mb-3">
            <Home className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {summary.singleHubPercent}%
          </p>
          <p className="text-sm font-semibold text-foreground">One-area users</p>
          <p className="text-xs text-muted-foreground">
            Eat mostly near one place
          </p>
        </div>

        <div className="stat-card purple">
          <div className="icon-container purple mb-3">
            <ArrowRight className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {summary.twoHubPercent}%
          </p>
          <p className="text-sm font-semibold text-foreground">Two-area users</p>
          <p className="text-xs text-muted-foreground">
            Home + work pattern
          </p>
        </div>

        <div className="stat-card orange">
          <div className="icon-container orange mb-3">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {summary.avgHubSeparation} km
          </p>
          <p className="text-sm font-semibold text-foreground">
            Average hub distance
          </p>
          <p className="text-xs text-muted-foreground">
            Between home & work areas
          </p>
        </div>

        <div className="stat-card coral">
          <div className="icon-container coral mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {summary.medianTravelRange} km
          </p>
          <p className="text-sm font-semibold text-foreground">
            Typical travel range
          </p>
          <p className="text-xs text-muted-foreground">
            Median distance traveled
          </p>
        </div>
      </div>

      {/* What this means callout */}
      <div className="friendly-callout">
        <div className="flex items-start gap-3">
          <div className="icon-container orange shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-1">
              What this means
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Some users regularly eat in two clusters of areas — like near home
              and near their workplace. Using only one center point (centroid)
              can be misleading because it might land somewhere in between,
              where the user never actually goes!
            </p>
          </div>
        </div>
      </div>

      {/* Main content: Map + Mobility Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Food Activity Map */}
        <div className="lg:col-span-2 dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="chip-purple">Interactive</span>
              Food Activity Map
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-hubs"
                  checked={showHubs}
                  onCheckedChange={setShowHubs}
                />
                <Label htmlFor="show-hubs" className="text-sm cursor-pointer">
                  {showHubs ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="ml-1">Show hubs</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="show-radius"
                  checked={showRadius}
                  onCheckedChange={setShowRadius}
                />
                <Label htmlFor="show-radius" className="text-sm cursor-pointer">
                  Show radius
                </Label>
              </div>
            </div>
          </div>

          {/* Schematic Map Visualization */}
          <div className="relative bg-gradient-to-br from-secondary to-muted rounded-xl overflow-hidden h-[400px]">
            {/* Grid background */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Hub radius circles */}
              {showHubs && showRadius && (
                <>
                  <circle
                    cx={`${mockHubVisualization.hubHomeCenter.x}%`}
                    cy={`${mockHubVisualization.hubHomeCenter.y}%`}
                    r={`${mockHubVisualization.hubHomeRadius}%`}
                    className="fill-purple/10 stroke-purple stroke-2"
                    strokeDasharray="8 4"
                  />
                  <circle
                    cx={`${mockHubVisualization.hubWorkCenter.x}%`}
                    cy={`${mockHubVisualization.hubWorkCenter.y}%`}
                    r={`${mockHubVisualization.hubWorkRadius}%`}
                    className="fill-orange/10 stroke-orange stroke-2"
                    strokeDasharray="8 4"
                  />
                </>
              )}

              {/* Connection line between hubs */}
              {showHubs && (
                <line
                  x1={`${mockHubVisualization.hubHomeCenter.x}%`}
                  y1={`${mockHubVisualization.hubHomeCenter.y}%`}
                  x2={`${mockHubVisualization.hubWorkCenter.x}%`}
                  y2={`${mockHubVisualization.hubWorkCenter.y}%`}
                  className="stroke-muted-foreground/30"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              )}

              {/* Visited restaurant points */}
              {mockHubVisualization.points
                .filter((p) => !p.isHub)
                .map((point) => (
                  <g key={point.id}>
                    <circle
                      cx={`${point.x}%`}
                      cy={`${point.y}%`}
                      r="8"
                      className="fill-teal stroke-white stroke-2"
                    />
                    <title>{point.name}</title>
                  </g>
                ))}

              {/* Hub markers */}
              {showHubs &&
                mockHubVisualization.points
                  .filter((p) => p.isHub)
                  .map((hub) => (
                    <g key={hub.id}>
                      <circle
                        cx={`${hub.x}%`}
                        cy={`${hub.y}%`}
                        r="16"
                        className={`${
                          hub.hubType === 'home'
                            ? 'fill-purple'
                            : 'fill-orange'
                        } stroke-white stroke-3`}
                      />
                      {hub.hubType === 'home' ? (
                        <foreignObject
                          x={`calc(${hub.x}% - 8px)`}
                          y={`calc(${hub.y}% - 8px)`}
                          width="16"
                          height="16"
                        >
                          <Home className="w-4 h-4 text-white" />
                        </foreignObject>
                      ) : (
                        <foreignObject
                          x={`calc(${hub.x}% - 8px)`}
                          y={`calc(${hub.y}% - 8px)`}
                          width="16"
                          height="16"
                        >
                          <Briefcase className="w-4 h-4 text-white" />
                        </foreignObject>
                      )}
                      <title>{hub.name}</title>
                    </g>
                  ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-xs font-semibold text-muted-foreground mb-3">
                LEGEND
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-teal" />
                  <span className="text-sm">Visited places</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple flex items-center justify-center">
                    <Home className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-sm">Home-area hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange flex items-center justify-center">
                    <Briefcase className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-sm">Work-area hub</span>
                </div>
              </div>
            </div>

            {/* Distance label */}
            {showHubs && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <p className="text-sm font-semibold text-foreground">
                  8.7 km apart
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobility Types Side Panel */}
        <div className="space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange" />
            Mobility Types
          </h3>

          <div className="mobility-type-card single-hub">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-teal" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">One-area Regular</h4>
                <span className="chip-teal text-[10px]">Single hub</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Eats mostly around one neighborhood. Easy to predict preferences
              based on nearby options.
            </p>
          </div>

          <div className="mobility-type-card two-hub">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple/20 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-purple" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Two-area Commuter</h4>
                <span className="chip-purple text-[10px]">Two hubs</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Regularly visits two distinct areas — typically near home and
              workplace. Needs separate recommendations for each zone.
            </p>
          </div>

          <div className="mobility-type-card explorer-wide">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-orange" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Explorer</h4>
                <span className="chip-orange text-[10px]">Wide spread</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Visits restaurants across many different areas. More open to
              diverse recommendations regardless of location.
            </p>
          </div>

          {/* Mini insight */}
          <div className="bg-secondary rounded-xl p-4 mt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              💡 KEY INSIGHT
            </p>
            <p className="text-sm text-foreground">
              Two-hub users account for <strong>38%</strong> of our sample.
              Traditional single-centroid methods miss this pattern!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilityTab;
