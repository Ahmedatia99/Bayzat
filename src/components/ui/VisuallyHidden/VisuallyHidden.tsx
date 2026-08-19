import type { ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

interface VisuallyHiddenProps {
  children: ReactNode;
  /** The HTML element to render. Defaults to 'span'. */
  as?: 'span' | 'div' | 'p';
}

/**
 * Renders content that is visually hidden but accessible to screen readers.
 * Use this for accessible labels, announcements, and supplementary text
 * that sighted users don't need to see.
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
}: VisuallyHiddenProps) {
  return <Component className={styles.visuallyHidden}>{children}</Component>;
}
