import { AppLayout } from '../components/layout/AppLayout';

/**
 * Root application component.
 * Feature components (board, filters, form) are added in later phases.
 */
export function App() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <span className="text-5xl opacity-30" aria-hidden="true">
          📋
        </span>
        <p className="text-xl font-semibold text-foreground">
          Handover board coming soon
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          The board, filters, and create form will be implemented in the next
          phases. The application shell and design foundation are ready.
        </p>
      </div>
    </AppLayout>
  );
}
