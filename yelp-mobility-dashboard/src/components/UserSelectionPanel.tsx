import React from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import { Search, User as UserIcon, MapPin, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserSelectionPanelProps {
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

const UserSelectionPanel: React.FC<UserSelectionPanelProps> = ({
  selectedUser,
  onUserSelect,
}) => {
  const handleUserChange = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      onUserSelect(user);
    }
  };

  return (
    <div className="dashboard-card">
      <h2 className="section-title flex items-center gap-2">
        <UserIcon className="h-4 w-4" />
        User Selection
      </h2>

      <div className="space-y-4">
        <div>
          <label className="data-label block mb-1.5">Select User ID</label>
          <Select
            value={selectedUser?.id || ''}
            onValueChange={handleUserChange}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Choose a user..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {mockUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {user.id}
                    </span>
                    <span className="text-sm">{user.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUser && (
          <div className="animate-fade-in space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="data-label">User Name</span>
              <span className="data-value">{selectedUser.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="data-label flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Reviews
              </span>
              <span className="data-value">{selectedUser.reviewCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="data-label flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Mobility Class
              </span>
              <span
                className={
                  selectedUser.mobilityClass === 'Local Expert'
                    ? 'local-expert-badge'
                    : 'explorer-badge'
                }
              >
                {selectedUser.mobilityClass}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="data-label">Area Ratio</span>
              <span className="data-value font-mono">
                {selectedUser.areaRatio.toFixed(2)}
              </span>
            </div>

            <div className="mt-3 p-3 rounded-md bg-secondary/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedUser.mobilityClass === 'Local Expert' ? (
                  <>
                    <strong className="text-local-expert">Local Experts</strong>{' '}
                    have a low area ratio (&lt;0.5), indicating they dine within
                    a concentrated geographic region.
                  </>
                ) : (
                  <>
                    <strong className="text-explorer">Explorers</strong> have a
                    high area ratio (≥0.5), indicating they explore diverse
                    locations across the city.
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelectionPanel;
