import React from 'react';
import { ChevronDown, Star, MessageSquare, MapPin } from 'lucide-react';
import { UserProfile } from '@/data/dashboardData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  currentTab: 'overview' | 'mobility' | 'user-dive';
  onTabChange: (tab: 'overview' | 'mobility' | 'user-dive') => void;
  selectedUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  users: UserProfile[];
}

const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  selectedUser,
  onUserChange,
  users,
}) => {
  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'mobility' as const, label: 'Mobility Patterns' },
    { id: 'user-dive' as const, label: 'User Deep Dive' },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Top row */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Yelp Mobility Data Analysis
              </h1>
              <p className="text-xs text-muted-foreground">
                Final Year Project • 10K User Sample
              </p>
            </div>
          </div>

          {/* User Selector */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Sample User</p>
                <p className="text-sm font-semibold text-foreground">
                  {selectedUser.id} – {selectedUser.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip-purple">
                  <Star className="w-3 h-3" />
                  {selectedUser.reviewCount} reviews
                </span>
                <span className="chip-teal">
                  <MessageSquare className="w-3 h-3" />
                  {selectedUser.tipCount} tips
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {users.map((user) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => onUserChange(user)}
                  className="flex items-center justify-between p-3 cursor-pointer"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {user.reviewCount} reviews
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
