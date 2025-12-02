import React from 'react';

interface EffortChipProps {
  level: 'low' | 'medium' | 'high';
}

const EffortChip: React.FC<EffortChipProps> = ({ level }) => {
  const getLevelText = () => {
    switch (level) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return level;
    }
  };

  const getColorClasses = () => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getColorClasses()}`}>
      {getLevelText()}
    </span>
  );
};

export default EffortChip;
