import React from 'react';
import {
  SearchContext,
  type SearchContextProps,
} from '../../context/SearchContext';
import Search from '../Search/Search';
import ErrorButton from '../ErrorButton/ErrorButton';
import styles from './App.module.css';
import type { ApiResponse } from '../../services/api/types';
import { fetchCharacters } from '../../services/api/api';
import Results from '../Results/Results';
import { getSearchTerm, saveSearchTerm } from '../../utils/storage';

type AppProps = object;

class App extends React.Component<AppProps, SearchContextProps> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchTerm: getSearchTerm(),
      characters: [],
      loading: true,
      error: null,
      setSearchTerm: this.handleSetSearchTerm,
      fetchData: this.fetchData,
    };
  }

  componentDidMount() {
    this.fetchData(this.state.searchTerm);
  }

  fetchData = async (term: string) => {
    this.setState({
      loading: true,
      error: null,
      searchTerm: term,
    });

    try {
      const data: ApiResponse = await fetchCharacters(term);
      this.setState({
        characters: data.results,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
        characters: [],
      });
    }
  };

  handleSetSearchTerm = (term: string) => {
    saveSearchTerm(term);
    this.fetchData(term);
  };

  render() {
    return (
      <SearchContext.Provider value={this.state}>
        <div data-testid="app-container" className={styles.appContainer}>
          <div className={styles.topSection}>
            <h1 data-testid="app-main-title" className={styles.appTitle}>
              Pokémon Search
            </h1>
            <Search />
          </div>

          <div className={styles.resultsSection}>
            <h2 data-testid="app-results-title" className={styles.sectionTitle}>
              Search Results
            </h2>
            <Results />
          </div>

          <div className={styles.footer}>
            <ErrorButton />
          </div>
        </div>
      </SearchContext.Provider>
    );
  }
}

export default App;
