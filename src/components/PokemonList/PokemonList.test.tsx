import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokemonList from './PokemonList';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';

jest.mock('../../context/hooks/useGlobalContext');
jest.mock('../Pagination/Pagination', () => {
  const MockPagination = () => (
    <div data-testid="pagination">
      <button data-testid="pagination-prev">Prev</button>
      <button data-testid="pagination-next">Next</button>
      <button data-testid="pagination-page-1">1</button>
      <button data-testid="pagination-page-2">2</button>
    </div>
  );
  MockPagination.displayName = 'MockPagination';
  return MockPagination;
});
const mockPagination = {
  totalPages: 2,
  currentPage: 1,
  hasNext: true,
  hasPrev: false,
  onPreviousPage: jest.fn(),
  onNextPage: jest.fn(),
  onPageChange: jest.fn(),
};

describe('PokemonList', () => {
  beforeEach(() => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      pagination: mockPagination,
      fetchPokemons: jest.fn(),
      characters: Array(10)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          name: `Pikachu ${index + 1}`,
          height: 4,
          weight: 60,
          image: 'pikachu.png',
          types: [],
        })),
      error: null,
      loading: false,
      setIsDetailsOpen: jest.fn(),
      isDetailsOpen: true,
      searchValue: '',
      onChangeSearchValue: jest.fn(),
      fetchCharacterBySearch: jest.fn(),
    });
  });

  it('renders all main blocks and testids', () => {
    render(
      <MemoryRouter>
        <PokemonList />
      </MemoryRouter>
    );

    expect(screen.getByTestId('pokemonlist-content')).toBeInTheDocument();
    expect(screen.getByTestId('pokemonlist-listcontainer')).toBeInTheDocument();
    expect(screen.getByTestId('pokemonlist-topsection')).toBeInTheDocument();
    expect(screen.getByTestId('app-main-title')).toBeInTheDocument();
    expect(screen.getByTestId('pokemonlist-footer')).toBeInTheDocument();

    const boxes = screen.getAllByTestId('box');
    expect(boxes.length).toBe(3);

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();

    expect(screen.getByTestId('app-results-title')).toBeInTheDocument();
    expect(screen.getByTestId('results-container')).toBeInTheDocument();
    expect(screen.getByTestId('character-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('character-card-2')).toBeInTheDocument();

    if (mockPagination.totalPages > 1) {
      expect(screen.getAllByTestId('pagination').length).toBe(2);
      expect(screen.getAllByTestId('pagination-prev').length).toBe(2);
      expect(screen.getAllByTestId('pagination-next').length).toBe(2);
      expect(screen.getAllByTestId('pagination-page-1').length).toBe(2);
      expect(screen.getAllByTestId('pagination-page-2').length).toBe(2);
    }

    expect(screen.getByTestId('error-button')).toBeInTheDocument();

    expect(screen.getByTestId('details-close')).toBeInTheDocument();
    expect(screen.getByTestId('details-name')).toBeInTheDocument();
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
  });

  it('renders loader when loading', () => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      ...useGlobalContext(),
      loading: true,
      characters: [],
    });
    render(
      <MemoryRouter>
        <PokemonList />
      </MemoryRouter>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error when error exists', () => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      ...useGlobalContext(),
      error: 'Some error',
    });
    render(
      <MemoryRouter>
        <PokemonList />
      </MemoryRouter>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Some error')).toBeInTheDocument();
  });

  it('renders no results when characters is empty', () => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      ...useGlobalContext(),
      characters: [],
    });
    render(
      <MemoryRouter>
        <PokemonList />
      </MemoryRouter>
    );
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
  });
});
