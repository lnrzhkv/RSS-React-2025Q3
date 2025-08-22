import { makeStore } from './store.ts';
import { pokemonApi } from '@/shared/api/apiSlice.ts';

import type { RootState } from './store.ts';

export async function createServerStoreForPokemons(
  page = 1
): Promise<RootState> {
  const store = makeStore();

  const dispatchResult = store.dispatch(
    pokemonApi.endpoints.getPokemons.initiate(page)
  );

  await dispatchResult;

  return store.getState();
}
