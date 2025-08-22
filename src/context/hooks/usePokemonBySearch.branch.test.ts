import { renderHook, act } from '@testing-library/react';
import { usePokemonBySearch } from '../hooks/usePokemonBySearch';
import * as api from '../../services/api/fetchCharacterBySearchString';

jest.mock('../../hooks/useLocalStorage', () => () => ['', jest.fn()]);

const mockSetSearchParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ search: '' }),
  useSearchParams: () => [{ get: () => null }, mockSetSearchParams],
}));

describe('usePokemonBySearch', () => {
  it('handles fetch error', async () => {
    jest
      .spyOn(api, 'fetchCharacterBySearchString')
      .mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => usePokemonBySearch());
    await act(async () => {
      await result.current.fetchCharacterBySearch();
    });
    expect(result.current.requestError).toBe('fail');
    expect(result.current.characters).toEqual([]);
  });
});
