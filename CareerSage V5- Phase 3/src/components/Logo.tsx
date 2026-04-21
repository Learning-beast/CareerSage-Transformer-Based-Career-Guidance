import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'light',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const gradient = variant === 'light' 
    ? 'from-indigo-600 to-purple-600' 
    : 'from-white to-indigo-100';

  const textColor = variant === 'light' 
    ? 'text-gray-900' 
    : 'text-white';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
        <svg 
          className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${textSizes[size]} ${textColor} leading-none`}>
          CareerSage
        </span>
        <span className={`text-xs ${variant === 'light' ? 'text-gray-500' : 'text-indigo-200'} font-medium mt-0.5`}>
          AI Career Platform
        </span>
      </div>
    </div>
  );
};

export default Logo;
