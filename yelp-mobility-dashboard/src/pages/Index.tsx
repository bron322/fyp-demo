import React, { useState } from 'react';
import Header from '@/components/dashboard/Header';
import OverviewTab from '@/components/dashboard/OverviewTab';
import MobilityTab from '@/components/dashboard/MobilityTab';
import UserDiveTab from '@/components/dashboard/UserDiveTab';
import {
  datasetStats,
  topCities,
  topStates,
  mobilitySummary,
  sampleUsers,
  visitTimeline,
  UserProfile,
} from '@/data/dashboardData';
import { useOverviewData } from "@/hooks/useOverviewData";

type TabType = 'overview' | 'mobility' | 'user-dive';

const Index = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [selectedUser, setSelectedUser] = useState<UserProfile>(sampleUsers[1]); // Jordan Smith default
  const { stats, topCities, topStates, loading, error } = useOverviewData();

  if (loading) return <div className="p-6">Loading overview…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!stats) return <div className="p-6">No data.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        users={sampleUsers}
      />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {currentTab === 'overview' && (
          <OverviewTab
            stats={stats}
            topCities={topCities}
            topStates={topStates}
            />
        )}
        {currentTab === 'mobility' && (
          <MobilityTab summary={mobilitySummary} />
        )}
        {currentTab === 'user-dive' && (
          <UserDiveTab 
            user={selectedUser} 
            visitData={visitTimeline} 
            onUserChange={setSelectedUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Made for mobility-aware Yelp analysis • Final Year Project • Done by LIM JING JIE U2220642F
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
