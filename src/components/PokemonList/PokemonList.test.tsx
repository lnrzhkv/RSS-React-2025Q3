import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokemonList from './PokemonList';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';

jest.mock('../../context/hooks/useGlobalContext');
const mockPagination = {
  currentPage: '1',
  totalPages: 2,
  hasPrev: false,
  hasNext: true,
  onPreviousPage: jest.fn(),
  onNextPage: jest.fn(),
  onPageChange: jest.fn(),
};

describe('PokemonList', () => {
  beforeEach(() => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      pagination: mockPagination,
      fetchPokemons: jest.fn(),
      characters: [
        {
          id: 1,
          name: 'Pikachu',
          height: 4,
          weight: 60,
          image: 'pikachu.png',
          types: [],
        },
        {
          id: 2,
          name: 'Bulbasaur',
          height: 7,
          weight: 69,
          image: 'bulbasaur.png',
          types: [],
        },
      ],
      error: null,
      isNotFound: false,
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

    expect(screen.getAllByTestId('pagination').length).toBe(2);
    expect(screen.getAllByTestId('pagination-prev').length).toBe(2);
    expect(screen.getAllByTestId('pagination-next').length).toBe(2);
    expect(screen.getAllByTestId('pagination-page-1').length).toBe(2);
    expect(screen.getAllByTestId('pagination-page-2').length).toBe(2);

    expect(screen.getByTestId('error-button')).toBeInTheDocument();

    expect(screen.getByTestId('details-close')).toBeInTheDocument();
    expect(screen.getByTestId('details-name')).toBeInTheDocument();
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
  });

  it('renders loader when loading', () => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      ...useGlobalContext(),
      loading: true,
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

  it('renders no results when isNotFound is true', () => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      ...useGlobalContext(),
      isNotFound: true,
    });
    render(
      <MemoryRouter>
        <PokemonList />
      </MemoryRouter>
    );
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
  });
});
