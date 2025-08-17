import { render, screen } from '@testing-library/react';
import ResultPokemonSearch from './ResultPokemonSearch';
import { useSearchPokemonQuery } from '../../shared/api/apiSlice';

jest.mock('@/shared/api/apiSlice.ts', () => ({
  useSearchPokemonQuery: jest.fn(),
}));

jest.mock('@/components/Results/Results.tsx', () => ({
  __esModule: true,
  default: ({ characters, isLoading, isError, setIsDetailsOpen }) => (
    <div
      data-testid="results-mock"
      data-characters={characters.map((c) => c.name).join(',')}
      data-is-loading={String(isLoading)}
      data-is-error={String(isError)}
      data-has-set-details={typeof setIsDetailsOpen === 'function'}
    />
  ),
}));

describe('ResultPokemonSearch', () => {
  const hookMock = useSearchPokemonQuery as jest.Mock;
  const dummySetter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call useSearchPokemonQuery with skip:true when searchValue is empty', () => {
    hookMock.mockReturnValue({
      isFetching: false,
      data: [{ name: 'One', image: 'url' }],
      isError: false,
    });

    render(
      <ResultPokemonSearch searchValue="" setIsDetailsOpen={dummySetter} />
    );

    expect(hookMock).toHaveBeenCalledWith('', { skip: true });

    const results = screen.getByTestId('results-mock');
    expect(results).toHaveAttribute('data-characters', 'One');
    expect(results).toHaveAttribute('data-is-loading', 'false');
    expect(results).toHaveAttribute('data-is-error', 'false');
    expect(results).toHaveAttribute('data-has-set-details', 'true');
  });

  it('should call useSearchPokemonQuery with skip:false when searchValue is non-empty', () => {
    const sample = [
      { name: 'Pikachu', image: 'pika.png' },
      { name: 'Squirtle', image: 'squi.png' },
    ];
    hookMock.mockReturnValue({
      isFetching: true,
      data: sample,
      isError: false,
    });

    render(
      <ResultPokemonSearch searchValue="pika" setIsDetailsOpen={dummySetter} />
    );

    expect(hookMock).toHaveBeenCalledWith('pika', { skip: false });

    const results = screen.getByTestId('results-mock');
    expect(results).toHaveAttribute('data-characters', 'Pikachu,Squirtle');
    expect(results).toHaveAttribute('data-is-loading', 'true');
    expect(results).toHaveAttribute('data-is-error', 'false');
    expect(results).toHaveAttribute('data-has-set-details', 'true');
  });

  it('should propagate isError=true to Results when hook returns error', () => {
    hookMock.mockReturnValue({
      isFetching: false,
      data: [],
      isError: true,
    });

    render(
      <ResultPokemonSearch
        searchValue="error-case"
        setIsDetailsOpen={dummySetter}
      />
    );

    expect(hookMock).toHaveBeenCalledWith('error-case', { skip: false });

    const results = screen.getByTestId('results-mock');
    expect(results).toHaveAttribute('data-is-error', 'true');
  });
});
