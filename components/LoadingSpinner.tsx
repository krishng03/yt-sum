
import React from 'react';
import { IconLoader2, IconBrain } from '@tabler/icons-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Processing your video..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 animate-pulse shadow-lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconLoader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <IconBrain className="w-6 h-6 text-pink-600" />
          <span className="text-xl font-semibold text-gray-800">
            AI is working...
          </span>
        </div>
        <p className="text-gray-600 text-lg">
          {message}
        </p>
      </div>
      
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-pink-400 animate-pulse shadow-sm"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
