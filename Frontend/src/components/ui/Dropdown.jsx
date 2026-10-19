/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';

const DropdownContext = createContext(null);

/**
 * Accessible Dropdown container component
 */
export function Dropdown({
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  className = '',
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const dropdownRef = useRef(null);

  const setIsOpen = useCallback(
    (next) => {
      if (!isControlled) setInternalIsOpen(next);
      if (onOpenChange) onOpenChange(next);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children, className = '' }) {
  const { isOpen, setIsOpen } = useContext(DropdownContext);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={isOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
      }}
      className={`cursor-pointer inline-flex items-center focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenu({
  children,
  align = 'right',
  width = 'w-56',
  className = '',
}) {
  const { isOpen } = useContext(DropdownContext);

  if (!isOpen) return null;

  const alignClasses = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
    center: 'left-1/2 -translate-x-1/2 origin-top',
  };

  return (
    <div
      role="menu"
      tabIndex={-1}
      className={`
        absolute mt-2 z-50 ${width} rounded-xl bg-white p-1.5 shadow-lg border border-slate-200/80
        focus:outline-none transition duration-150 ease-out
        ${alignClasses[align] || alignClasses.right}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  icon,
  destructive = false,
  disabled = false,
  className = '',
}) {
  const { setIsOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
    setIsOpen(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left select-none transition-colors
        focus:outline-none focus:bg-slate-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          destructive
            ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }
        ${className}
      `.trim()}
    >
      {icon && <span className="w-4 h-4 shrink-0 text-slate-400">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

export function DropdownSeparator({ className = '' }) {
  return <div role="separator" className={`my-1 border-t border-slate-100 ${className}`} />;
}

export function DropdownLabel({ children, className = '' }) {
  return (
    <div className={`px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}

export default Dropdown;
