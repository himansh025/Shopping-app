/* eslint-disable react/prop-types */
/**
 * Predictable responsive page container for standardizing content width and padding
 */
export function PageContainer({
  children,
  size = 'default',
  fullWidth = false,
  className = '',
  ...props
}) {
  if (fullWidth) {
    return (
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    );
  }

  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-screen-2xl',
  };

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size] || sizeClasses.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default PageContainer;
