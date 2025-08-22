import { render, screen, fireEvent } from '@testing-library/react';
import PokemonList from './PokemonList';
import { useSearchParams } from 'next/navigation.js';

jest.mock('@/components/PokemonList/PokemonListView.tsx', () => {
  return function MockListView({ children, searchValue }: unknown) {
    return (
      <div data-testid="list-view">
        LIST(searchValue=&quot;{searchValue}&quot;)
        {children}
      </div>
    );
  };
});
jest.mock('@/components/ResultPokemonList/ResultPokemonList.tsx', () => {
  return function MockResultList({ setIsDetailsOpen }) {
    return (
      <button
        data-testid="open-list-details"
        onClick={() => setIsDetailsOpen(true)}
      >
        Open List Details
      </button>
    );
  };
});
jest.mock('@/components/ResultPokemonSearch/ResultPokemonSearch.tsx', () => {
  return function MockResultSearch({ setIsDetailsOpen, searchValue }: unknown) {
    return (
      <div data-testid="search-view">
        SEARCH(searchValue=&quot;{searchValue}&quot;)
        <button
          data-testid="open-search-details"
          onClick={() => setIsDetailsOpen(true)}
        >
          Open Search Details
        </button>
      </div>
    );
  };
});
jest.mock('@/components/PokemonDetails/PokemonDetails.tsx', () => {
  return function MockDetails() {
    return <div data-testid="details-panel">DETAILS</div>;
  };
});
jest.mock('@/components/SelectedItemsFlyout/SelectedItemsFlyout.tsx', () => {
  return function MockFlyout() {
    return <div data-testid="flyout">FLYOUT</div>;
  };
});

jest.mock('next/navigation.js', () => ({
  __esModule: true,
  useSearchParams: jest.fn(),
}));

describe('PokemonList Component', () => {
  const mockUseSearchParams = useSearchParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithSearchTerm(term?: string) {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'searchTerm' ? (term ?? null) : null),
    });
    return render(<PokemonList />);
  }

  it('renders list view and flyout when no searchTerm', () => {
    renderWithSearchTerm(undefined);
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
    expect(screen.getByTestId('open-list-details')).toBeInTheDocument();
    expect(screen.getByTestId('flyout')).toBeInTheDocument();
    expect(screen.queryByTestId('details-panel')).toBeNull();
  });

  it('renders search view when searchTerm is present', () => {
    renderWithSearchTerm('pikachu');
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
    expect(screen.getByTestId('search-view')).toBeInTheDocument();

    expect(screen.getByTestId('flyout')).toBeInTheDocument();
    expect(screen.queryByTestId('details-panel')).toBeNull();
  });

  it('opens details panel when list child triggers it', () => {
    renderWithSearchTerm(undefined);

    fireEvent.click(screen.getByTestId('open-list-details'));

    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
  });

  it('opens details panel when search child triggers it', () => {
    renderWithSearchTerm('charmander');

    fireEvent.click(screen.getByTestId('open-search-details'));

    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
  });
});
