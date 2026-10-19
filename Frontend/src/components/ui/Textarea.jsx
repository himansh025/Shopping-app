/* eslint-disable react/prop-types */
import { forwardRef, useId } from 'react';

/**
 * Accessible Textarea component
 */
export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id: externalId,
    rows = 4,
    disabled = false,
    required = false,
    fullWidth = true,
    className = '',
    textareaClassName = '',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const textareaId = externalId || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={`
          w-full bg-white text-slate-900 placeholder:text-slate-400 p-3 text-sm rounded-lg
          border transition duration-150 ease-in-out
          focus:outline-none focus:ring-3
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed
          ${
            error
              ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20 text-rose-900'
              : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-500/20 shadow-xs'
          }
          ${textareaClassName}
        `.trim()}
        {...props}
      />

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

Textarea.displayName = 'Textarea';
export default Textarea;
