import React from 'react';
import ResultsView from '@/components/Results/ResultsView.tsx';
import Pagination from '@/components/Pagination/Pagination.tsx';
import type { CharacterWithImage } from '@/shared/api/types.ts';

interface Props {
  results: CharacterWithImage[];
  currentPage: number;
  totalPages?: number;
  showPaginationTop?: boolean;
  showPaginationBottom?: boolean;
  isError?: boolean;
}

const ResultPokemonListView = ({
  results,
  currentPage,
  totalPages,
  showPaginationTop,
  showPaginationBottom,
}: Props) => {
  return (
    <>
      {showPaginationTop && (
        <div data-testid="pokemonlist-pagination-top">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            hasPrev={currentPage > 1}
            hasNext={!!totalPages && currentPage < totalPages}
            onPreviousPage={() => {}}
            onNextPage={() => {}}
            onPageChange={() => {}}
          />
        </div>
      )}

      <ResultsView characters={results || []} />

      {showPaginationBottom && (
        <div data-testid="pokemonlist-pagination-bottom">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            hasPrev={currentPage > 1}
            hasNext={!!totalPages && currentPage < totalPages}
            onPreviousPage={() => {}}
            onNextPage={() => {}}
            onPageChange={() => {}}
          />
        </div>
      )}
    </>
  );
};

export default ResultPokemonListView;
