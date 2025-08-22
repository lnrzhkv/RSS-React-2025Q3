import React, { useEffect, useState } from 'react';
import styles from './PokemonList.module.css';
import Search from '../Search/Search';
import Results from '../Results/Results';
import ErrorButton from '../ErrorButton/ErrorButton';
import Box from '../../components/Box/Box';
import PokemonDetails from '../PokemonDetails/PokemonDetails';
import Pagination from '../Pagination/Pagination';
import SelectedItemsFlyout from '../SelectedItemsFlyout/SelectedItemsFlyout';
import type { CharacterWithImage } from '../../shared/api/types';
import { usePagination } from '../../context/hooks/usePagination';
import {
  pokemonApi,
  useLazyGetPokemonsQuery,
  useLazySearchPokemonQuery,
} from '../../shared/api/apiSlice';
import { useSearchParams } from 'react-router-dom';

const PokemonList: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [characters, setCharacters] = useState<CharacterWithImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    currentPage,
    hasPrev,
    totalPages,
    setPage,
    setPaginationData,
    hasNext,
  } = usePagination();

  const [triggerSearch] = useLazySearchPokemonQuery();
  const [triggerGetPokemons] = useLazyGetPokemonsQuery();

  useEffect(() => {
    const savedPage = sessionStorage.getItem('pokemonListPage') || '1';
    setPage(+savedPage);
    fetchPokemons(+savedPage);
  }, []);

  const fetchCharacterBySearch = async (searchTerm: string) => {
    if (!searchTerm) {
      await fetchPokemons(+currentPage);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await triggerSearch(searchTerm, true).unwrap();
      setCharacters(result);
      setPaginationData({
        count: result.length,
        next: null,
        previous: null,
      });
    } catch {
      setError('Pokemon not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemons = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await triggerGetPokemons(page).unwrap();
      setCharacters(result.results);
      setPaginationData({
        count: result.count,
        next: result.next,
        previous: result.previous,
      });
      setPage(page);
      sessionStorage.setItem('pokemonListPage', String(page));
      setSearchValue('');
    } catch {
      setError('Failed to fetch pokemons');
    } finally {
      setLoading(false);
    }
  };

  const onPreviousPage = async () => {
    if (!hasPrev) return;
    await fetchPokemons(+currentPage - 1);
    searchParams.delete('characterId');
    setSearchParams(searchParams);
    setIsDetailsOpen(false);
    setPage(+currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onNextPage = async () => {
    if (!hasNext) return;
    await fetchPokemons(+currentPage + 1);
    searchParams.delete('characterId');
    setSearchParams(searchParams);
    setPage(+currentPage + 1);
    setIsDetailsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onPageChange = async (page: number) => {
    await fetchPokemons(page);
    searchParams.delete('characterId');
    setSearchParams(searchParams);
    setIsDetailsOpen(false);
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    pokemonApi.util.invalidateTags(['PokemonList', 'Search', 'PokemonDetails']);

    if (searchValue) {
      await fetchCharacterBySearch(searchValue);
    } else {
      await fetchPokemons(+currentPage);
    }
  };

  const isShowPagination =
    characters.length >= 10 ||
    (totalPages !== undefined && +currentPage === totalPages);

  return (
    <div className={styles.content} data-testid="pokemonlist-content">
      <Box className={styles.rightPart} data-testid="pokemonlist-rightpart">
        <div
          className={styles.listContainer}
          data-testid="pokemonlist-listcontainer"
        >
          <div
            className={styles.topSection}
            data-testid="pokemonlist-topsection"
          >
            <h1 data-testid="app-main-title" className={styles.appTitle}>
              Pokémon Search
            </h1>
            <Search
              data-testid="pokemonlist-search"
              searchValue={searchValue}
              onChangeSearchValue={setSearchValue}
              onSearch={(term) => fetchCharacterBySearch(term)}
            />
          </div>

          <Box withShadow={false} data-testid="pokemonlist-resultsbox">
            <h2 data-testid="app-results-title" className={styles.sectionTitle}>
              Search Results
            </h2>
            {isShowPagination && (
              <Pagination
                data-testid="pokemonlist-pagination-top"
                currentPage={+currentPage}
                totalPages={totalPages || 1}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
                onPageChange={onPageChange}
                className={styles.topPagination}
              />
            )}

            <Results
              characters={characters}
              loading={loading}
              error={error}
              setIsDetailsOpen={setIsDetailsOpen}
            />

            {isShowPagination && (
              <Pagination
                data-testid="pokemonlist-pagination-bottom"
                currentPage={+currentPage}
                totalPages={totalPages || 1}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
                onPageChange={onPageChange}
              />
            )}
          </Box>

          <div className={styles.footer} data-testid="pokemonlist-footer">
            <ErrorButton data-testid="pokemonlist-errorbutton" />
            <button
              onClick={handleRefresh}
              className={styles.refreshButton}
              data-testid="refresh-button"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </Box>

      {isDetailsOpen && <PokemonDetails data-testid="pokemonlist-details" />}
      <SelectedItemsFlyout />
    </div>
  );
};

export default PokemonList;
