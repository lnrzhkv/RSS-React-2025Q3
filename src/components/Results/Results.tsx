import React from 'react';
import { SearchContext } from '../../context/SearchContext';
import Loader from './Loader';
import ResultsItem from './ResultsItem';
import styles from './Results.module.css';

class Results extends React.Component {
  static contextType = SearchContext;
  declare context: React.ContextType<typeof SearchContext>;

  render() {
    const { characters, loading, error } = this.context;

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

    if (characters.length === 0) {
      return <div className={styles.noResults}>No Pokémon found</div>;
    }

    return (
      <div className={styles.resultsContainer}>
        {characters.map((character) => (
          <ResultsItem key={character.id} character={character} />
        ))}
      </div>
    );
  }
}

export default Results;
