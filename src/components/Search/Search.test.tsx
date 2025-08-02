import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from './Search';
import { GlobalContext, type ContextProps } from '../../context/GlobalContext';
import { BrowserRouter } from 'react-router-dom';

const mockContext = {
  searchValue: '',
  onChangeSearchValue: jest.fn(),
  characters: [],
  loading: false,
  error: null,
  fetchPokemons: jest.fn(),
  fetchCharacterBySearch: jest.fn(),
  isDetailsOpen: false,
  setIsDetailsOpen: jest.fn(),
  pagination: {
    onPageChange: jest.fn(),
    currentPage: '1',
    hasNext: false,
    hasPrev: false,
    onPreviousPage: jest.fn(),
    onNextPage: jest.fn(),
    totalPages: 1,
  },
  theme: 'light' as const,
  toggleTheme: jest.fn(),
} satisfies ContextProps;

describe('Search Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders search input and button', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider value={mockContext}>
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  test('displays saved search term from context', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider
          value={{ ...mockContext, searchValue: 'pikachu' }}
        >
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('pikachu');
  });

  test('shows empty input when no saved term exists', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider value={mockContext}>
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('');
  });

  test('saves trimmed search term to context', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider value={mockContext}>
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>
    );

    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(button);

    expect(mockContext.onChangeSearchValue).toHaveBeenCalledWith('pikachu');
  });

  test('updates input value when user types', () => {
    let testValue = '';
    const mockOnChange = jest.fn((value) => {
      testValue = value;
    });

    render(
      <BrowserRouter>
        <GlobalContext.Provider
          value={{
            ...mockContext,
            searchValue: testValue,
            onChangeSearchValue: mockOnChange,
          }}
        >
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'charmander' } });

    expect(mockOnChange).toHaveBeenCalledWith('charmander');

    render(
      <BrowserRouter>
        <GlobalContext.Provider
          value={{
            ...mockContext,
            searchValue: testValue,
            onChangeSearchValue: mockOnChange,
          }}
        >
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>,
      { container: document.body.firstChild as HTMLElement }
    );

    expect(screen.getByTestId('search-input')).toHaveValue('charmander');
  });

  test('calls fetchCharacterBySearch when search button is clicked with value', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider
          value={{ ...mockContext, searchValue: 'pikachu' }}
        >
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>
    );

    const button = screen.getByTestId('search-button');
    fireEvent.click(button);

    expect(mockContext.fetchCharacterBySearch).toHaveBeenCalled();
  });

  test('calls fetchPokemons when search button is clicked with empty value', () => {
    render(
      <BrowserRouter>
        <GlobalContext.Provider value={mockContext}>
          <Search />
        </GlobalContext.Provider>
      </BrowserRouter>
    );

    const button = screen.getByTestId('search-button');
    fireEvent.click(button);

    expect(mockContext.fetchPokemons).toHaveBeenCalled();
  });
});
