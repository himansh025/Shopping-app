/* eslint-disable react/prop-types */
import { forwardRef, useId } from 'react';

/**
 * Accessible Input component supporting icons, labels, validation errors, and helper text
 */
export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    id: externalId,
    type = 'text',
    size = 'md',
    leftIcon,
    rightIcon,
    disabled = false,
    required = false,
    fullWidth = true,
    className = '',
    inputClassName = '',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-xs rounded-md',
    md: 'h-10 px-3.5 text-sm rounded-lg',
    lg: 'h-12 px-4 text-base rounded-lg',
  };

  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {hasLeftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`
            w-full bg-white text-slate-900 placeholder:text-slate-400
            border transition duration-150 ease-in-out
            focus:outline-none focus:ring-3
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed
            ${sizeClasses[size] || sizeClasses.md}
            ${hasLeftIcon ? 'pl-9' : ''}
            ${hasRightIcon ? 'pr-9' : ''}
            ${
              error
                ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20 text-rose-900'
                : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-500/20 shadow-xs'
            }
            ${inputClassName}
          `.trim()}
          {...props}
        />

        {hasRightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-rose-600 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
