import React from 'react';
import { MapPin, Compass } from 'lucide-react';

interface TravelModeToggleProps {
  value: 'local' | 'explorer';
  onChange: (value: 'local' | 'explorer') => void;
}

const TravelModeToggle: React.FC<TravelModeToggleProps> = ({
  value,
  onChange,
}) => {
  const options: Array<{ id: 'local' | 'explorer'; label: string; icon: React.ReactNode; caption: string }> = [
    {
      id: 'local',
      label: 'Local',
      icon: <MapPin className="w-3.5 h-3.5" />,
      caption: 'Nearby options only',
    },
    {
      id: 'explorer',
      label: 'Explorer',
      icon: <Compass className="w-3.5 h-3.5" />,
      caption: 'Wider area suggestions',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Segmented Control Container */}
      <div className="inline-flex gap-1 rounded-full p-1" style={{ background: 'hsl(0 0% 95%)' }}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ease-out text-xs font-medium whitespace-nowrap ${
              value === option.id
                ? 'text-white'
                : 'text-purple-600 border border-purple-200'
            }`}
            style={
              value === option.id
                ? {
                    background:
                      'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))',
                    boxShadow: '0 2px 8px hsl(270 70% 55% / 0.25)',
                    transform: 'scale(1)',
                  }
                : {
                    background: 'white',
                    transform: 'scale(0.98)',
                  }
            }
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {/* Helper Caption */}
      <p className="text-xs text-gray-500" style={{ color: 'hsl(0 0% 65%)' }}>
        {value === 'local' ? options[0].caption : options[1].caption}
      </p>
    </div>
  );
};

export default TravelModeToggle;
