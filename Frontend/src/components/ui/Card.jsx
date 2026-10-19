/* eslint-disable react/prop-types */
import { forwardRef } from 'react';

/**
 * Reusable Card surface primitive
 */
export const Card = forwardRef(function Card(
  {
    children,
    hoverable = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-xl border border-slate-200/80 shadow-xs
        ${hoverable ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300/80' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef(function CardHeader(
  { children, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`p-5 md:p-6 pb-3 flex flex-col space-y-1.5 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(function CardTitle(
  { children, className = '', as: Component = 'h3', ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`text-lg font-semibold text-slate-900 tracking-tight leading-none ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef(function CardDescription(
  { children, className = '', ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={`text-sm text-slate-500 leading-relaxed ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef(function CardContent(
  { children, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`p-5 md:p-6 pt-0 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(function CardFooter(
  { children, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`p-5 md:p-6 pt-0 flex items-center gap-3 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export default Card;
