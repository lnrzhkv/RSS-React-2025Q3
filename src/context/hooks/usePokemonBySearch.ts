import { useState, useCallback, useEffect } from 'react';
import { fetchCharacterBySearchString } from '../../services/api/fetchCharacterBySearchString';
import type { CharacterWithImage } from '../../services/api/types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useLocation, useSearchParams } from 'react-router-dom';

const STORAGE_KEY = 'searchTerm';

interface Props {
  onDataLoad?: (data: CharacterWithImage[]) => void;
}
export const usePokemonBySearch = ({ onDataLoad }: Props = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [storageValue, setStorageValue] = useLocalStorage(STORAGE_KEY, '');
  const [searchTerm, setSearchTerm] = useState<string>(storageValue);

  const [characters, setCharacters] = useState<CharacterWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestError, setReqError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const querySearch = params.get('search');

    const actualValue = querySearch !== null ? querySearch : storageValue;

    if (actualValue !== searchTerm) {
      setSearchTerm(actualValue);
    }
  }, [location.search, storageValue]);

  const handleQuery = useCallback(
    (newSearchValue: string) => {
      const newParams = new URLSearchParams(searchParams);

      if (newSearchValue.trim()) {
        newParams.set('search', newSearchValue.trim());
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const resetQueryPage = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);
    setCharacters([]);
  }, [searchParams, setSearchParams]);

  const onChangeSearch = useCallback(
    (newSearchValue: string) => {
      setSearchTerm(newSearchValue);
      handleQuery(newSearchValue);
      setStorageValue(newSearchValue);
    },
    [handleQuery, setStorageValue]
  );

  const fetchCharacterBySearch = async () => {
    setLoading(true);
    setReqError(null);
    setStorageValue(searchTerm);
    resetQueryPage();

    try {
      const data = await fetchCharacterBySearchString(searchTerm);
      setCharacters(data.results);
      setLoading(false);
      onDataLoad?.(data.results);
    } catch (err) {
      setReqError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      setCharacters([]);
    }
  };

  return {
    searchValue: searchTerm,
    onChangeSearchValue: onChangeSearch,
    characters,
    loading,
    requestError,
    fetchCharacterBySearch,
    resetQueryPage,
  };
};
