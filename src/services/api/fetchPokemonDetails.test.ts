import fetchPokemonDetails from './fetchPokemonDetails';
import axios from 'axios';

describe('fetchPokemonDetails', () => {
  it('throws error on fetch fail', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('fail'));
    await expect(fetchPokemonDetails(1)).rejects.toThrow(
      'Description not available'
    );
  });

  it('returns normalized details with all fields', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        name: 'pikachu',
        base_happiness: 70,
        is_baby: true,
        is_legendary: false,
        is_mythical: false,
        forms_switchable: true,
        growth_rate: { name: 'medium' },
        color: { name: 'yellow' },
        shape: { name: 'quadruped' },
        generation: { name: 'generation-i' },
        flavor_text_entries: [
          { language: { name: 'en' }, flavor_text: 'Electric\fMouse' },
          { language: { name: 'fr' }, flavor_text: 'Souris' },
        ],
        form_descriptions: [{ description: 'A mouse Pokémon.' }],
      },
    });
    const result = await fetchPokemonDetails(25);
    expect(result).toEqual({
      name: 'pikachu',
      baseHappyness: 70,
      isBaby: 'Yes',
      isLegendary: 'No',
      isMythical: 'No',
      formSwitchable: 'Yes',
      growthRate: 'medium',
      color: 'yellow',
      shape: 'quadruped',
      generation: 'generation-i',
      flavorText: 'ElectricMouse',
      formDescription: 'A mouse Pokémon.',
    });
  });

  it('handles missing/false/null fields', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        is_baby: false,
        is_legendary: true,
        is_mythical: true,
        forms_switchable: false,
        flavor_text_entries: [
          { language: { name: 'fr' }, flavor_text: 'Souris' },
        ],
      },
    });
    const result = await fetchPokemonDetails(1);
    expect(result).toEqual({
      name: null,
      baseHappyness: null,
      isBaby: 'No',
      isLegendary: 'Yes',
      isMythical: 'Yes',
      formSwitchable: 'No',
      growthRate: null,
      color: null,
      shape: null,
      generation: null,
      flavorText: null,
      formDescription: null,
    });
  });
});
