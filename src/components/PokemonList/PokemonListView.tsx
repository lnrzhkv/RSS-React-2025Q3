import React from 'react';
import styles from './PokemonList.module.css';
import Box from '@/components/Box/Box.tsx';
import Search from '@/components/Search/Search.tsx';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  children?: ReactNode;
  searchValue?: string;
}

const PokemonListView = ({ children, searchValue }: Props) => {
  const t = useTranslations('PokemonList');

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
              {t('title')}
            </h1>
            <Search
              data-testid="pokemonlist-search"
              searchValue={searchValue || ''}
              onChangeSearchValue={async () => Promise.resolve()}
              onSearch={async () => Promise.resolve()}
            />
          </div>

          <Box withShadow={false} data-testid="pokemonlist-resultsbox">
            <h2 data-testid="app-results-title" className={styles.sectionTitle}>
              {t('results')}
            </h2>

            {children}
          </Box>

          <div className={styles.footer} data-testid="pokemonlist-footer">
            <div data-testid="pokemonlist-errorbutton-placeholder"></div>
            <div data-testid="refresh-button-placeholder"></div>
          </div>
        </div>
      </Box>

      {children}
    </div>
  );
};

export default PokemonListView;
