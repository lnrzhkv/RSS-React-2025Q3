import React, { useEffect } from 'react';
import styles from './PokemonList.module.css';
import Search from '../Search/Search';
import Results from '../Results/Results';
import ErrorButton from '../ErrorButton/ErrorButton';
import Box from '../../components/Box/Box';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';
import PokemonDetails from '../PokemonDetails/PokemonDetails';
import Pagination from '../Pagination/Pagination';

const PokemonList: React.FC = () => {
  const { pagination, fetchPokemons } = useGlobalContext();

  useEffect(() => {
    fetchPokemons(+pagination.currentPage);
  }, []);

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
            <Search data-testid="pokemonlist-search" />
          </div>

          <Box withShadow={false} data-testid="pokemonlist-resultsbox">
            <h2 data-testid="app-results-title" className={styles.sectionTitle}>
              Search Results
            </h2>
            <Pagination
              data-testid="pokemonlist-pagination-top"
              currentPage={+pagination.currentPage}
              totalPages={pagination.totalPages || 1}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPreviousPage={pagination.onPreviousPage}
              onNextPage={pagination.onNextPage}
              onPageChange={pagination.onPageChange}
              className={styles.topPagination}
            />
            <Results data-testid="pokemonlist-results" />
            <Pagination
              data-testid="pokemonlist-pagination-bottom"
              currentPage={+pagination.currentPage}
              totalPages={pagination.totalPages || 1}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPreviousPage={pagination.onPreviousPage}
              onNextPage={pagination.onNextPage}
              onPageChange={pagination.onPageChange}
            />
          </Box>

          <div className={styles.footer} data-testid="pokemonlist-footer">
            <ErrorButton data-testid="pokemonlist-errorbutton" />
          </div>
        </div>
      </Box>

      <PokemonDetails data-testid="pokemonlist-details" />
    </div>
  );
};

export default PokemonList;
