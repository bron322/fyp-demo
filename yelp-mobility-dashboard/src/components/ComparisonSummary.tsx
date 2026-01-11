import React from 'react';
import { Recommendation } from '@/types';
import { ArrowLeftRight, TrendingUp, MapPin, AlertCircle } from 'lucide-react';

interface ComparisonSummaryProps {
  baselineRecs: Recommendation[];
  mobilityRecs: Recommendation[];
  mobilityClass: 'Local Expert' | 'Explorer' | null;
}

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({
  baselineRecs,
  mobilityRecs,
  mobilityClass,
}) => {
  if (baselineRecs.length === 0 || mobilityRecs.length === 0) {
    return null;
  }

  // Calculate metrics
  const baselineNames = new Set(baselineRecs.map((r) => r.restaurant.id));
  const mobilityNames = new Set(mobilityRecs.map((r) => r.restaurant.id));

  const overlap = [...baselineNames].filter((id) => mobilityNames.has(id)).length;
  const overlapPercentage = ((overlap / baselineRecs.length) * 100).toFixed(0);

  const avgBaselineDistance =
    baselineRecs.reduce((sum, r) => sum + r.restaurant.distanceFromCentroid, 0) /
    baselineRecs.length;
  const avgMobilityDistance =
    mobilityRecs.reduce((sum, r) => sum + r.restaurant.distanceFromCentroid, 0) /
    mobilityRecs.length;

  const distanceDiff = avgMobilityDistance - avgBaselineDistance;
  const closerCount = mobilityRecs.filter((r) => r.tag === 'closer').length;
  const exploratoryCount = mobilityRecs.filter((r) => r.tag === 'exploratory').length;

  return (
    <div className="dashboard-card animate-fade-in">
      <h2 className="section-title flex items-center gap-2">
        <ArrowLeftRight className="h-4 w-4" />
        Comparison Analysis
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-md bg-secondary/50">
          <p className="data-label mb-1">Recommendation Overlap</p>
          <p className="text-xl font-semibold text-foreground">{overlapPercentage}%</p>
          <p className="text-[10px] text-muted-foreground">
            {overlap} of {baselineRecs.length} shared
          </p>
        </div>

        <div className="p-3 rounded-md bg-secondary/50">
          <p className="data-label mb-1">Distance Change</p>
          <p
            className={`text-xl font-semibold ${
              distanceDiff < 0 ? 'text-mobility-aware' : 'text-explorer'
            }`}
          >
            {distanceDiff > 0 ? '+' : ''}
            {distanceDiff.toFixed(1)} km
          </p>
          <p className="text-[10px] text-muted-foreground">
            Avg. from centroid
          </p>
        </div>

        <div className="p-3 rounded-md bg-secondary/50">
          <p className="data-label mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Closer Recs
          </p>
          <p className="text-xl font-semibold text-mobility-aware">{closerCount}</p>
          <p className="text-[10px] text-muted-foreground">Within core region</p>
        </div>

        <div className="p-3 rounded-md bg-secondary/50">
          <p className="data-label mb-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Exploratory Recs
          </p>
          <p className="text-xl font-semibold text-explorer">{exploratoryCount}</p>
          <p className="text-[10px] text-muted-foreground">Beyond usual range</p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/10">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Mobility-Aware Insight
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mobilityClass === 'Local Expert' ? (
                <>
                  For this <strong className="text-local-expert">Local Expert</strong>,
                  the mobility-aware model prioritizes restaurants closer to their core
                  dining region, resulting in {closerCount} recommendations within their
                  usual area. This improves relevance by matching their established
                  geographic preference.
                </>
              ) : (
                <>
                  For this <strong className="text-explorer">Explorer</strong>, the
                  mobility-aware model suggests {exploratoryCount} exploratory options
                  beyond their usual range. This leverages their tendency to try new
                  locations, potentially increasing engagement with novel discoveries.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSummary;
