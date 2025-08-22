import type { Character } from './shared/api/types';

export interface AppState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  page: number;
}

export type Theme = 'light' | 'dark';
