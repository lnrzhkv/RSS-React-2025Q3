import { useState, type ChangeEvent } from 'react';
import styles from './Search.module.css';
import { useTranslations } from 'next-intl';

interface SearchProps {
  searchValue: string;
  onChangeSearchValue: (value: string) => void;
  onSearch: (searchTerm: string) => Promise<void>;
  'data-testid'?: string;
}

const Search = ({
  searchValue,
  onChangeSearchValue,
  onSearch,
  'data-testid': testId,
}: SearchProps) => {
  const t = useTranslations('Search');
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSubmit = () => {
    setSearchError(null);
    onSearch(searchValue.trim());
  };

  return (
    <div className={styles.searchContainer} data-testid={testId}>
      <input
        type="text"
        value={searchValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeSearchValue(e.target.value)
        }
        placeholder={t('searchPlaceholder')}
        className={styles.searchInput}
        data-testid="search-input"
      />
      <button
        data-testid="search-button"
        onClick={handleSubmit}
        className={styles.searchButton}
        aria-label="Search"
      >
        {t('searchButton')}
      </button>
      {searchError && (
        <div className={styles.errorMessage} data-testid="search-error">
          {searchError}
        </div>
      )}
    </div>
  );
};

export default Search;
