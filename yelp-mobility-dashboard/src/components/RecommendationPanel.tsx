import React from 'react';
import { Recommendation } from '@/types';
import { MapPin, Star, ArrowRight, Compass } from 'lucide-react';

interface RecommendationPanelProps {
  title: string;
  recommendations: Recommendation[];
  variant: 'baseline' | 'mobility';
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  title,
  recommendations,
  variant,
}) => {
  const isBaseline = variant === 'baseline';

  return (
    <div className="dashboard-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0 flex items-center gap-2">
          {isBaseline ? (
            <div className="w-2 h-2 rounded-full bg-baseline" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-mobility-aware" />
          )}
          {title}
        </h2>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {isBaseline ? 'CF Model' : 'Mobility-Aware'}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {recommendations.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Select a user to view recommendations
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <div
              key={rec.restaurant.id}
              className="recommendation-card animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {rec.restaurant.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      {rec.restaurant.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {rec.restaurant.distanceFromCentroid.toFixed(1)} km
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {rec.restaurant.rating}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {(rec.score * 100).toFixed(0)}%
                  </span>
                  {rec.tag && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        rec.tag === 'closer'
                          ? 'bg-mobility-aware/15 text-mobility-aware'
                          : 'bg-explorer/15 text-explorer'
                      }`}
                    >
                      {rec.tag === 'closer' ? (
                        <span className="flex items-center gap-1">
                          <ArrowRight className="h-2.5 w-2.5" />
                          Closer
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Compass className="h-2.5 w-2.5" />
                          Explore
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendationPanel;
