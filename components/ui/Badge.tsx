import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full tracking-wide';
  
  const variants = {
    primary: 'bg-primary-soft text-primary border border-primary/20',
    secondary: 'bg-secondary-soft text-secondary border border-secondary/20',
    success: 'bg-success-bg text-success border border-success/20',
    danger: 'bg-danger-bg text-danger border border-danger/20',
    warning: 'bg-warning-bg text-warning border border-warning/20',
    info: 'bg-info-bg text-info border border-info/20',
    neutral: 'bg-bg-alt text-ink-soft border border-line'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] uppercase font-bold',
    md: 'px-2.5 py-0.75 text-xs font-semibold'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};

