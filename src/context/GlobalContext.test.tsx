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
    isNotFound = false,
    hasNext = true,
    hasPrev = true,
    currentPage = 1,
    totalPages = 10,
  } = {}) {
    (usePokemonBySearch as jest.Mock).mockReturnValue({
      requestError: searchError,
      isNotFound,
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

  it('отдает error, если есть pokemonsError', () => {
    setup({ pokemonsError: 'Ошибка' });
    const ctx = getContextValue();
    expect(ctx.error).toBe('Ошибка');
  });

  it('отдает error, если есть searchError', () => {
    setup({ searchError: 'Ошибка поиска' });
    const ctx = getContextValue();
    expect(ctx.error).toBe('Ошибка поиска');
  });

  it('отдает loading, если pokemonsLoading', () => {
    setup({ pokemonsLoading: true });
    const ctx = getContextValue();
    expect(ctx.loading).toBe(true);
  });

  it('отдает loading, если searchLoading', () => {
    setup({ searchLoading: true });
    const ctx = getContextValue();
    expect(ctx.loading).toBe(true);
  });

  it('отдает isNotFound', () => {
    setup({ isNotFound: true });
    const ctx = getContextValue();
    expect(ctx.isNotFound).toBe(true);
  });

  it('pagination: onPreviousPage не вызывает fetchPokemons, если hasPrev=false', async () => {
    setup({ hasPrev: false });
    const ctx = getContextValue();
    await act(async () => {
      await ctx.pagination.onPreviousPage();
    });
    expect((usePokemons as jest.Mock)().fetchPokemons).not.toHaveBeenCalled();
  });

  it('pagination: onNextPage не вызывает fetchPokemons, если hasNext=false', async () => {
    setup({ hasNext: false });
    const ctx = getContextValue();
    await act(async () => {
      await ctx.pagination.onNextPage();
    });
    expect((usePokemons as jest.Mock)().fetchPokemons).not.toHaveBeenCalled();
  });

  it('pagination: onPageChange вызывает fetchPokemons', async () => {
    setup();
    const ctx = getContextValue();
    await act(async () => {
      await ctx.pagination.onPageChange(2);
    });
    expect((usePokemons as jest.Mock)().fetchPokemons).toHaveBeenCalledWith(2);
  });

  it('characters по умолчанию пустой массив', () => {
    setup();
    const ctx = getContextValue();
    expect(ctx.characters).toEqual([]);
  });
});
