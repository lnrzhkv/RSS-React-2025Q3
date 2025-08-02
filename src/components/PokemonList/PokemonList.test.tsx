import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokemonList from './PokemonList';
import { Provider } from 'react-redux';
import { store } from '../../shared/store';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';

// Мокируем только хук контекста
jest.mock('../../context/hooks/useGlobalContext', () => ({
  useGlobalContext: jest.fn(),
}));

// Создаем мок-функцию
const mockUseGlobalContext = useGlobalContext as jest.Mock;

describe('PokemonList', () => {
  const mockContext = {
    characters: Array(10)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        name: `Pikachu ${index + 1}`,
        height: 4,
        weight: 60,
        image: 'pikachu.png',
        types: [],
      })),
    error: null,
    loading: false,
    isDetailsOpen: false,
    searchValue: '',
    theme: 'light' as const,
    toggleTheme: jest.fn(),
    onChangeSearchValue: jest.fn(),
    fetchPokemons: jest.fn(),
    fetchCharacterBySearch: jest.fn(),
    setIsDetailsOpen: jest.fn(),
    pagination: {
      currentPage: '1',
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
      onPreviousPage: jest.fn(),
      onNextPage: jest.fn(),
      onPageChange: jest.fn(),
    },
  };

  beforeEach(() => {
    mockUseGlobalContext.mockReturnValue(mockContext);
  });

  const renderPokemonList = () => {
    return render(
      <MemoryRouter>
        <Provider store={store}>
          <PokemonList />
        </Provider>
      </MemoryRouter>
    );
  };

  it('renders main layout structure', () => {
    renderPokemonList();

    expect(screen.getByTestId('pokemonlist-content')).toBeInTheDocument();
    expect(screen.getByTestId('pokemonlist-listcontainer')).toBeInTheDocument();
    expect(screen.getByTestId('pokemonlist-topsection')).toBeInTheDocument();
    expect(screen.getByTestId('pokemonlist-footer')).toBeInTheDocument();
  });

  it('renders core components', () => {
    renderPokemonList();

    // Проверяем основные элементы интерфейса
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search Pokémon...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders characters list', () => {
    renderPokemonList();

    // Проверяем, что отображаются персонажи
    mockContext.characters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });

  it('shows loader when loading', () => {
    mockUseGlobalContext.mockReturnValue({
      ...mockContext,
      loading: true,
      characters: [],
    });

    renderPokemonList();

    // Проверяем лоадер
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    // Заголовок "Search Results" остается видимым
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  it('shows error message when error exists', () => {
    const errorMessage = 'Test error message';
    mockUseGlobalContext.mockReturnValue({
      ...mockContext,
      error: errorMessage,
    });

    renderPokemonList();

    // Проверяем сообщение об ошибке
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // Заголовок "Search Results" остается видимым
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  it('shows no results message when characters empty', () => {
    mockUseGlobalContext.mockReturnValue({
      ...mockContext,
      characters: [],
    });

    renderPokemonList();

    // Проверяем сообщение об отсутствии результатов
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    // Заголовок "Search Results" остается видимым
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });
});
