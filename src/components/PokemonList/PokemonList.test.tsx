import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokemonList from './PokemonList';
import { Provider } from 'react-redux';
import * as apiSlice from '../../shared/api/apiSlice';
import { store } from '../../shared/store/store';

jest.mock('../../shared/api/apiSlice', () => ({
  ...jest.requireActual('../../shared/api/apiSlice'),
  useLazyGetPokemonsQuery: jest.fn(),
  useLazySearchPokemonQuery: jest.fn(),
}));

const mockCharacters = Array(10)
  .fill(undefined)
  .map((_, idx) => ({
    id: idx + 1,
    name: `Pikachu ${idx + 1}`,
    height: 4,
    weight: 60,
    image: 'pikachu.png',
    types: [],
  }));

describe('PokemonList', () => {
  let mockTriggerGetPokemons: jest.Mock;
  let mockTriggerSearch: jest.Mock;

  beforeEach(() => {
    mockTriggerGetPokemons = jest.fn();
    mockTriggerSearch = jest.fn();

    (apiSlice.useLazyGetPokemonsQuery as jest.Mock).mockReturnValue([
      mockTriggerGetPokemons,
    ]);
    (apiSlice.useLazySearchPokemonQuery as jest.Mock).mockReturnValue([
      mockTriggerSearch,
    ]);

    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Provider store={store}>
          <PokemonList />
        </Provider>
      </MemoryRouter>
    );

  it('renders layout and core components with fetched characters', async () => {
    mockTriggerGetPokemons.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          results: mockCharacters,
          count: 20,
          next: 'next-url',
          previous: null,
        }),
    });

    renderComponent();

    await waitFor(() => {
      mockCharacters.forEach((char) => {
        expect(screen.getByText(char.name)).toBeInTheDocument();
      });
    });

    expect(screen.getByTestId('pokemonlist-content')).toBeInTheDocument();
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search Pokémon...')
    ).toBeInTheDocument();
  });

  it('shows loader while fetching data', async () => {
    mockTriggerGetPokemons.mockReturnValue({
      unwrap: () => new Promise(() => {}),
    });

    renderComponent();

    expect(await screen.findByTestId('loader')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    mockTriggerGetPokemons.mockReturnValue({
      unwrap: () => Promise.reject(new Error('fail')),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch pokemons')).toBeInTheDocument();
    });
  });

  it('shows "No Pokémon found" when list is empty', async () => {
    mockTriggerGetPokemons.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          results: [],
          count: 0,
          next: null,
          previous: null,
        }),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    });
  });
});
