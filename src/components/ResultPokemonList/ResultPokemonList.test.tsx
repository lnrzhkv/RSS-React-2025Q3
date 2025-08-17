import { render, screen, fireEvent } from '@testing-library/react';
import ResultPokemonList from './ResultPokemonList';
import { useRouter } from '../../shared/lib/navigation';
import { useSearchParams } from 'next/navigation.js';
import { usePagination } from '../../context/hooks/usePagination';
import { useGetPokemonsQuery } from '../../shared/api/apiSlice';

jest.mock('@/shared/lib/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/navigation.js', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('@/context/hooks/usePagination', () => ({
  usePagination: jest.fn(),
}));

jest.mock('@/shared/api/apiSlice', () => ({
  useGetPokemonsQuery: jest.fn(),
}));

jest.mock('@/components/Pagination/Pagination', () => ({
  __esModule: true,
  default: ({ 'data-testid': dtid, onPreviousPage, onNextPage }) => (
    <div data-testid={dtid}>
      <button data-testid={`${dtid}-prev`} onClick={onPreviousPage}>
        Prev
      </button>
      <button data-testid={`${dtid}-next`} onClick={onNextPage}>
        Next
      </button>
    </div>
  ),
}));

jest.mock('./ResultPokemonListView', () => ({
  __esModule: true,
  default: () => <div data-testid="result-view" />,
}));

describe('ResultPokemonList', () => {
  const mockReplace = jest.fn();
  const mockSearchParams = new URLSearchParams('page=1');
  const mockSetIsDetailsOpen = jest.fn();
  const setPage = jest.fn();
  const setPaginationData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    (usePagination as jest.Mock).mockReturnValue({
      currentPage: '1',
      hasPrev: false,
      hasNext: true,
      totalPages: 5,
      setPage,
      setPaginationData,
    });

    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      isFetching: false,
      data: {
        count: 50,
        next: 'https://pokeapi.co/?page=2',
        previous: null,
        results: Array.from({ length: 10 }, (_, i) => ({ name: `poke${i}` })),
      },
      isError: false,
    });

    window.scrollTo = jest.fn();
  });

  it('shows top and bottom pagination when results ≥ 10', () => {
    render(<ResultPokemonList setIsDetailsOpen={mockSetIsDetailsOpen} />);

    expect(
      screen.getByTestId('pokemonlist-pagination-top')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('pokemonlist-pagination-bottom')
    ).toBeInTheDocument();

    expect(setPaginationData).toHaveBeenCalledWith({
      count: 50,
      next: 'https://pokeapi.co/?page=2',
      previous: null,
    });
  });

  it('hides pagination when less than 10 results and not last page', () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      isFetching: false,
      data: {
        count: 5,
        next: null,
        previous: null,
        results: Array.from({ length: 5 }, (_, i) => ({ name: `p${i}` })),
      },
      isError: false,
    });
    (usePagination as jest.Mock).mockReturnValue({
      currentPage: '1',
      hasPrev: false,
      hasNext: false,
      totalPages: 3,
      setPage,
      setPaginationData,
    });

    render(<ResultPokemonList setIsDetailsOpen={mockSetIsDetailsOpen} />);

    expect(screen.queryByTestId('pokemonlist-pagination-top')).toBeNull();
    expect(screen.queryByTestId('pokemonlist-pagination-bottom')).toBeNull();
  });

  it('navigates to next page on Next click', () => {
    jest.useFakeTimers();

    render(<ResultPokemonList setIsDetailsOpen={mockSetIsDetailsOpen} />);

    fireEvent.click(screen.getByTestId('pokemonlist-pagination-top-next'));

    jest.runAllTimers();

    expect(mockSetIsDetailsOpen).toHaveBeenCalledWith(false);
    expect(setPage).toHaveBeenCalledWith(2);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });

    expect(mockReplace).toHaveBeenCalledWith('?page=2');

    jest.useRealTimers();
  });
});
