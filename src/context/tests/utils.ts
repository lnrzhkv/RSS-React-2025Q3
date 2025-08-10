import type { CharacterWithImage } from '../../shared/api/types';

export const mockCharacters: CharacterWithImage[] = [
  {
    id: 1,
    name: 'Pikachu',
    image: 'pikachu.png',
    height: 4,
    weight: 60,
    types: [
      {
        slot: 1,
        type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
      },
    ],
  },
  {
    id: 2,
    name: 'Bulbasaur',
    image: 'bulbasaur.png',
    height: 7,
    weight: 69,
    types: [
      {
        slot: 1,
        type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
      },
      {
        slot: 2,
        type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
      },
    ],
  },
  {
    id: 2,
    name: 'Charmander',
    image: 'charmander.png',
    height: 6,
    weight: 85,
    types: [
      {
        slot: 1,
        type: { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
      },
    ],
  },
];
