import React from 'react';
import type { Character } from '../services/api/types';

export interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  characters: Character[];
  loading: boolean;
  error: string | null;
  fetchData: (term: string) => Promise<void>;
}

export const SearchContext = React.createContext<SearchContextProps>({
  searchTerm: '',
  setSearchTerm: () => {},
  characters: [],
  loading: false,
  error: null,
  fetchData: async () => {},
});
