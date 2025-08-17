'use client';

import React from 'react';
import Results from '@/components/Results/Results.tsx';

import { useSearchPokemonQuery } from '@/shared/api/apiSlice.ts';

interface Props {
  searchValue: string;
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultPokemonSearch: React.FC<Props> = ({
  searchValue,
  setIsDetailsOpen,
}) => {
  const {
    isFetching: isFetchingSearch,
    data: pokemonSearchData,
    isError: isSearchError,
  } = useSearchPokemonQuery(searchValue, {
    skip: !searchValue,
  });

  return (
    <>
      <Results
        characters={pokemonSearchData || []}
        isLoading={isFetchingSearch}
        isError={isSearchError}
        setIsDetailsOpen={setIsDetailsOpen}
      />
    </>
  );
};

export default ResultPokemonSearch;
