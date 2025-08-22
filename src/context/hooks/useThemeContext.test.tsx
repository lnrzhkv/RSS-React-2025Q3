import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useThemeContext } from './useThemeContext';
import { ThemeContext } from '../ThemeContext';

describe('useThemeContext hook', () => {
  const mockToggle = jest.fn();

  const TestComponent: React.FC = () => {
    const { theme, toggleTheme } = useThemeContext();
    return (
      <button data-testid="theme-btn" onClick={toggleTheme}>
        {theme}
      </button>
    );
  };

  it('throws when used outside ThemeProvider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useThemeContext must be used within a ThemeProvider'
    );
  });

  it('provides theme and toggleTheme inside ThemeProvider', () => {
    render(
      <ThemeContext.Provider
        value={{ theme: 'light', toggleTheme: mockToggle }}
      >
        <TestComponent />
      </ThemeContext.Provider>
    );

    const btn = screen.getByTestId('theme-btn');
    expect(btn).toHaveTextContent('light');

    fireEvent.click(btn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('works with a different theme', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: mockToggle }}>
        <TestComponent />
      </ThemeContext.Provider>
    );

    const btn = screen.getByTestId('theme-btn');
    expect(btn).toHaveTextContent('dark');
  });
});
