import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '@/shared/store/selectedItemsSlice.ts';
import { pokemonApi } from '@/shared/api/apiSlice.ts';

import type { ReducersMapObject, Reducer, AnyAction } from 'redux';

export type RootState = {
  pokemonApi: ReturnType<typeof pokemonApi.reducer>;
  selectedItems: ReturnType<typeof selectedItemsReducer>;
};

const reducers: ReducersMapObject<RootState, AnyAction> = {
  pokemonApi: pokemonApi.reducer as unknown as Reducer<RootState['pokemonApi']>,
  selectedItems: selectedItemsReducer as unknown as Reducer<
    RootState['selectedItems']
  >,
};

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    preloadedState: preloadedState as RootState | undefined,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
