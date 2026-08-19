import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button. */
  variant?: ButtonVariant;
  /** Size of the button. */
  size?: ButtonSize;
  /** Show a loading spinner and disable interaction. */
  loading?: boolean;
  /** Accessible loading text for screen readers. */
  loadingText?: string;
  children: ReactNode;
}

/**
 * Accessible button primitive with variant, size, and loading state support.
 * Uses native <button> element for built-in keyboard and assistive technology support.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading…',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    loading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <span className={styles.spinnerIcon} />
        </span>
      )}
      {loading && <VisuallyHidden>{loadingText}</VisuallyHidden>}
    </button>
  );
}
