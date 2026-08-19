import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composes all application-level providers.
 * New providers (Toast, Handover context, etc.) will be added here in later phases.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
