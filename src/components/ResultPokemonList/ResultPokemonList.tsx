'use client';
import React, { useEffect } from 'react';
import Pagination from '@/components/Pagination/Pagination.tsx';
import { usePagination } from '@/context/hooks/usePagination.ts';
import { useGetPokemonsQuery } from '@/shared/api/apiSlice.ts';
import { useRouter } from '@/shared/lib/navigation.ts';
import { useSearchParams } from 'next/navigation.js';
import ResultPokemonListView from './ResultPokemonListView.tsx';

interface Props {
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ResultPokemonList: React.FC<Props> = ({ setIsDetailsOpen }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentPage,
    hasPrev,
    totalPages,
    setPage,
    setPaginationData,
    hasNext,
  } = usePagination();

  const {
    isFetching: isFetchingList,
    data: pokemonListData,
    isError: isListError,
  } = useGetPokemonsQuery(+currentPage);

  useEffect(() => {
    if (!isFetchingList && pokemonListData) {
      setPaginationData({
        count: pokemonListData.count,
        next: pokemonListData.next,
        previous: pokemonListData.previous,
      });
    }
  }, [isFetchingList, pokemonListData, setPaginationData]);

  const handlePageChange = (page: number) => {
    setIsDetailsOpen(false);
    setPage(page);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const newParams = new URLSearchParams(searchParams.toString());

      newParams.set('page', page.toString());
      router.replace(`?${newParams.toString()}`);
    }, 0);
  };

  const handlePreviousPage = async () => {
    if (!hasPrev) return;
    handlePageChange(+currentPage - 1);
  };

  const handleNextPage = async () => {
    if (!hasNext) return;
    handlePageChange(+currentPage + 1);
  };

  const paginationProps = {
    currentPage: +currentPage,
    totalPages: totalPages || 1,
    hasPrev,
    hasNext,
    onPageChange: handlePageChange,
    onPreviousPage: handlePreviousPage,
    onNextPage: handleNextPage,
  };

  const isShowPagination =
    (pokemonListData?.results && pokemonListData?.results?.length >= 10) ||
    (totalPages !== undefined && +currentPage === totalPages);

  return (
    <>
      {isShowPagination && (
        <Pagination
          data-testid="pokemonlist-pagination-top"
          {...paginationProps}
        />
      )}

      <ResultPokemonListView
        results={pokemonListData?.results || []}
        currentPage={+currentPage}
        totalPages={totalPages}
        showPaginationTop={isShowPagination}
        showPaginationBottom={isShowPagination}
        isError={isListError}
      />

      {isShowPagination && (
        <Pagination
          data-testid="pokemonlist-pagination-bottom"
          {...paginationProps}
        />
      )}
    </>
  );
};

export default ResultPokemonList;
