import React, { useCallback } from 'react';
import Loader from './Loader';
import ResultsItem from './ResultsItem';
import styles from './Results.module.css';
import { useSearchParams } from 'react-router-dom';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';

const Results: React.FC = () => {
  const { characters, error, isNotFound, loading, setIsDetailsOpen } =
    useGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const handleClickItem = useCallback(
    (id: string) => {
      const newParams = new URLSearchParams(searchParams);

      newParams.set('characterId', id);
      setSearchParams(newParams);

      setIsDetailsOpen(true);
    },
    [searchParams, setSearchParams]
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorTitle}>Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (characters.length === 0 || isNotFound) {
    return <div className={styles.noResults}>No Pokémon found</div>;
  }

  return (
    <div className={styles.resultsContainer} data-testid="results-container">
      {characters.map((character) => (
        <div
          key={character.id}
          onClick={() => handleClickItem(String(character.id))}
        >
          <ResultsItem character={character} />
        </div>
      ))}
    </div>
  );
};

export default Results;
