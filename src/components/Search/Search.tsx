import React from 'react';
import { SearchContext } from '../../context/SearchContext';
import styles from './Search.module.css';

class Search extends React.Component {
  static contextType = SearchContext;
  declare context: React.ContextType<typeof SearchContext>;

  state = {
    inputValue: '',
  };

  componentDidMount() {
    this.setState({ inputValue: this.context.searchTerm });
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSubmit = () => {
    const processedTerm = this.state.inputValue.trim();
    this.context.setSearchTerm(processedTerm);
  };

  render() {
    return (
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleChange}
          placeholder="Search Pokémon..."
          className={styles.searchInput}
        />
        <button onClick={this.handleSubmit} className={styles.searchButton}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
