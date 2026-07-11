import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`border border-line rounded-md px-3.5 py-2 text-sm bg-bg-card text-ink transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft ${
            error ? 'border-danger focus:border-danger focus:ring-danger-bg' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
