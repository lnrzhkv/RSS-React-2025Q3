import { renderHook, act } from '@testing-library/react';
import * as api from '../../services/api/fetchCharacterBySearchString';
import useLocalStorage from '../../hooks/useLocalStorage';

import { usePokemonBySearch } from '../hooks/usePokemonBySearch';
import { mockCharacters } from './utils';

jest.mock('../../hooks/useLocalStorage');
const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<
  typeof useLocalStorage
>;

jest.mock('../../services/api/fetchCharacterBySearchString');
const mockFetchCharacterBySearchString =
  api.fetchCharacterBySearchString as jest.MockedFunction<
    typeof api.fetchCharacterBySearchString
  >;

const mockSetSearchParams = jest.fn();
const mockUseSearchParams = jest
  .fn()
  .mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
const mockUseLocation = jest.fn().mockReturnValue({ search: '' });

jest.mock('react-router-dom', () => ({
  useSearchParams: () => mockUseSearchParams(),
  useLocation: () => mockUseLocation(),
}));

describe('usePokemonBySearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalStorage.mockImplementation((_key, fallback) => [
      fallback,
      jest.fn(),
    ]);
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);
    mockUseLocation.mockReturnValue({ search: '' });
  });

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => usePokemonBySearch());
    expect(result.current.searchValue).toBe('');
    expect(result.current.characters).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.requestError).toBeNull();
    expect(result.current.isNotFound).toBe(false);
  });

  it('should update search value, params and storage on change', () => {
    const setStorage = jest.fn();
    mockUseLocalStorage.mockImplementation(() => ['', setStorage]);
    const setParams = jest.fn();
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), setParams]);

    const { result } = renderHook(() => usePokemonBySearch());
    act(() => {
      result.current.onChangeSearchValue('Pika');
    });

    expect(result.current.searchValue).toBe('Pika');
    expect(setStorage).toHaveBeenCalledWith('Pika');
    expect(setParams).toHaveBeenCalled();
  });

  it('should use query param as source of truth for initial search value', () => {
    mockUseLocation.mockReturnValue({ search: '?search=Pika' });
    mockUseLocalStorage.mockImplementation(() => ['', jest.fn()]);
    const { result } = renderHook(() => usePokemonBySearch());
    expect(result.current.searchValue).toBe('Pika');
  });

  it('should fetch and set characters on success', async () => {
    mockFetchCharacterBySearchString.mockResolvedValueOnce({
      results: mockCharacters,
      count: 2,
      next: null,
      previous: null,
    });
    const setStorage = jest.fn();
    mockUseLocalStorage.mockImplementation(() => ['Pika', setStorage]);
    const setParams = jest.fn();
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), setParams]);
    const onDataLoad = jest.fn();

    const { result } = renderHook(() => usePokemonBySearch({ onDataLoad }));

    await act(async () => {
      await result.current.fetchCharacterBySearch();
    });

    expect(result.current.characters).toEqual(mockCharacters);
    expect(result.current.loading).toBe(false);
    expect(result.current.requestError).toBeNull();
    expect(result.current.isNotFound).toBe(false);
    expect(onDataLoad).toHaveBeenCalledWith(mockCharacters);
    expect(setParams).toHaveBeenCalled();
    expect(setStorage).toHaveBeenCalledWith('Pika');
  });

  it('should set isNotFound to true if results are empty', async () => {
    mockFetchCharacterBySearchString.mockResolvedValueOnce({
      results: [],
      count: 0,
      next: null,
      previous: null,
    });
    const setStorage = jest.fn();
    mockUseLocalStorage.mockImplementation(() => ['abc', setStorage]);
    const setParams = jest.fn();
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), setParams]);

    const { result } = renderHook(() => usePokemonBySearch());
    await act(async () => {
      await result.current.fetchCharacterBySearch();
    });
    expect(result.current.isNotFound).toBe(true);
    expect(result.current.characters).toEqual([]);
  });

  it('should handle fetch errors', async () => {
    mockFetchCharacterBySearchString.mockRejectedValueOnce(
      new Error('API failed')
    );
    const setStorage = jest.fn();
    mockUseLocalStorage.mockImplementation(() => ['abc', setStorage]);
    const setParams = jest.fn();
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), setParams]);

    const { result } = renderHook(() => usePokemonBySearch());
    await act(async () => {
      await result.current.fetchCharacterBySearch();
    });
    expect(result.current.requestError).toBe('API failed');
    expect(result.current.loading).toBe(false);
    expect(result.current.characters).toEqual([]);
    expect(result.current.isNotFound).toBe(false);
  });

  it('should not crash if onDataLoad is not provided', async () => {
    mockFetchCharacterBySearchString.mockResolvedValueOnce({
      results: mockCharacters,
      count: 2,
      next: null,
      previous: null,
    });
    const setStorage = jest.fn();
    mockUseLocalStorage.mockImplementation(() => ['abc', setStorage]);
    const setParams = jest.fn();
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), setParams]);

    const { result } = renderHook(() => usePokemonBySearch());
    await act(async () => {
      await result.current.fetchCharacterBySearch();
    });

    expect(result.current.characters).toEqual(mockCharacters);
  });
});
