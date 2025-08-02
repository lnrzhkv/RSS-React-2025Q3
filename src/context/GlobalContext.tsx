import React, {
  createContext,
  ReactNode,
  useLayoutEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { CharacterWithImage } from '../services/api/types';
import { usePagination } from './hooks/usePagination';
import { usePokemonBySearch } from './hooks/usePokemonBySearch';
import { usePokemons } from './hooks/usePokemons';
import type { Theme } from '../types';

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

  theme: Theme;
  toggleTheme: () => void;
}

export const GlobalContext = createContext<ContextProps | null>(null);

interface ProviderProps {
  children: ReactNode;
}

type DataState = CharacterWithImage[] | [];
export const GlobalProvider: React.FC<ProviderProps> = ({ children }) => {
  const [data, setData] = useState<DataState>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('light');

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
    onChangeSearchValue('');
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setNewTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setNewTheme = (value: 'light' | 'dark') => {
    document.body.setAttribute('data-theme', value);
    setTheme(value);
    localStorage.setItem('theme', value);
  };

  useLayoutEffect(() => {
    const currentTheme = localStorage?.getItem('theme') as
      | 'light'
      | 'dark'
      | 'undefined';

    if (currentTheme === null) {
      setNewTheme('light');
    } else {
      setNewTheme(currentTheme as 'light' | 'dark');
    }
  }, []);

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
        theme,
        toggleTheme,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
