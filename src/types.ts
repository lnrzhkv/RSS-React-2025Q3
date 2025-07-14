import type { Character } from './services/api/types';

export interface AppState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  page: number;
}
