import type { Character } from '@/shared/api/types.ts';

export interface AppState {
  characters: Character[];
  searchTerm: string;
  page: number;
}

export type Theme = 'light' | 'dark';
