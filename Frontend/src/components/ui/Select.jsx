/* eslint-disable react/prop-types */
import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accessible styled Select component
 */
export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    id: externalId,
    size = 'md',
    options = [],
    placeholder,
    children,
    disabled = false,
    required = false,
    fullWidth = true,
    className = '',
    selectClassName = '',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = externalId || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const sizeClasses = {
    sm: 'h-8 px-2.5 pr-8 text-xs rounded-md',
    md: 'h-10 px-3.5 pr-10 text-sm rounded-lg',
    lg: 'h-12 px-4 pr-12 text-base rounded-lg',
  };

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`
            w-full bg-white text-slate-900 appearance-none
            border transition duration-150 ease-in-out cursor-pointer
            focus:outline-none focus:ring-3
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed
            ${sizeClasses[size] || sizeClasses.md}
            ${
              error
                ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20 text-rose-900'
                : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-500/20 shadow-xs'
            }
            ${selectClassName}
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
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

Select.displayName = 'Select';
export default Select;
