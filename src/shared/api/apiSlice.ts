import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Character,
  CharactersResponse,
  CharacterWithImage,
  PokemonDetails,
  PokemonSpecies,
  PokemonsTypesReponseData,
} from './types';
import { API_BASE } from './constants';

const normalizeCharacter = (data: Character): CharacterWithImage => ({
  id: data.id,
  name: data.name,
  height: data.height,
  weight: data.weight,
  types: data.types,
  image: String(Object.values(data?.sprites)?.filter(Boolean)?.[0] || ''),
});

const normalizeDetails = (dirty: PokemonSpecies): PokemonDetails => ({
  name: dirty?.name ?? null,
  baseHappyness: dirty?.base_happiness ?? null,
  isBaby: dirty?.is_baby ? 'Yes' : 'No',
  isLegendary: dirty?.is_legendary ? 'Yes' : 'No',
  isMythical: dirty?.is_mythical ? 'Yes' : 'No',
  formSwitchable: dirty.forms_switchable ? 'Yes' : 'No',
  growthRate: dirty?.growth_rate?.name ?? null,
  color: dirty?.color?.name ?? null,
  shape: dirty?.shape?.name ?? null,
  generation: dirty?.generation?.name ?? null,
  flavorText:
    dirty?.flavor_text_entries
      ?.find((text) => text.language.name.toLowerCase() === 'en')
      ?.flavor_text.replace(/\f/gi, '') ?? null,
  formDescription: dirty?.form_descriptions?.[0]?.description ?? null,
});

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  tagTypes: ['PokemonList', 'PokemonDetails', 'Search'],
  endpoints: (builder) => ({
    getPokemons: builder.query<CharactersResponse, number>({
      query: (page) => {
        const limit = 10;
        const offset = (page - 1) * limit;
        return `pokemon?limit=${limit}&offset=${offset}`;
      },
      async transformResponse(baseResponse: PokemonsTypesReponseData) {
        try {
          const detailedRequests = baseResponse.results.map((pokemon) =>
            fetch(`${pokemon.url}`).then((res) => res.json())
          );
          const detailedResponses = await Promise.all(detailedRequests);

          return {
            results: detailedResponses.map(normalizeCharacter),
            count: baseResponse.count,
            next: baseResponse.next,
            previous: baseResponse.previous,
          };
        } catch {
          throw new Error('Failed to normalize pokemon data');
        }
      },
      providesTags: (result, _, page) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'PokemonList' as const,
                id,
              })),
              { type: 'PokemonList', id: `PAGE_${page}` },
            ]
          : [{ type: 'PokemonList', id: `PAGE_${page}` }],
    }),
    searchPokemon: builder.query<CharacterWithImage[], string>({
      query: (name) => `pokemon/${name.toLowerCase()}`,
      transformResponse: (response: Character) => [
        normalizeCharacter(response),
      ],
      providesTags: (_, __, name) =>
        name ? [{ type: 'Search', id: name }] : ['Search'],
    }),
    getPokemonDetails: builder.query<PokemonDetails, string | number>({
      query: (id) => `pokemon-species/${id}`,
      transformResponse: normalizeDetails,
      providesTags: (_, __, id) => [{ type: 'PokemonDetails', id }],
    }),
  }),
});

export const {
  useGetPokemonsQuery,
  useLazyGetPokemonsQuery,
  useSearchPokemonQuery,
  useLazySearchPokemonQuery,
  useGetPokemonDetailsQuery,
  util: { invalidateTags },
} = pokemonApi;

export { normalizeCharacter, normalizeDetails };
