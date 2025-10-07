
import React from 'react';

interface ApiKeyStatusProps {
  isAvailable: boolean;
}

const ApiKeyStatus: React.FC<ApiKeyStatusProps> = ({ isAvailable }) => {
  const statusClasses = isAvailable 
    ? 'bg-green-200 text-green-800' 
    : 'bg-yellow-200 text-yellow-800';
  
  const text = isAvailable ? 'AI Features: Active' : 'AI Features: Disabled (Using Fallbacks)';

  return (
    <div className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses}`}>
      {text}
    </div>
  );
};

export default ApiKeyStatus;
