import React from 'react';
import { render, act } from '@testing-library/react';
import { GlobalProvider, GlobalContext } from './GlobalContext';

import { usePokemonBySearch } from './hooks/usePokemonBySearch';
import { usePagination } from './hooks/usePagination';
import { usePokemons } from './hooks/usePokemons';

jest.mock('./hooks/usePokemonBySearch');
jest.mock('./hooks/usePagination');
jest.mock('./hooks/usePokemons');

describe('GlobalContext branches', () => {
  function setup({
    pokemonsError = undefined as string | null | undefined,
    searchError = undefined as string | null | undefined,
    pokemonsLoading = false,
    searchLoading = false,
    hasNext = true,
    hasPrev = true,
    currentPage = 1,
    totalPages = 10,
  } = {}) {
    (usePokemonBySearch as jest.Mock).mockReturnValue({
      requestError: searchError,
      fetchCharacterBySearch: jest.fn(),
      loading: searchLoading,
      onChangeSearchValue: jest.fn(),
      searchValue: '',
    });
    (usePagination as jest.Mock).mockReturnValue({
      currentPage,
      hasNext,
      hasPrev,
      totalPages,
      setPage: jest.fn(),
      setPaginationData: jest.fn(),
    });
    (usePokemons as jest.Mock).mockReturnValue({
      error: pokemonsError,
      fetchPokemons: jest.fn(() => Promise.resolve()),
      loading: pokemonsLoading,
    });
  }

  function renderWithContext(children: React.ReactNode) {
    return render(<GlobalProvider>{children}</GlobalProvider>);
  }

  function getContextValue(): import('./GlobalContext').ContextProps {
    const ref = {
      current: undefined as import('./GlobalContext').ContextProps | undefined,
    };
    renderWithContext(
      <GlobalContext.Consumer>
        {(value) => {
          ref.current = value || undefined;
          return null;
        }}
      </GlobalContext.Consumer>
    );
    if (!ref.current) throw new Error('Context not found');
    return ref.current;
  }

  it('returns error if pokemonsError is present', () => {
    setup({ pokemonsError: 'Ошибка' });
    const ctx = getContextValue();
    expect(ctx.error).toBe('Ошибка');
  });

  it('returns error if searchError is present', () => {
    setup({ searchError: 'Ошибка поиска' });
    const ctx = getContextValue();
    expect(ctx.error).toBe('Ошибка поиска');
  });

  it('returns loading if pokemonsLoading is true', () => {
    setup({ pokemonsLoading: true });
    const ctx = getContextValue();
    expect(ctx.loading).toBe(true);
  });

  it('returns loading if searchLoading is true', () => {
    setup({ searchLoading: true });
    const ctx = getContextValue();
    expect(ctx.loading).toBe(true);
  });

  it('does not call fetchPokemons on onPreviousPage if hasPrev is false', async () => {
    setup({ hasPrev: false });
    const ctx = getContextValue();
    await act(async () => {
      await ctx.pagination.onPreviousPage();
    });
    expect((usePokemons as jest.Mock)().fetchPokemons).not.toHaveBeenCalled();
  });

  it('does not call fetchPokemons on onNextPage if hasNext is false', async () => {
    setup({ hasNext: false });
    const ctx = getContextValue();
    await act(async () => {
      await ctx.pagination.onNextPage();
    });
    expect((usePokemons as jest.Mock)().fetchPokemons).not.toHaveBeenCalled();
  });

  it('calls fetchPokemons on onPageChange', async () => {
    setup();
    const ctx = getContextValue();
    await act(async () => {
      await ctx.pagination.onPageChange(2);
    });
    expect((usePokemons as jest.Mock)().fetchPokemons).toHaveBeenCalledWith(2);
  });

  it('has an empty characters array by default', () => {
    setup();
    const ctx = getContextValue();
    expect(ctx.characters).toEqual([]);
  });
});
