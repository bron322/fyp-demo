import React, { useState, useMemo } from 'react';
import { 
  Home, 
  ArrowRight, 
  Target, 
  Search, 
  ChevronDown, 
  ChevronRight,
  User,
  Star,
  Check
} from 'lucide-react';
import { UserProfile } from '@/data/dashboardData';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UserSelectionPanelProps {
  users: UserProfile[];
  selectedUser: UserProfile;
  onUserSelect: (user: UserProfile) => void;
}

interface MobilityCategory {
  type: 'single-hub' | 'two-hub' | 'explorer';
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

const mobilityCategories: MobilityCategory[] = [
  {
    type: 'single-hub',
    label: 'One-area Regular',
    description: 'Users with a single activity hub',
    icon: <Home className="w-4 h-4" />,
    colorClass: 'text-teal',
    bgClass: 'bg-teal/10 border-teal/20',
  },
  {
    type: 'two-hub',
    label: 'Two-area Commuter',
    description: 'Home–work pattern detected',
    icon: <ArrowRight className="w-4 h-4" />,
    colorClass: 'text-purple',
    bgClass: 'bg-purple/10 border-purple/20',
  },
  {
    type: 'explorer',
    label: 'Explorer',
    description: 'Multiple hubs, wide geographic spread',
    icon: <Target className="w-4 h-4" />,
    colorClass: 'text-orange',
    bgClass: 'bg-orange/10 border-orange/20',
  },
];

const UserSelectionPanel: React.FC<UserSelectionPanelProps> = ({
  users,
  selectedUser,
  onUserSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([selectedUser.mobilityType])
  );

  // Group users by mobility type
  const groupedUsers = useMemo(() => {
    const groups: Record<string, UserProfile[]> = {
      'single-hub': [],
      'two-hub': [],
      'explorer': [],
    };
    
    users.forEach(user => {
      groups[user.mobilityType].push(user);
    });
    
    return groups;
  }, [users]);

  // Filter users by search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    return users.filter(
      user => 
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const toggleCategory = (type: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const renderUserItem = (user: UserProfile) => {
    const isSelected = user.id === selectedUser.id;
    
    return (
      <button
        key={user.id}
        onClick={() => onUserSelect(user)}
        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
          isSelected 
            ? 'bg-primary/10 border border-primary/30 shadow-sm' 
            : 'hover:bg-secondary border border-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
          }`}>
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {user.name}
              </span>
              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">{user.id}</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {user.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="dashboard-card h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-bold text-foreground mb-1">Select User</h3>
        <p className="text-xs text-muted-foreground">
          1,680 eligible users (min_visits ≥ 5) grouped by mobility pattern
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by user ID or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      {/* Search Results or Tiered Selection */}
      <ScrollArea className="flex-1 max-h-[400px]">
        {searchResults ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {searchResults.length} results found
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map(user => renderUserItem(user))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {mobilityCategories.map(category => {
              const categoryUsers = groupedUsers[category.type];
              const isExpanded = expandedCategories.has(category.type);
              const hasSelectedUser = categoryUsers.some(u => u.id === selectedUser.id);
              
              return (
                <Collapsible
                  key={category.type}
                  open={isExpanded}
                  onOpenChange={() => toggleCategory(category.type)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className={`p-3 rounded-xl border transition-all ${category.bgClass} ${
                      hasSelectedUser ? 'ring-2 ring-primary/30' : ''
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`icon-container ${category.type === 'single-hub' ? 'teal' : category.type === 'two-hub' ? 'purple' : 'orange'}`}>
                          {category.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {category.label}
                            </span>
                            <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                              {categoryUsers.length} users
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pt-2 space-y-1 pl-2">
                      {categoryUsers.map(user => renderUserItem(user))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Representative users shown for case study analysis.
          <br />
          <span className="text-muted-foreground/70">
            All 1,680 users included in population-level metrics.
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserSelectionPanel;
