import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AboutPage from './AboutPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('AboutPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('About Pokémon Search')).toBeInTheDocument();
    expect(
      screen.getByText('This application was developed by')
    ).toBeInTheDocument();
    expect(
      screen.getByText('As part of the RS School React 2025 course')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'RS School React' })
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(
      screen.getByRole('button', { name: 'Back to main page' })
    ).toBeInTheDocument();
  });

  it('navigates to saved page when back button is clicked', () => {
    window.sessionStorage.setItem('pokemonListPage', '3');

    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to main page' }));
    expect(mockNavigate).toHaveBeenCalledWith('/?page=3');
  });

  it('navigates to page 1 when no saved page exists', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to main page' }));
    expect(mockNavigate).toHaveBeenCalledWith('/?page=1');
  });

  it('contains correct developer link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    const developerLink = screen.getByRole('link', { name: 'me' });
    expect(developerLink).toHaveAttribute('href', 'https://github.com/lnrzhkv');
  });
});
