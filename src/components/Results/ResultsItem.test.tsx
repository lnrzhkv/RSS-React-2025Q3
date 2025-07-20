import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultsItem from './ResultsItem';
import type { Character } from '../../services/api/types';

describe('ResultsItem Component', () => {
  const mockCharacter: Character = {
    id: 1,
    name: 'Pikachu',
    height: 40,
    weight: 60,
    types: [
      {
        slot: 1,
        type: {
          name: 'electric',
          url: 'https://pokeapi.co/api/v2/type/13/',
        },
      },
      {
        slot: 2,
        type: {
          name: 'flying',
          url: 'https://pokeapi.co/api/v2/type/3/',
        },
      },
    ],
  };

  test('renders character card with correct data', () => {
    render(<ResultsItem character={mockCharacter} />);

    const card = screen.getByTestId(`character-card-${mockCharacter.id}`);
    expect(card).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    expect(
      screen.getByText(
        `Height: ${mockCharacter.height}, Weight: ${mockCharacter.weight}`
      )
    ).toBeInTheDocument();

    const typeText = screen.getByText(/Types:/).textContent;
    mockCharacter.types.forEach((type) => {
      expect(typeText).toContain(type.type.name);
    });
  });

  test('handles character with single type', () => {
    const singleTypeCharacter: Character = {
      id: 2,
      name: 'Bulbasaur',
      height: 70,
      weight: 69,
      types: [
        {
          slot: 1,
          type: {
            name: 'grass',
            url: 'https://pokeapi.co/api/v2/type/12/',
          },
        },
      ],
    };

    render(<ResultsItem character={singleTypeCharacter} />);
    const typeText = screen.getByText(/Types:/).textContent;
    expect(typeText).toContain('grass');
  });

  test('handles character without types', () => {
    const noTypeCharacter: Character = {
      id: 3,
      name: 'Missingno',
      height: 0,
      weight: 0,
      types: [],
    };

    render(<ResultsItem character={noTypeCharacter} />);
    expect(screen.getByText('Types:')).toBeInTheDocument();
  });

  test('renders all types regardless of order', () => {
    const multiTypeCharacter: Character = {
      id: 4,
      name: 'Charizard',
      height: 170,
      weight: 905,
      types: [
        {
          slot: 2,
          type: {
            name: 'flying',
            url: 'https://pokeapi.co/api/v2/type/3/',
          },
        },
        {
          slot: 1,
          type: {
            name: 'fire',
            url: 'https://pokeapi.co/api/v2/type/10/',
          },
        },
      ],
    };

    render(<ResultsItem character={multiTypeCharacter} />);
    const typeText = screen.getByText(/Types:/).textContent;
    expect(typeText).toContain('fire');
    expect(typeText).toContain('flying');
  });
});
