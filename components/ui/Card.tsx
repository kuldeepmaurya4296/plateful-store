import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverEffect = false, className = '', ...props }) => {
  const hoverStyles = hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : '';
  return (
    <div
      className={`bg-bg-card border border-line rounded-lg p-5 shadow-sm ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
