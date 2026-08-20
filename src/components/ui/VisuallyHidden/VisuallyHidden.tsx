import type { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
  /** The HTML element to render. Defaults to 'span'. */
  as?: 'span' | 'div' | 'p';
  className?: string;
}

/**
 * Renders content that is visually hidden but accessible to screen readers.
 * Uses Tailwind's built-in sr-only utility.
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
  className = '',
}: VisuallyHiddenProps) {
  return <Component className={`sr-only ${className}`.trim()}>{children}</Component>;
}
