import { render, screen, fireEvent } from '@testing-library/react';
import Results from './Results';
import { useRouter, usePathname } from '../../shared/lib/navigation.ts';
import { useSearchParams } from 'next/navigation.js';

jest.mock('@/shared/lib/navigation.ts', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next/navigation.js', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('./ResultsView.tsx', () => ({
  __esModule: true,
  default: ({ characters, isLoading, isError }) => (
    <div data-testid="results-view">
      {characters.map((c) => (
        <div data-character-id={c.id} key={c.id}>
          {c.name}
        </div>
      ))}
      {isLoading && <span data-testid="loading">Loading…</span>}
      {isError && <span data-testid="error">Error!</span>}
    </div>
  ),
}));

describe('Results component', () => {
  const mockReplace = jest.fn();
  const mockPathname = '/mypage';
  const mockParams = new URLSearchParams('foo=bar');
  const setIsDetailsOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
    (useSearchParams as jest.Mock).mockReturnValue(mockParams);
  });

  it('renders characters, loading and error indicators correctly', () => {
    const chars = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    const { rerender } = render(
      <Results
        characters={chars}
        setIsDetailsOpen={setIsDetailsOpen}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).toBeNull();
    expect(screen.queryByTestId('error')).toBeNull();

    rerender(
      <Results
        characters={[]}
        setIsDetailsOpen={setIsDetailsOpen}
        isLoading={true}
        isError={false}
      />
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('error')).toBeNull();

    rerender(
      <Results
        characters={[]}
        setIsDetailsOpen={setIsDetailsOpen}
        isLoading={false}
        isError={true}
      />
    );
    expect(screen.getByTestId('error')).toHaveTextContent('Error!');
    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('does nothing when clicking outside any character item', () => {
    render(
      <Results
        characters={[{ id: '42', name: 'Clark' }]}
        setIsDetailsOpen={setIsDetailsOpen}
      />
    );

    fireEvent.click(screen.getByTestId('results-view'));
    expect(mockReplace).not.toHaveBeenCalled();
    expect(setIsDetailsOpen).not.toHaveBeenCalled();
  });

  it('navigates and opens details when a character item is clicked', () => {
    render(
      <Results
        characters={[{ id: '123', name: 'Bulba' }]}
        setIsDetailsOpen={setIsDetailsOpen}
      />
    );

    fireEvent.click(screen.getByText('Bulba'));

    const expectedParams = new URLSearchParams('foo=bar');
    expectedParams.set('characterId', '123');
    const expectedUrl = `${mockPathname}?${expectedParams.toString()}`;

    expect(mockReplace).toHaveBeenCalledWith(expectedUrl);
    expect(setIsDetailsOpen).toHaveBeenCalledWith(true);
  });
});
