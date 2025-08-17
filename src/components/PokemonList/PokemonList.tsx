'use client';
import React, { useEffect, useState } from 'react';
import PokemonDetails from '@/components/PokemonDetails/PokemonDetails.tsx';
import SelectedItemsFlyout from '@/components/SelectedItemsFlyout/SelectedItemsFlyout.tsx';
import PokemonListView from '@/components/PokemonList/PokemonListView.tsx';
import ResultPokemonSearch from '@/components/ResultPokemonSearch/ResultPokemonSearch.tsx';
import ResultPokemonList from '@/components/ResultPokemonList/ResultPokemonList.tsx';
import { useSearchParams } from 'next/navigation.js';

const PokemonList: React.FC = () => {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'search'>('list');

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const queryTermSearch = searchParams.get('searchTerm') || '';

  useEffect(() => {
    if (queryTermSearch) {
      setSearchValue(queryTermSearch);
      setViewMode('search');
    }
  }, [queryTermSearch]);

  return (
    <>
      <PokemonListView searchValue={queryTermSearch || searchValue}>
        {viewMode === 'search' ? (
          <ResultPokemonSearch
            setIsDetailsOpen={setIsDetailsOpen}
            searchValue={searchValue}
          />
        ) : (
          <ResultPokemonList setIsDetailsOpen={setIsDetailsOpen} />
        )}
      </PokemonListView>

      {isDetailsOpen && (
        <PokemonDetails
          setIsDetailsOpen={setIsDetailsOpen}
          data-testid="pokemonlist-details"
        />
      )}
      <SelectedItemsFlyout />
    </>
  );
};

export default PokemonList;
