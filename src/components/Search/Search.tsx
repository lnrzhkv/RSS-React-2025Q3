import type { ChangeEvent } from 'react';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';
import styles from './Search.module.css';

const Search = () => {
  const {
    onChangeSearchValue,
    searchValue,
    fetchCharacterBySearch,
    fetchPokemons,
  } = useGlobalContext();

  const handleSubmit = async () => {
    console.log(searchValue, 'searchValuesearchValuesearchValuesearchValue');
    if (searchValue?.trim().length) await fetchCharacterBySearch();
    else await fetchPokemons();
  };
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={searchValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeSearchValue(e.target.value)
        }
        placeholder="Search Pokémon..."
        className={styles.searchInput}
        data-testid="search-input"
      />
      <button
        data-testid="search-button"
        onClick={handleSubmit}
        className={styles.searchButton}
        aria-label="Search"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
