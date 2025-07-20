export interface PokemonType {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: PokemonType;
  }[];
}

export interface ApiResponse {
  results: Character[];
  count: number;
}
