import React, {
  createContext,
  ReactNode,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { CharacterWithImage } from '../services/api/types';
import { usePagination } from './hooks/usePagination';
import { usePokemonBySearch } from './hooks/usePokemonBySearch';
import { usePokemons } from './hooks/usePokemons';

export interface ContextProps {
  searchValue: string;
  characters: CharacterWithImage[] | [];
  loading: boolean;
  error: string | null;
  onChangeSearchValue: (value: string) => void;
  fetchPokemons: (page?: number) => Promise<void>;
  fetchCharacterBySearch: () => Promise<void>;

  setIsDetailsOpen: Dispatch<SetStateAction<boolean>>;
  isDetailsOpen: boolean;

  pagination: {
    currentPage: string;
    hasNext: boolean;
    hasPrev: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onPageChange: (page: number) => void;
    totalPages: number | undefined;
  };
}

export const GlobalContext = createContext<ContextProps | null>(null);

interface ProviderProps {
  children: ReactNode;
}

type DataState = CharacterWithImage[] | [];
export const GlobalProvider: React.FC<ProviderProps> = ({ children }) => {
  const [data, setData] = useState<DataState>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const {
    requestError: searchError,
    fetchCharacterBySearch,
    loading: searchLoading,
    onChangeSearchValue,
    searchValue,
  } = usePokemonBySearch({
    onDataLoad: setData,
  });

  const {
    currentPage,
    hasNext,
    hasPrev,
    totalPages,
    setPage,

    setPaginationData,
  } = usePagination();

  const {
    error: pokemonsError,
    fetchPokemons,
    loading: pokemonsLoading,
  } = usePokemons({ setPaginationData, onDataLoad: setData });

  const onPreviousPage = async () => {
    if (!hasPrev) return null;
    await fetchPokemons(+currentPage - 1);
    setPage(+currentPage - 1);
    setIsDetailsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onNextPage = async () => {
    if (!hasNext) return null;
    await fetchPokemons(+currentPage + 1);
    setPage(+currentPage + 1);
    setIsDetailsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onPageChange = async (page: number) => {
    await fetchPokemons(page);
    setPage(page);
    setIsDetailsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const error = pokemonsError || searchError;
  const loading = pokemonsLoading || searchLoading;

  return (
    <GlobalContext.Provider
      value={{
        characters: data,

        loading,
        error,

        searchValue,
        onChangeSearchValue,
        fetchCharacterBySearch,

        fetchPokemons,

        setIsDetailsOpen,
        isDetailsOpen,

        pagination: {
          onPageChange,
          currentPage: String(currentPage),
          hasNext,
          hasPrev,
          onPreviousPage,
          onNextPage,
          totalPages,
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
