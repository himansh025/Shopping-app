/* eslint-disable react/prop-types */
/**
 * Reusable Skeleton loader primitive
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  ...props
}) {
  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`
        animate-pulse bg-slate-200/80
        ${variantClasses[variant] || variantClasses.text}
        ${className}
      `.trim()}
      {...props}
    />
  );
}

/**
 * Product Card Skeleton helper for catalog & homepage
 */
export function ProductCardSkeleton({ className = '' }) {
  return (
    <div className={`p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col space-y-3 ${className}`}>
      <Skeleton variant="rectangular" className="w-full h-48 rounded-lg" />
      <div className="space-y-2 pt-1">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <Skeleton variant="text" className="w-1/3 h-5 font-bold" />
      </div>
      <Skeleton variant="rectangular" className="w-full h-10 mt-auto rounded-lg" />
    </div>
  );
}

export default Skeleton;
