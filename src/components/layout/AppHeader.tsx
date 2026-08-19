import { Button } from '../ui/Button/Button';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  /** Called when the user clicks "Create handover". Wired up in a later phase. */
  onCreateClick?: () => void;
}

/**
 * Application header with branding and primary action.
 * The "Create handover" button is a placeholder — the form is implemented in Phase 3.
 */
export function AppHeader({ onCreateClick }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <div className={styles.logo} aria-hidden="true">
          SH
        </div>
        <h1 className={styles.title}>Shift Handover Board</h1>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          onClick={onCreateClick}
          aria-label="Create a new handover item"
        >
          + Create handover
        </Button>
      </div>
    </header>
  );
}
