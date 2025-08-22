import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';
import * as reactRouterDom from 'react-router-dom';
import * as themeHook from '../../context/hooks/useThemeContext';

const mockNavigate = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../context/hooks/useThemeContext', () => ({
  useThemeContext: jest.fn(),
}));

describe('Navigation', () => {
  beforeAll(() => {
    (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Home, About and light-mode icon; navigates and toggles theme', () => {
    (themeHook.useThemeContext as jest.Mock).mockReturnValue({
      toggleTheme: mockToggleTheme,
      theme: 'light',
    });

    render(<Navigation />);

    const nav = screen.getByTestId('nav');
    expect(nav).toBeInTheDocument();

    const home = screen.getByTestId('nav-item-home');
    const about = screen.getByTestId('nav-item-about');
    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });

    expect(home).toHaveTextContent('Home');
    expect(about).toHaveTextContent('About');
    expect(toggleBtn).toHaveTextContent('☾');

    fireEvent.click(home);
    expect(mockNavigate).toHaveBeenCalledWith('/');

    fireEvent.click(about);
    expect(mockNavigate).toHaveBeenCalledWith('/about');

    fireEvent.click(toggleBtn);
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('shows sun icon when theme is dark', () => {
    (themeHook.useThemeContext as jest.Mock).mockReturnValue({
      toggleTheme: mockToggleTheme,
      theme: 'dark',
    });

    render(<Navigation />);

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleBtn).toHaveTextContent('☀︎');
  });
});
