import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
    
    const variants = {
      primary: 'bg-primary text-bg hover:bg-primary-hover focus:ring-primary',
      secondary: 'bg-secondary text-bg hover:opacity-90 focus:ring-secondary',
      outline: 'border border-line text-ink hover:bg-bg-alt focus:ring-primary-soft',
      danger: 'bg-danger text-bg hover:opacity-90 focus:ring-danger',
      ghost: 'text-ink-soft hover:text-ink hover:bg-bg-alt focus:ring-line'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base'
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
