import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';
import { GlobalContext } from '../../context/GlobalContext';

const mockContext = {
  onChangeSearchValue: jest.fn(),
  fetchPokemons: jest.fn(),
  searchValue: '',
  characters: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: '1',
    totalPages: 1,
    setPage: jest.fn(),
    hasNext: false,
    hasPrev: false,
    onPreviousPage: jest.fn(),
    onNextPage: jest.fn(),
    onPageChange: jest.fn(),
  },
  theme: 'light' as const,
  toggleTheme: jest.fn(),
  fetchCharacterBySearch: jest.fn(),
  setIsDetailsOpen: jest.fn(),
  isDetailsOpen: false,
};

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to} data-testid={`link-${to}`}>
        {children}
      </a>
    ),
  };
});

describe('Navigation Component', () => {
  it('renders navigation component', () => {
    render(
      <Router>
        <GlobalContext.Provider value={mockContext}>
          <Navigation />
        </GlobalContext.Provider>
      </Router>
    );

    const navElement = screen.getByTestId('nav');
    expect(navElement).toBeInTheDocument();
  });

  it('contains correct navigation links', () => {
    render(
      <Router>
        <GlobalContext.Provider value={mockContext}>
          <Navigation />
        </GlobalContext.Provider>
      </Router>
    );

    const homeLink = screen.getByTestId('nav-item-home');
    const aboutLink = screen.getByTestId('nav-item-about');

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent('Home');

    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveTextContent('About');
  });

  it('applies correct CSS classes', () => {
    render(
      <Router>
        <GlobalContext.Provider value={mockContext}>
          <Navigation />
        </GlobalContext.Provider>
      </Router>
    );

    const navElement = screen.getByTestId('nav');
    const homeLink = screen.getByTestId('nav-item-home');
    const aboutLink = screen.getByTestId('nav-item-about');

    expect(navElement).toHaveClass('nav');
    expect(homeLink).toHaveClass('navLink');
    expect(aboutLink).toHaveClass('navLink');
  });
});
