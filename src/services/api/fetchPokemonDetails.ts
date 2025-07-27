import axios from 'axios';
import { API_BASE } from './constants';
import type { PokemonDetails, PokemonSpecies } from './types';

const normalizeDetails = (dirty: PokemonSpecies): PokemonDetails => {
  return {
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
  };
};
const fetchPokemonDetails = async (id: number | string) => {
  try {
    const response = await axios.get<PokemonSpecies>(
      `${API_BASE}/pokemon-species/${id}/`
    );

    return normalizeDetails(response.data);
  } catch {
    throw new Error('Description not available');
  }
};

export default fetchPokemonDetails;
