import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  /** Called when the user clicks "Create handover". Wired up in a later phase. */
  onCreateClick?: () => void;
}

/**
 * Application header with branding and primary action.
 * Refactored to Tailwind CSS and shadcn Button primitive.
 */
export function AppHeader({ onCreateClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 shadow-xs md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-purple-600 text-xs font-bold text-primary-foreground"
          aria-hidden="true"
        >
          SH
        </div>
        <h1 className="text-base font-semibold text-foreground sm:text-lg">
          Shift Handover Board
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="default"
          onClick={onCreateClick}
          aria-label="Create a new handover item"
        >
          + Create handover
        </Button>
      </div>
    </header>
  );
}
