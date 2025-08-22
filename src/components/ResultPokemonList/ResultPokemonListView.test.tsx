import { render, screen } from '@testing-library/react';
import ResultPokemonListView from './ResultPokemonListView';

jest.mock('@/components/Pagination/Pagination', () => ({
  __esModule: true,
  default: (props) => (
    <div
      data-testid="pagination-mock"
      data-current-page={props.currentPage}
      data-total-pages={props.totalPages}
      data-has-prev={props.hasPrev}
      data-has-next={props.hasNext}
    />
  ),
}));

jest.mock('@/components/Results/ResultsView', () => ({
  __esModule: true,
  default: ({ characters }) => (
    <div data-testid="results-view">
      {characters.map((c) => c.name).join(',')}
    </div>
  ),
}));

describe('ResultPokemonListView', () => {
  const sampleResults = [
    { name: 'Bulbasaur', image: 'url1' },
    { name: 'Charmander', image: 'url2' },
  ];

  it('renders both top and bottom pagination when flags set', async () => {
    const element = await ResultPokemonListView({
      results: sampleResults,
      currentPage: 2,
      totalPages: 5,
      showPaginationTop: true,
      showPaginationBottom: true,
    });

    render(element);

    expect(
      screen.getByTestId('pokemonlist-pagination-top')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('pokemonlist-pagination-bottom')
    ).toBeInTheDocument();

    const topMock = screen
      .getByTestId('pokemonlist-pagination-top')
      .querySelector('[data-testid="pagination-mock"]');
    const bottomMock = screen
      .getByTestId('pokemonlist-pagination-bottom')
      .querySelector('[data-testid="pagination-mock"]');

    expect(topMock).toHaveAttribute('data-current-page', '2');
    expect(topMock).toHaveAttribute('data-total-pages', '5');
    expect(topMock).toHaveAttribute('data-has-prev', 'true');
    expect(topMock).toHaveAttribute('data-has-next', 'true');

    expect(bottomMock).toHaveAttribute('data-current-page', '2');
    expect(bottomMock).toHaveAttribute('data-total-pages', '5');
    expect(bottomMock).toHaveAttribute('data-has-prev', 'true');
    expect(bottomMock).toHaveAttribute('data-has-next', 'true');

    expect(screen.getByTestId('results-view')).toHaveTextContent(
      'Bulbasaur,Charmander'
    );
  });

  it('omits pagination wrappers when flags are false or undefined', async () => {
    const element = await ResultPokemonListView({
      results: sampleResults,
      currentPage: 1,
      totalPages: 3,
    });

    render(element);

    expect(screen.queryByTestId('pokemonlist-pagination-top')).toBeNull();
    expect(screen.queryByTestId('pokemonlist-pagination-bottom')).toBeNull();

    expect(screen.getByTestId('results-view')).toBeInTheDocument();
  });

  it('defaults totalPages to 1 and computes hasPrev/hasNext correctly', async () => {
    const element = await ResultPokemonListView({
      results: [],
      currentPage: 1,
      showPaginationTop: true,
    });

    render(element);

    const mockEl = screen
      .getByTestId('pokemonlist-pagination-top')
      .querySelector('[data-testid="pagination-mock"]');

    expect(mockEl).toHaveAttribute('data-current-page', '1');
    expect(mockEl).toHaveAttribute('data-total-pages', '1');
    expect(mockEl).toHaveAttribute('data-has-prev', 'false');
    expect(mockEl).toHaveAttribute('data-has-next', 'false');
  });
});
