import axios, { type AxiosResponse } from 'axios';
import { API_BASE } from '../../services/api/constants';
import type {
  Character,
  CharactersResponse,
  CharacterWithImage,
} from 'src/services/api/types';

const fallback = {
  results: [],
  count: 0,
  previous: null,
  next: null,
} satisfies CharactersResponse;

const normazileResponse = (characterResponse: AxiosResponse<Character>) => {
  return {
    results: [
      {
        id: characterResponse.data.id,
        name: characterResponse.data.name,
        height: characterResponse.data.height,
        weight: characterResponse.data.weight,
        types: characterResponse.data.types,
        image: String(
          Object?.values(characterResponse?.data?.sprites)?.filter(Boolean)?.[0]
        ),
      },
    ] satisfies CharacterWithImage[],
    count: 1,
    previous: null,
    next: null,
  };
};

export const fetchCharacterBySearchString = async (
  searchTerm = ''
): Promise<CharactersResponse> => {
  try {
    const response: AxiosResponse<Character> = await axios.get(
      `${API_BASE}/pokemon/${searchTerm.toLowerCase()}`
    );

    return normazileResponse(response);
  } catch {
    return fallback;
  }
};
