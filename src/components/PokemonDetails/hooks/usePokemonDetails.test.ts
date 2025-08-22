import { renderHook, act, waitFor } from '@testing-library/react';
import usePokemonDetails from './usePokemonDetails';
import fetchPokemonDetails from '../../../services/api/fetchPokemonDetails';

jest.mock('../../../services/api/fetchPokemonDetails');
jest.mock('../../../utils/sleep', () => ({ sleep: () => Promise.resolve() }));

describe('usePokemonDetails', () => {
  const mockDetails = { id: '1', name: 'bulbasaur' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fetch if charId is undefined', () => {
    renderHook(() => usePokemonDetails({ charId: undefined }));
    expect(fetchPokemonDetails).not.toHaveBeenCalled();
  });

  it('should fetch and set data on success', async () => {
    (fetchPokemonDetails as jest.Mock).mockResolvedValueOnce(mockDetails);
    const { result } = renderHook(() => usePokemonDetails({ charId: '1' }));
    await waitFor(() => expect(result.current.details).toEqual(mockDetails));
    expect(fetchPokemonDetails).toHaveBeenCalledWith('1');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set error on fetch failure', async () => {
    (fetchPokemonDetails as jest.Mock).mockRejectedValueOnce('error!');
    const { result } = renderHook(() => usePokemonDetails({ charId: '2' }));
    await waitFor(() => expect(result.current.error).toBe('error!'));
    expect(result.current.details).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it('should set loading true while fetching', async () => {
    let resolve: (v: unknown) => void = () => {};
    (fetchPokemonDetails as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        })
    );
    const { result } = renderHook(
      ({ id }) => usePokemonDetails({ charId: id }),
      { initialProps: { id: '3' } }
    );
    expect(result.current.loading).toBe(true);
    act(() => {
      resolve({ id: '3', name: 'venusaur' });
    });
  });
});
