import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Results from './Results';
import { GlobalContext } from '../../context/GlobalContext';
import type { ContextProps } from '../../context/GlobalContext';
import { BrowserRouter } from 'react-router-dom';

const mockContext = {
  searchValue: '',
  onChangeSearchValue: jest.fn(),
  characters: [],
  loading: false,
  error: null,
  fetchPokemons: jest.fn(),
  fetchCharacterBySearch: jest.fn(),
  isDetailsOpen: false,
  setIsDetailsOpen: jest.fn(),
  pagination: {
    onPageChange: jest.fn(),
    currentPage: '1',
    hasNext: false,
    hasPrev: false,
    onPreviousPage: jest.fn(),
    onNextPage: jest.fn(),
    totalPages: 1,
  },
  theme: 'light' as const,
  toggleTheme: jest.fn(),
} satisfies ContextProps;

describe('Results Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loader when loading', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider value={{ ...mockContext, loading: true }}>
          <Results />
        </GlobalContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('renders error when error exists', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider value={{ ...mockContext, error: 'Test error' }}>
          <Results />
        </GlobalContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  test('renders no results message when characters empty', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider value={{ ...mockContext, characters: [] }}>
          <Results />
        </GlobalContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
  });
});
