/* eslint-disable react/prop-types */
/**
 * Reusable EmptyState primitive
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-8 md:p-12
        rounded-2xl border border-dashed border-slate-200 bg-white/50 max-w-md mx-auto
        ${className}
      `.trim()}
      {...props}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
