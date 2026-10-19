/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import Spinner from './Spinner';

/**
 * Modern, accessible Button component
 */
export const Button = forwardRef(function Button(
  {
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm border border-transparent shadow-blue-600/10',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80',
    outline:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 shadow-xs',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200',
    destructive:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm border border-transparent shadow-rose-600/10',
    link:
      'bg-transparent text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline p-0 h-auto active:scale-100 shadow-none',
  };

  const sizeClasses = {
    xs: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
    sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
    md: 'h-10 px-4 text-sm rounded-lg gap-2',
    lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
    icon: 'h-10 w-10 p-0 rounded-lg',
    'icon-sm': 'h-8 w-8 p-0 rounded-md',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${
        sizeClasses[size] || sizeClasses.md
      } ${widthClass} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner
            size={size === 'lg' ? 'md' : 'sm'}
            variant={variant === 'primary' || variant === 'destructive' ? 'white' : 'current'}
            className={loadingText || children ? 'mr-2' : ''}
          />
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
