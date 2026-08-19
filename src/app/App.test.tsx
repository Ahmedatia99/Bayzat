import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AppProviders } from './AppProviders';
import { App } from './App';

/**
 * Renders the App within its providers for testing.
 */
function renderApp() {
  return render(
    <AppProviders>
      <App />
    </AppProviders>,
  );
}

describe('Application Shell', () => {
  it('renders the page heading', () => {
    renderApp();

    expect(
      screen.getByRole('heading', { name: /shift handover board/i }),
    ).toBeInTheDocument();
  });

  it('contains a main landmark', () => {
    renderApp();

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('contains a banner landmark (header)', () => {
    renderApp();

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the "Create handover" button', () => {
    renderApp();

    const button = screen.getByRole('button', {
      name: /create.*handover/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('"Create handover" button is keyboard-focusable', async () => {
    const user = userEvent.setup();
    renderApp();

    const button = screen.getByRole('button', {
      name: /create.*handover/i,
    });

    // Tab until the button receives focus
    await user.tab();
    // The button may not be the first focusable element, so keep tabbing
    let maxTabs = 10;
    while (document.activeElement !== button && maxTabs > 0) {
      await user.tab();
      maxTabs--;
    }

    expect(button).toHaveFocus();
  });

  it('renders without crashing', () => {
    expect(() => renderApp()).not.toThrow();
  });
});
