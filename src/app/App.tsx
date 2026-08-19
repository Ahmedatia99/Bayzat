import { AppLayout } from '../components/layout/AppLayout';
import styles from './App.module.css';

/**
 * Root application component.
 * Feature components (board, filters, form) are added in later phases.
 */
export function App() {
  return (
    <AppLayout>
      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon} aria-hidden="true">
          📋
        </span>
        <p className={styles.placeholderTitle}>Handover board coming soon</p>
        <p className={styles.placeholderText}>
          The board, filters, and create form will be implemented in the next
          phases. The application shell and design foundation are ready.
        </p>
      </div>
    </AppLayout>
  );
}
