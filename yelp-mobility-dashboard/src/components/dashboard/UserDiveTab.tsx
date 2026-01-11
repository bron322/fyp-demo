import React, { useState } from 'react';
import {
  User,
  Star,
  MapPin,
  Store,
  Target,
  Home,
  Briefcase,
  ArrowRight,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { UserProfile, VisitData } from '@/data/dashboardData';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface UserDiveTabProps {
  user: UserProfile;
  visitData: VisitData[];
}

const UserDiveTab: React.FC<UserDiveTabProps> = ({ user, visitData }) => {
  const [showWeekends, setShowWeekends] = useState(true);

  const getMobilityIcon = () => {
    switch (user.mobilityType) {
      case 'single-hub':
        return <Home className="w-5 h-5" />;
      case 'two-hub':
        return <ArrowRight className="w-5 h-5" />;
      case 'explorer':
        return <Target className="w-5 h-5" />;
    }
  };

  const getMobilityLabel = () => {
    switch (user.mobilityType) {
      case 'single-hub':
        return 'One-area Regular';
      case 'two-hub':
        return 'Two-area Commuter';
      case 'explorer':
        return 'Explorer';
    }
  };

  const getMobilityColor = () => {
    switch (user.mobilityType) {
      case 'single-hub':
        return 'teal';
      case 'two-hub':
        return 'purple';
      case 'explorer':
        return 'orange';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left: User Profile Card */}
      <div className="dashboard-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.id}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-secondary rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Star className="w-4 h-4" />
              <span className="text-xs">Reviews</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {user.reviewCount}
            </p>
          </div>
          <div className="bg-secondary rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">Cities</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {user.citiesVisited}
            </p>
          </div>
          <div className="bg-secondary rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Store className="w-4 h-4" />
              <span className="text-xs">Restaurants</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {user.restaurantsTried}
            </p>
          </div>
          <div className="bg-secondary rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs">Hubs detected</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {user.detectedHubs}
            </p>
          </div>
        </div>

        {/* Mobility Type Badge */}
        <div className={`mobility-type-card ${user.mobilityType === 'single-hub' ? 'single-hub' : user.mobilityType === 'two-hub' ? 'two-hub' : 'explorer-wide'}`}>
          <div className="flex items-center gap-3">
            <div className={`icon-container ${getMobilityColor()}`}>
              {getMobilityIcon()}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mobility Pattern</p>
              <p className="font-bold text-foreground">{getMobilityLabel()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Visit Timeline */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple" />
              Visited Timeline
            </h3>
            <p className="text-xs text-muted-foreground">
              Restaurant visits over time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="show-weekends"
              checked={showWeekends}
              onCheckedChange={setShowWeekends}
            />
            <Label htmlFor="show-weekends" className="text-sm cursor-pointer">
              Show weekends
            </Label>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                }}
              />
              <Legend />
              <Bar
                dataKey="weekday"
                name="Weekdays"
                fill="hsl(var(--purple))"
                radius={[4, 4, 0, 0]}
              />
              {showWeekends && (
                <Bar
                  dataKey="weekend"
                  name="Weekends"
                  fill="hsl(var(--orange))"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          This chart shows when {user.name.split(' ')[0]} typically visits
          restaurants
        </p>
      </div>

      {/* Right: Hub Pattern Explanation */}
      <div className="space-y-4">
        <div className="dashboard-card">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            {user.detectedHubs === 2 ? (
              <>
                <Home className="w-4 h-4 text-purple" />
                <span>vs</span>
                <Briefcase className="w-4 h-4 text-orange" />
              </>
            ) : (
              <Home className="w-4 h-4 text-teal" />
            )}
            Area Pattern
          </h3>

          {user.detectedHubs === 2 ? (
            <div className="space-y-4">
              {/* Hub A */}
              <div className="bg-purple-light rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-purple" />
                    <span className="font-semibold text-foreground">
                      {user.hubData.hubA?.name}
                    </span>
                  </div>
                  <span className="chip-purple">
                    {user.hubData.hubA?.percent}% of visits
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.hubData.hubA?.area}
                </p>
              </div>

              {/* Hub B */}
              <div className="bg-orange-light rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange" />
                    <span className="font-semibold text-foreground">
                      {user.hubData.hubB?.name}
                    </span>
                  </div>
                  <span className="chip-orange">
                    {user.hubData.hubB?.percent}% of visits
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.hubData.hubB?.area}
                </p>
              </div>

              {/* Hub Separation */}
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="h-px flex-1 bg-border" />
                <div className="bg-secondary rounded-full px-4 py-2">
                  <p className="text-sm font-semibold text-foreground">
                    {user.hubData.hubSeparation} km apart
                  </p>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>
          ) : (
            <div className="bg-teal-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-teal" />
                <span className="font-semibold text-foreground">
                  {user.hubData.hubA?.name}
                </span>
                <span className="chip-teal ml-auto">
                  {user.hubData.hubA?.percent}% of visits
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Mostly stays around one area: {user.hubData.hubA?.area}
              </p>
            </div>
          )}
        </div>

        {/* Why this matters callout */}
        <div className="friendly-callout">
          <div className="flex items-start gap-3">
            <div className="icon-container coral shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">
                Why this matters
              </h4>
              {user.detectedHubs === 2 ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Two-hub users like {user.name.split(' ')[0]} shouldn't be
                  summarized by one centroid, because it lands in the middle of
                  nowhere — a place they never actually visit!
                </p>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Single-hub users like {user.name.split(' ')[0]} are easier to
                  model. A single centroid accurately represents their typical
                  dining area.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-secondary rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            QUICK STATS
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tips left</span>
              <span className="font-semibold">{user.tipCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Check-ins</span>
              <span className="font-semibold">{user.checkinCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg rating</span>
              <span className="font-semibold">4.2 ★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDiveTab;
