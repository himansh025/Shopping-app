/* eslint-disable react/prop-types */
import { forwardRef, useId } from 'react';

/**
 * Accessible Radio component
 */
export const Radio = forwardRef(function Radio(
  {
    label,
    description,
    error,
    id: externalId,
    name,
    value,
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
  const radioId = externalId || generatedId;

  return (
    <div className={`relative flex items-start gap-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          name={name}
          value={value}
          disabled={disabled}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={radioId}
          className={`
            h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer select-none
            peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2
            peer-checked:border-blue-600
            ${
              error
                ? 'border-rose-400 bg-white'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }
            ${
              disabled
                ? 'cursor-not-allowed opacity-50 bg-slate-100'
                : ''
            }
          `.trim()}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
        </label>
      </div>

      {(label || description) && (
        <div className="text-sm">
          {label && (
            <label
              htmlFor={radioId}
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
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';
export default Radio;
