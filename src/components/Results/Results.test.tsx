import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Results from './Results';
import { GlobalContext, type ContextProps } from '../../context/GlobalContext';
import type { CharacterWithImage } from '../../services/api/types';
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
  isNotFound: false,
  pagination: {
    onPageChange: jest.fn(),
    currentPage: '1',
    hasNext: false,
    hasPrev: false,
    onPreviousPage: jest.fn(),
    onNextPage: jest.fn(),
    totalPages: 1,
  },
} satisfies ContextProps;

const mockCharacters: CharacterWithImage[] = [
  {
    id: 1,
    name: 'Pikachu',
    height: 40,
    weight: 6,
    types: [{ slot: 1, type: { name: 'electric', url: '' } }],
    image: 'pikachu.png',
  },
  {
    id: 2,
    name: 'Charmander',
    height: 60,
    weight: 8,
    types: [{ slot: 1, type: { name: 'fire', url: '' } }],
    image: 'pikachu.png',
  },
];

describe('Results Component', () => {
  const renderWithContext = (override: Partial<ContextProps> = {}) => {
    const contextValue = { ...mockContext, ...override };

    return render(
      <BrowserRouter>
        <GlobalContext.Provider value={contextValue}>
          <Results />
        </GlobalContext.Provider>
      </BrowserRouter>
    );
  };

  test('shows loading state', () => {
    renderWithContext({ loading: true });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('displays error message when API call fails', () => {
    const errorMessage = 'Failed to fetch data';
    renderWithContext({ error: errorMessage });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('shows no results message when data is empty', () => {
    renderWithContext({ characters: [] });
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
  });

  test('renders list of characters when data is provided', () => {
    renderWithContext({ characters: mockCharacters });

    expect(screen.getByTestId('character-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('character-card-2')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });
});
