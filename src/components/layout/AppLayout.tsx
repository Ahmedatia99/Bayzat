import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Application shell providing the header and main content area.
 * Uses semantic <main> landmark for accessibility.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
