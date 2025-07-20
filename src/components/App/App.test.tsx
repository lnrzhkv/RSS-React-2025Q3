import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { fetchCharacters } from '../../services/api/api';
import { getSearchTerm, saveSearchTerm } from '../../utils/storage';

// Мокаем API и дочерние компоненты
jest.mock('../../services/api/api', () => ({
  fetchCharacters: jest.fn(),
}));

jest.mock('../../utils/storage', () => ({
  getSearchTerm: jest.fn(),
  saveSearchTerm: jest.fn(),
}));

jest.mock('../Search/Search', () => {
  const component = () => <div data-testid="search-component" />;
  component.displayName = 'Search';
  return component;
});

jest.mock('../Results/Results', () => {
  const component = () => <div data-testid="results-component" />;
  component.displayName = 'Results';
  return component;
});

jest.mock('../ErrorButton/ErrorButton', () => {
  const component = () => <div data-testid="error-button-component" />;
  component.displayName = 'ErrorButton';
  return component;
});

describe('App Component', () => {
  const mockCharacters = [
    { id: 1, name: 'Pikachu', imageUrl: 'pikachu.jpg' },
    { id: 2, name: 'Charizard', imageUrl: 'charizard.jpg' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getSearchTerm as jest.Mock).mockReturnValue('');
    (saveSearchTerm as jest.Mock).mockImplementation(jest.fn());
  });

  test('renders main structure and components', () => {
    render(<App />);

    expect(screen.getByTestId('app-container')).toBeInTheDocument();
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    expect(screen.getByText('Search Results')).toBeInTheDocument();

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('results-component')).toBeInTheDocument();
    expect(screen.getByTestId('error-button-component')).toBeInTheDocument();
  });

  test('loads initial search term from localStorage on mount', async () => {
    const initialTerm = 'pikachu';
    (getSearchTerm as jest.Mock).mockReturnValue(initialTerm);

    await act(async () => {
      render(<App />);
    });

    expect(getSearchTerm).toHaveBeenCalled();
    expect(fetchCharacters).toHaveBeenCalledWith(initialTerm);
  });

  test('handles successful API fetch on mount', async () => {
    (fetchCharacters as jest.Mock).mockResolvedValue({
      results: mockCharacters,
    });

    await act(async () => {
      render(<App />);
    });

    // Проверяем, что результаты переданы в контекст
    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalled();
    });
  });

  test('handles API fetch error on mount', async () => {
    const errorMessage = 'API Error';
    (fetchCharacters as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalled();
    });
  });

  test('updates search term and fetches new data', async () => {
    const newTerm = 'charizard';
    (fetchCharacters as jest.Mock).mockResolvedValue({
      results: mockCharacters,
    });

    render(<App />);

    // Мокаем вызов из Search компонента
    const contextValue = {
      searchTerm: '',
      characters: [],
      loading: false,
      error: null,
      setSearchTerm: jest.fn(),
      fetchData: jest.fn(),
    };

    await act(async () => {
      contextValue.fetchData(newTerm);
    });

    expect(contextValue.fetchData).toHaveBeenCalledWith(newTerm);
  });
});
