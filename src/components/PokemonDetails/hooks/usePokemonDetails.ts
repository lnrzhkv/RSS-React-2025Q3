import { useEffect, useState } from 'react';
import fetchPokemonDetails from '../../../services/api/fetchPokemonDetails';
import type { PokemonDetails } from '../../../services/api/types';
import { sleep } from '../../../utils/sleep';

interface Props {
  charId: string | undefined | null;
}

const usePokemonDetails = ({ charId }: Props) => {
  const [data, setData] = useState<PokemonDetails>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchPokemonDetails(id);
      setData(response);

      await sleep(500);
      setLoading(false);
    } catch (error) {
      if (typeof error === 'string') {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (charId) {
      getData(charId);
    }
  }, [charId]);

  return {
    details: data,
    error,
    loading,
  };
};

export default usePokemonDetails;
