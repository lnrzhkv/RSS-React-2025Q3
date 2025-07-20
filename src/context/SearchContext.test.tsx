import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchContext } from './SearchContext';
import type { SearchContextProps } from './SearchContext';
import type { Character } from '../services/api/types';

describe('SearchContext', () => {
  const mockCharacters: Character[] = [
    { id: 1, name: 'Pikachu', height: 40, weight: 60, types: [] },
  ];

  test('provides default context values', () => {
    const TestComponent = () => {
      return (
        <SearchContext.Consumer>
          {(context) => (
            <>
              <div data-testid="searchTerm">{context.searchTerm}</div>
              <div data-testid="characters">{context.characters.length}</div>
              <div data-testid="loading">{context.loading.toString()}</div>
              <div data-testid="error">{context.error || ''}</div>
            </>
          )}
        </SearchContext.Consumer>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('searchTerm')).toHaveTextContent('');
    expect(getByTestId('characters')).toHaveTextContent('0');
    expect(getByTestId('loading')).toHaveTextContent('false');
    expect(getByTestId('error')).toHaveTextContent('');
  });

  test('allows values to be overridden', () => {
    const mockContext: SearchContextProps = {
      searchTerm: 'pikachu',
      characters: mockCharacters,
      loading: true,
      error: 'Test error',
      setSearchTerm: jest.fn(),
      fetchData: jest.fn(),
    };

    const TestComponent = () => {
      return (
        <SearchContext.Provider value={mockContext}>
          <SearchContext.Consumer>
            {(context) => (
              <>
                <div data-testid="searchTerm">{context.searchTerm}</div>
                <div data-testid="characters">{context.characters.length}</div>
                <div data-testid="loading">{context.loading.toString()}</div>
                <div data-testid="error">{context.error || ''}</div>
              </>
            )}
          </SearchContext.Consumer>
        </SearchContext.Provider>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('searchTerm')).toHaveTextContent('pikachu');
    expect(getByTestId('characters')).toHaveTextContent('1');
    expect(getByTestId('loading')).toHaveTextContent('true');
    expect(getByTestId('error')).toHaveTextContent('Test error');
  });

  test('provides working setSearchTerm function', () => {
    const mockSetSearchTerm = jest.fn();
    const mockContext: SearchContextProps = {
      searchTerm: '',
      characters: [],
      loading: false,
      error: null,
      setSearchTerm: mockSetSearchTerm,
      fetchData: jest.fn(),
    };

    const TestComponent = () => {
      return (
        <SearchContext.Provider value={mockContext}>
          <SearchContext.Consumer>
            {(context) => (
              <button
                data-testid="test-button"
                onClick={() => context.setSearchTerm('new term')}
              >
                Click
              </button>
            )}
          </SearchContext.Consumer>
        </SearchContext.Provider>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    act(() => {
      getByTestId('test-button').click();
    });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('new term');
  });

  test('provides working fetchData function', async () => {
    const mockFetchData = jest.fn().mockResolvedValue(undefined);
    const mockContext: SearchContextProps = {
      searchTerm: '',
      characters: [],
      loading: false,
      error: null,
      setSearchTerm: jest.fn(),
      fetchData: mockFetchData,
    };

    const TestComponent = () => {
      return (
        <SearchContext.Provider value={mockContext}>
          <SearchContext.Consumer>
            {(context) => (
              <button
                data-testid="test-button"
                onClick={() => context.fetchData('search term')}
              >
                Click
              </button>
            )}
          </SearchContext.Consumer>
        </SearchContext.Provider>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    await act(async () => {
      getByTestId('test-button').click();
    });

    expect(mockFetchData).toHaveBeenCalledWith('search term');
  });
});
