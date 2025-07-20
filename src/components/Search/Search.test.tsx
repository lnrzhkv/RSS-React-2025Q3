import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from './Search';
import { SearchContext } from '../../context/SearchContext';

const mockContext = {
  searchTerm: '',
  setSearchTerm: jest.fn(),
  characters: [],
  loading: false,
  error: null,
  fetchData: jest.fn(),
};

describe('Search Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders search input and button', () => {
    render(
      <SearchContext.Provider value={mockContext}>
        <Search />
      </SearchContext.Provider>
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  test('displays saved search term from context', () => {
    render(
      <SearchContext.Provider value={{ ...mockContext, searchTerm: 'pikachu' }}>
        <Search />
      </SearchContext.Provider>
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('pikachu');
  });

  test('shows empty input when no saved term exists', () => {
    render(
      <SearchContext.Provider value={mockContext}>
        <Search />
      </SearchContext.Provider>
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('');
  });

  test('updates input value when user types', () => {
    render(
      <SearchContext.Provider value={mockContext}>
        <Search />
      </SearchContext.Provider>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'charmander' } });
    expect(input).toHaveValue('charmander');
  });

  test('saves trimmed search term to context', () => {
    render(
      <SearchContext.Provider value={mockContext}>
        <Search />
      </SearchContext.Provider>
    );

    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');

    fireEvent.change(input, { target: { value: '   pikachu   ' } });
    fireEvent.click(button);

    expect(mockContext.setSearchTerm).toHaveBeenCalledWith('pikachu');
  });
});
