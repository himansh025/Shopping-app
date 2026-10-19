/* eslint-disable react/prop-types */
import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';

/**
 * Accessible Checkbox component
 */
export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    description,
    error,
    id: externalId,
    disabled = false,
    checked,
    defaultChecked,
    onChange,
    className = '',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const checkboxId = externalId || generatedId;

  return (
    <div className={`relative flex items-start gap-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={`
            h-4.5 w-4.5 rounded border flex items-center justify-center transition-all duration-150 cursor-pointer select-none
            peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2
            peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white
            ${
              error
                ? 'border-rose-400 bg-white'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }
            ${
              disabled
                ? 'cursor-not-allowed opacity-50 bg-slate-100 peer-checked:bg-slate-400'
                : ''
            }
          `.trim()}
        >
          <Check className="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
        </label>
      </div>

      {(label || description) && (
        <div className="text-sm">
          {label && (
            <label
              htmlFor={checkboxId}
              className={`font-medium cursor-pointer select-none ${
                disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-800'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
          {error && (
            <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
