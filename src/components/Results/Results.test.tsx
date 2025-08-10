import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Results from './Results';
import { useSearchParams } from 'react-router-dom';
import type { CharacterWithImage } from '../../shared/api/types';

jest.mock('./Loader', () => {
  const MockLoader: React.FC = () => <div data-testid="loader-mock" />;
  MockLoader.displayName = 'MockLoader';
  return MockLoader;
});

jest.mock('./ResultsItem', () => {
  const MockResultsItem: React.FC<{ character: CharacterWithImage }> = ({
    character,
  }) => <div data-testid={`result-item-${character.id}`}>{character.name}</div>;
  MockResultsItem.displayName = 'MockResultsItem';
  return MockResultsItem;
});

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('Results', () => {
  const setSearchParams = jest.fn();
  const fakeSearchParams = new URLSearchParams('foo=bar');

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      fakeSearchParams,
      setSearchParams,
    ]);
  });

  it('renders Loader when loading=true and characters empty', () => {
    render(
      <Results
        characters={[]}
        loading={true}
        error={null}
        setIsDetailsOpen={jest.fn()}
      />
    );
    expect(screen.getByTestId('loader-mock')).toBeInTheDocument();
  });

  it('renders error message when error is set', () => {
    render(
      <Results
        characters={[]}
        loading={false}
        error="Boom!"
        setIsDetailsOpen={jest.fn()}
      />
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Boom!')).toBeInTheDocument();
  });

  it('renders "No Pokémon found" when no characters, no loading/error', () => {
    render(
      <Results
        characters={[]}
        loading={false}
        error={null}
        setIsDetailsOpen={jest.fn()}
      />
    );
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
  });

  it('renders list of characters and handles clicks', () => {
    const characters: CharacterWithImage[] = [
      {
        id: 1,
        name: 'Pikachu',
        height: 4,
        weight: 6,
        image: 'img1',
        types: [],
      },
      {
        id: 2,
        name: 'Bulbasaur',
        height: 7,
        weight: 9,
        image: 'img2',
        types: [],
      },
    ];
    const setIsDetailsOpen = jest.fn();

    render(
      <Results
        characters={characters}
        loading={false}
        error={null}
        setIsDetailsOpen={setIsDetailsOpen}
      />
    );

    expect(screen.getByTestId('results-container')).toBeInTheDocument();

    characters.forEach((char, idx) => {
      const item = screen.getByTestId(`result-item-${char.id}`);
      expect(item).toHaveTextContent(char.name);

      fireEvent.click(item);

      const callArg = setSearchParams.mock.calls[idx][0] as URLSearchParams;
      expect(callArg.get('characterId')).toBe(String(char.id));

      expect(setIsDetailsOpen).toHaveBeenCalledWith(true);
    });
  });
});
