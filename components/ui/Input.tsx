'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const currentType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            type={currentType}
            className={`w-full border border-line rounded-md px-3.5 py-2 text-sm bg-bg-card text-ink transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft ${
              isPasswordField ? 'pr-10' : ''
            } ${error ? 'border-danger focus:border-danger focus:ring-danger-bg' : ''} ${className}`}
            {...props}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-ink-soft hover:text-ink transition-colors p-0.5 rounded cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-ink-soft" />
              )}
            </button>
          )}
        </div>
        {error && (
          <span className="text-xs text-danger font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
