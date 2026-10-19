/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Accessible Modal / Dialog primitive
 */
export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
}) {
  const dialogRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
  };

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the dialog
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement.current && previouslyFocusedElement.current.focus) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`
          relative w-full bg-white rounded-2xl shadow-xl border border-slate-200/80
          overflow-hidden z-10 transition-all duration-200 my-8 focus:outline-none
          ${sizeClasses[size] || sizeClasses.md}
          ${className}
        `.trim()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ModalHeader({ children, className = '' }) {
  return (
    <div className={`p-6 pb-2 pr-12 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function ModalTitle({ children, className = '' }) {
  return (
    <h2 className={`text-xl font-semibold text-slate-900 tracking-tight ${className}`.trim()}>
      {children}
    </h2>
  );
}

export function ModalDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-slate-500 mt-1 leading-relaxed ${className}`.trim()}>
      {children}
    </p>
  );
}

export function ModalBody({ children, className = '' }) {
  return (
    <div className={`p-6 max-h-[70vh] overflow-y-auto ${className}`.trim()}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`p-6 pt-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Modal;
