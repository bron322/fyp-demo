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
  Info,
} from 'lucide-react';
import { UserProfile, VisitData, sampleUsers } from '@/data/dashboardData';
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
import UserSelectionPanel from '@/components/UserSelectionPanel';

interface UserDiveTabProps {
  user: UserProfile;
  visitData: VisitData[];
  onUserChange: (user: UserProfile) => void;
}

const UserDiveTab: React.FC<UserDiveTabProps> = ({ user, visitData, onUserChange }) => {
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
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="icon-container purple">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-foreground">User Deep Dive</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Explore representative user mobility patterns to validate clustering behavior through case studies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: User Selection Panel */}
        <div className="lg:col-span-1">
          <UserSelectionPanel
            users={sampleUsers}
            selectedUser={user}
            onUserSelect={onUserChange}
          />
        </div>

        {/* Right: User Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Summary Card */}
          <div className="dashboard-card">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">Reviews</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{user.reviewCount}</p>
                </div>
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Store className="w-3 h-3" />
                    <span className="text-xs">Restaurants</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{user.restaurantsTried}</p>
                </div>
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">Cities</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{user.citiesVisited}</p>
                </div>
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Target className="w-3 h-3" />
                    <span className="text-xs">Hubs</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{user.detectedHubs}</p>
                </div>
                <div className={`rounded-xl p-3 text-center border-2 ${
                  user.mobilityType === 'single-hub' 
                    ? 'bg-teal/10 border-teal/30' 
                    : user.mobilityType === 'two-hub' 
                    ? 'bg-purple/10 border-purple/30' 
                    : 'bg-orange/10 border-orange/30'
                }`}>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    {getMobilityIcon()}
                    <span className="text-xs">Pattern</span>
                  </div>
                  <p className={`text-sm font-bold ${
                    user.mobilityType === 'single-hub' 
                      ? 'text-teal' 
                      : user.mobilityType === 'two-hub' 
                      ? 'text-purple' 
                      : 'text-orange'
                  }`}>{getMobilityLabel()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline and Pattern Explanation Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visit Timeline */}
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
                    Weekends
                  </Label>
                </div>
              </div>

              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
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
                Visit frequency by month shows temporal dining patterns
              </p>
            </div>

            {/* Hub Pattern Explanation */}
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
                  <div className="space-y-3">
                    {/* Hub A */}
                    <div className="bg-purple/5 border border-purple/20 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-purple" />
                          <span className="font-semibold text-foreground text-sm">
                            {user.hubData.hubA?.name}
                          </span>
                        </div>
                        <span className="chip-purple text-xs">
                          {user.hubData.hubA?.percent}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">
                        {user.hubData.hubA?.area}
                      </p>
                    </div>

                    {/* Hub B */}
                    <div className="bg-orange/5 border border-orange/20 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-orange" />
                          <span className="font-semibold text-foreground text-sm">
                            {user.hubData.hubB?.name}
                          </span>
                        </div>
                        <span className="chip-orange text-xs">
                          {user.hubData.hubB?.percent}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">
                        {user.hubData.hubB?.area}
                      </p>
                    </div>

                    {/* Hub Separation */}
                    <div className="flex items-center justify-center gap-3 py-2">
                      <div className="h-px flex-1 bg-border" />
                      <div className="bg-secondary rounded-full px-3 py-1">
                        <p className="text-xs font-semibold text-foreground">
                          {user.hubData.hubSeparation} km apart
                        </p>
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-teal/5 border border-teal/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-4 h-4 text-teal" />
                      <span className="font-semibold text-foreground text-sm">
                        {user.hubData.hubA?.name}
                      </span>
                      <span className="chip-teal ml-auto text-xs">
                        {user.hubData.hubA?.percent}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      Concentrated activity: {user.hubData.hubA?.area}
                    </p>
                  </div>
                )}
              </div>

              {/* Why this matters callout */}
              <div className="friendly-callout">
                <div className="flex items-start gap-3">
                  <div className="icon-container coral shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-sm">
                      Why this matters
                    </h4>
                    {user.mobilityType === 'explorer' ? (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Explorers like {user.name.split(' ')[0]} visit restaurants across many areas. 
                        Traditional centroid-based methods fail because their activity has no dominant center.
                      </p>
                    ) : user.detectedHubs === 2 ? (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Two-hub users shouldn't be summarized by one centroid, because it lands 
                        between the hubs — a place they never actually visit!
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Single-hub users are ideal for centroid-based modeling. One location 
                        accurately represents their typical dining area.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-3">
                  ADDITIONAL METRICS
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{user.tipCount}</p>
                    <p className="text-xs text-muted-foreground">Tips</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{user.checkinCount}</p>
                    <p className="text-xs text-muted-foreground">Check-ins</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">4.2 ★</p>
                    <p className="text-xs text-muted-foreground">Avg rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDiveTab;
