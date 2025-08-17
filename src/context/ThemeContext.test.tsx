import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContext, ThemeProvider } from './ThemeContext';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('ThemeProvider', () => {
  const TestComponent = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) return null;
    const { theme, toggleTheme } = ctx;

    return React.createElement(
      'div',
      null,
      React.createElement('span', { 'data-testid': 'theme-value' }, theme),
      React.createElement(
        'button',
        { 'data-testid': 'toggle-btn', onClick: toggleTheme },
        'Toggle'
      )
    );
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('defaults to light when no saved theme and system does not prefer dark', async () => {
    mockMatchMedia(false);
    render(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(TestComponent)
      )
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('defaults to dark when no saved theme and system prefers dark', () => {
    mockMatchMedia(true);

    render(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(TestComponent)
      )
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('reads saved theme from localStorage over system preference', () => {
    localStorage.setItem('theme', 'dark');
    mockMatchMedia(false);

    render(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(TestComponent)
      )
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('toggleTheme switches theme, updates DOM attribute and localStorage', () => {
    mockMatchMedia(false);
    render(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(TestComponent)
      )
    );

    const btn = screen.getByTestId('toggle-btn');
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');

    fireEvent.click(btn);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(btn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
