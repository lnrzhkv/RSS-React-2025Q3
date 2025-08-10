import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import { ThemeProvider } from '../../context/ThemeContext';
import * as useThemeContext from '../../context/hooks/useThemeContext';

jest.mock('../../components/Navigation/Navigation', () => ({
  __esModule: true,
  default: () => <nav data-testid="mocked-navigation">Mock Navigation</nav>,
}));

jest.mock('../../context/hooks/useThemeContext', () => ({
  useThemeContext: jest.fn(),
}));

describe('AppLayout Component', () => {
  beforeEach(() => {
    (useThemeContext.useThemeContext as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
    });
  });

  it('applies theme classes when theme changes', () => {
    (useThemeContext.useThemeContext as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: jest.fn(),
    });

    const { rerender } = render(
      <MemoryRouter>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </MemoryRouter>
    );

    const container = screen.getByTestId('layout-container');
    expect(container).toHaveClass('dark');

    (useThemeContext.useThemeContext as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
    });

    rerender(
      <MemoryRouter>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(container).toHaveClass('light');
    expect(container).not.toHaveClass('dark');
  });
});
