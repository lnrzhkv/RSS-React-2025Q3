import { renderHook, act } from '@testing-library/react';
import * as api from '../../services/api/fetchCharacters';
import { usePokemons } from '../../context/hooks/usePokemons';
import type { PaginationInfo } from '../../services/api/types';
import { mockCharacters } from './utils';

jest.mock('../../services/api/fetchCharacters');
const mockFetchCharacters = api.fetchCharacters as jest.MockedFunction<
  typeof api.fetchCharacters
>;

const mockPagination: PaginationInfo = {
  next: '2',
  previous: null,
  count: 100,
};

describe('usePokemons', () => {
  let setPaginationData: jest.Mock;
  let onDataLoad: jest.Mock;

  beforeEach(() => {
    setPaginationData = jest.fn();
    onDataLoad = jest.fn();
    jest.clearAllMocks();
  });

  it('handles fetch error', async () => {
    jest.spyOn(api, 'fetchCharacters').mockRejectedValueOnce(new Error('fail'));
    const setPaginationData = jest.fn();
    const { result } = renderHook(() => usePokemons({ setPaginationData }));
    await act(async () => {
      await result.current.fetchPokemons(1);
    });
    expect(result.current.error).toBe('fail');
    expect(result.current.pokemonList).toEqual([]);
  });

  it('should have loading=true, error=null, and an empty pokemonList by default', () => {
    const { result } = renderHook(() =>
      usePokemons({ setPaginationData, onDataLoad })
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.pokemonList).toEqual([]);
  });

  it('should successfully fetch pokemons and call callbacks', async () => {
    mockFetchCharacters.mockResolvedValueOnce({
      results: mockCharacters,
      next: mockPagination.next,
      previous: mockPagination.previous,
      count: mockPagination.count,
    });

    const { result } = renderHook(() =>
      usePokemons({ setPaginationData, onDataLoad })
    );

    await act(async () => {
      await result.current.fetchPokemons(1);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.pokemonList).toEqual(mockCharacters);
    expect(setPaginationData).toHaveBeenCalledWith(mockPagination);
    expect(onDataLoad).toHaveBeenCalledWith(mockCharacters);
  });

  it('should handle fetch error', async () => {
    mockFetchCharacters.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() =>
      usePokemons({ setPaginationData, onDataLoad })
    );

    await act(async () => {
      await result.current.fetchPokemons(1);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.pokemonList).toEqual([]);
    expect(setPaginationData).not.toHaveBeenCalled();
    expect(onDataLoad).not.toHaveBeenCalled();
  });

  it('should not call onDataLoad if not provided', async () => {
    mockFetchCharacters.mockResolvedValueOnce({
      results: mockCharacters,
      next: mockPagination.next,
      previous: mockPagination.previous,
      count: mockPagination.count,
    });

    const { result } = renderHook(() => usePokemons({ setPaginationData }));

    await act(async () => {
      await result.current.fetchPokemons();
    });

    expect(result.current.pokemonList).toEqual(mockCharacters);
  });

  it('should call fetchCharacters with page=1 by default', async () => {
    mockFetchCharacters.mockResolvedValueOnce({
      results: mockCharacters,
      next: mockPagination.next,
      previous: mockPagination.previous,
      count: mockPagination.count,
    });

    const { result } = renderHook(() =>
      usePokemons({ setPaginationData, onDataLoad })
    );

    await act(async () => {
      await result.current.fetchPokemons();
    });

    expect(mockFetchCharacters).toHaveBeenCalledWith(1);
  });
});
