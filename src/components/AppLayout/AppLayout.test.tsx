import { render, screen } from '@testing-library/react';
import AppLayout from './AppLayout';
import { useThemeContext } from '../../context/hooks/useThemeContext';

jest.mock('@/components/Navigation/Navigation.tsx', () => {
  const MockNav = () => (
    <nav data-testid="mock-navigation">Mock Navigation</nav>
  );
  MockNav.displayName = 'MockNavigation';
  return MockNav;
});

jest.mock('@/context/hooks/useThemeContext.ts', () => ({
  useThemeContext: jest.fn(),
}));

describe('AppLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Navigation and children with the correct light theme class', () => {
    (useThemeContext as jest.Mock).mockReturnValue({ theme: 'light' });

    render(
      <AppLayout>
        <div data-testid="child">Test Content</div>
      </AppLayout>
    );

    const container = screen.getByTestId('layout-container');
    expect(container).toBeInTheDocument();
    expect(container.className).toMatch(/light/);

    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Test Content');
  });

  it('applies the dark theme class when theme is dark', () => {
    (useThemeContext as jest.Mock).mockReturnValue({ theme: 'dark' });

    render(
      <AppLayout>
        <span>Dark Mode</span>
      </AppLayout>
    );

    const container = screen.getByTestId('layout-container');
    expect(container.className).toMatch(/dark/);
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('renders the content slot with the provided children', () => {
    (useThemeContext as jest.Mock).mockReturnValue({ theme: 'light' });

    render(
      <AppLayout>
        <p>Inside Content Slot</p>
      </AppLayout>
    );

    expect(screen.getByTestId('content-slot')).toContainElement(
      screen.getByText('Inside Content Slot')
    );
  });
});
