/* eslint-disable react/prop-types */
/**
 * Accessible status & metadata Badge component
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-700 border-blue-200/80',
    primary: 'bg-blue-50 text-blue-700 border-blue-200/80',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    destructive: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    outline: 'border-slate-300 text-slate-700 bg-transparent',
  };

  const dotClasses = {
    default: 'bg-blue-500',
    primary: 'bg-blue-500',
    secondary: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    destructive: 'bg-rose-500',
    info: 'bg-sky-500',
    outline: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border tracking-wide select-none
        ${variantClasses[variant] || variantClasses.default}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `.trim()}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClasses[variant] || dotClasses.default}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
