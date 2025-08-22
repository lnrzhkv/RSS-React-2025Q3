import { useCallback, useState } from 'react';
import { fetchCharacters } from '../../services/api/fetchCharacters';
import type {
  CharacterWithImage,
  PaginationInfo,
} from '../../services/api/types';

interface Props {
  setPaginationData: (args: PaginationInfo) => void;
  onDataLoad?: (data: CharacterWithImage[]) => void;
}
export const usePokemons = ({ setPaginationData, onDataLoad }: Props) => {
  const [characters, setCharacters] = useState<CharacterWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCharacters(page);

      setCharacters(response.results);
      onDataLoad?.(response.results);
      setPaginationData({
        next: response.next,
        previous: response.previous,
        count: response.count,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pokemonList: characters,
    loading,
    error,
    fetchPokemons: fetchData,
  };
};
