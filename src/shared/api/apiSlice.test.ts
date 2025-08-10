import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { pokemonApi, normalizeCharacter, normalizeDetails } from './apiSlice';
import type {
  Character,
  PokemonSpecies,
  PokemonsTypesReponseData,
} from './types';

type FetchMock = jest.Mock<Promise<Response>, [RequestInfo, RequestInit?]>;
const globalWithFetch = global as unknown as { fetch: FetchMock };

const makeResponse = <T>(body: T): Response => {
  const res = {
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
    clone() {
      return res;
    },
    headers: {
      get: () => null,
    },
  };
  return res as unknown as Response;
};

describe('normalizeCharacter utility', () => {
  it('should pick the first non-empty sprite URL', () => {
    const input: Character = {
      id: 42,
      name: 'test-mon',
      height: 5,
      weight: 10,
      types: [{ slot: 1, type: { name: 'fire', url: 'u' } }],
      sprites: {
        front_shiny: null,
        front_default: 'img1.png',
        back_default: 'img2.png',
      },
      image: '',
    };

    expect(normalizeCharacter(input)).toEqual({
      id: 42,
      name: 'test-mon',
      height: 5,
      weight: 10,
      types: input.types,
      image: 'img1.png',
    });
  });

  it('should return empty string if no valid sprites exist', () => {
    const input: Character = {
      id: 1,
      name: 'no-sprites',
      height: 0,
      weight: 0,
      types: [],
      sprites: { a: null, b: null } as Record<string, string | null>,
      image: '',
    };

    expect(normalizeCharacter(input).image).toBe('');
  });
});

describe('normalizeDetails utility', () => {
  const baseSpec: PokemonSpecies = {
    id: 7,
    name: 'speccy',
    order: 0,
    gender_rate: 0,
    capture_rate: 0,
    base_happiness: 64,
    is_baby: true,
    is_legendary: false,
    is_mythical: false,
    hatch_counter: 0,
    has_gender_differences: false,
    forms_switchable: true,
    growth_rate: { name: 'slow', url: '' },
    pokedex_numbers: [],
    egg_groups: [],
    color: { name: 'blue', url: '' },
    shape: { name: 'round', url: '' },
    evolves_from_species: null,
    evolution_chain: { url: '' },
    habitat: null,
    generation: { name: 'genI', url: '' },
    names: [],
    flavor_text_entries: [
      {
        flavor_text: 'Line1\fLine2',
        language: { name: 'en', url: '' },
        version: { name: 'v1', url: '' },
      },
      {
        flavor_text: 'Texto es',
        language: { name: 'es', url: '' },
        version: { name: 'v1', url: '' },
      },
    ],
    form_descriptions: [
      { description: 'Form desc', language: { name: 'en', url: '' } },
    ],
    genera: [],
    varieties: [],
  };

  it('should map boolean flags to "Yes"/"No" and strip form-feed chars', () => {
    const result = normalizeDetails(baseSpec);
    expect(result).toEqual({
      name: 'speccy',
      baseHappyness: 64,
      isBaby: 'Yes',
      isLegendary: 'No',
      isMythical: 'No',
      formSwitchable: 'Yes',
      growthRate: 'slow',
      color: 'blue',
      shape: 'round',
      generation: 'genI',
      flavorText: 'Line1Line2',
      formDescription: 'Form desc',
    });
  });

  it('should return null for missing English flavor or form descriptions', () => {
    const broken: PokemonSpecies = {
      ...baseSpec,
      flavor_text_entries: [
        {
          flavor_text: 'solo es',
          language: { name: 'es', url: '' },
          version: { name: '', url: '' },
        },
      ],
      form_descriptions: [],
    };

    const result = normalizeDetails(broken);
    expect(result.flavorText).toBeNull();
    expect(result.formDescription).toBeNull();
  });
});

describe('RTK Query endpoints via store.dispatch().unwrap()', () => {
  const store = configureStore({
    reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
    middleware: (getDefault) => getDefault().concat(pokemonApi.middleware),
  });
  setupListeners(store.dispatch);

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getPokemons endpoint', () => {
    const baseResponse: PokemonsTypesReponseData = {
      results: [{ name: 'foo', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      count: 7,
      next: 'nx',
      previous: 'pv',
    };

    const detailChar: Character = {
      id: 1,
      name: 'foo',
      height: 1,
      weight: 1,
      types: [],
      sprites: { front_default: 'img.png' },
      image: '',
    };

    it('should normalize the pokemon list and details on success', async () => {
      let call = 0;
      globalWithFetch.fetch = jest.fn().mockImplementation(() => {
        call++;
        const body = call === 1 ? baseResponse : detailChar;
        return Promise.resolve(makeResponse(body));
      }) as FetchMock;

      await expect(
        store.dispatch(pokemonApi.endpoints.getPokemons.initiate(2)).unwrap()
      ).resolves.toEqual({
        results: [normalizeCharacter(detailChar)],
        count: 7,
        next: 'nx',
        previous: 'pv',
      });

      expect(globalWithFetch.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('searchPokemon endpoint', () => {
    it('should wrap normalized character in an array', async () => {
      const char: Character = {
        id: 2,
        name: 'bar',
        height: 2,
        weight: 2,
        types: [],
        sprites: { front_default: 'img2.png' },
        image: '',
      };

      globalWithFetch.fetch = jest
        .fn()
        .mockResolvedValue(makeResponse(char)) as FetchMock;

      await expect(
        store
          .dispatch(pokemonApi.endpoints.searchPokemon.initiate('Foo'))
          .unwrap()
      ).resolves.toEqual([normalizeCharacter(char)]);
    });
  });

  describe('getPokemonDetails endpoint', () => {
    it('should apply normalizeDetails to the response', async () => {
      const spec: PokemonSpecies = {
        id: 3,
        name: 'baz',
        order: 0,
        gender_rate: 0,
        capture_rate: 0,
        base_happiness: 5,
        is_baby: false,
        is_legendary: true,
        is_mythical: false,
        hatch_counter: 0,
        has_gender_differences: false,
        forms_switchable: false,
        growth_rate: { name: 'fast', url: '' },
        pokedex_numbers: [],
        egg_groups: [],
        color: { name: 'red', url: '' },
        shape: { name: 'square', url: '' },
        evolves_from_species: null,
        evolution_chain: { url: '' },
        habitat: null,
        generation: { name: 'genII', url: '' },
        names: [],
        flavor_text_entries: [],
        form_descriptions: [],
        genera: [],
        varieties: [],
      };

      globalWithFetch.fetch = jest
        .fn()
        .mockResolvedValue(makeResponse(spec)) as FetchMock;

      await expect(
        store
          .dispatch(pokemonApi.endpoints.getPokemonDetails.initiate(3))
          .unwrap()
      ).resolves.toEqual(normalizeDetails(spec));
    });
  });
});
