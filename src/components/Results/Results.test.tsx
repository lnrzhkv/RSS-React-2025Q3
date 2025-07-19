import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Results from './Results';
import {
  SearchContext,
  type SearchContextProps,
} from '../../context/SearchContext';
import type { Character } from '../../services/api/types';

const mockContext: SearchContextProps = {
  searchTerm: '',
  setSearchTerm: jest.fn(),
  characters: [],
  loading: false,
  error: null,
  fetchData: jest.fn(),
};

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Pikachu',
    height: 40,
    weight: 6,
    types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  },
  {
    id: 2,
    name: 'Charmander',
    height: 60,
    weight: 8,
    types: [{ slot: 1, type: { name: 'fire', url: '' } }],
  },
];

describe('Results Component', () => {
  const renderWithContext = (override: Partial<SearchContextProps> = {}) => {
    const contextValue = { ...mockContext, ...override };

    return render(
      <SearchContext.Provider value={contextValue}>
        <Results />
      </SearchContext.Provider>
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
