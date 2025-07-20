import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { fetchCharacters } from '../../services/api/api';
import { getSearchTerm, saveSearchTerm } from '../../utils/storage';

jest.mock('../../services/api/api', () => ({
  fetchCharacters: jest.fn(),
}));

jest.mock('../../utils/storage', () => ({
  getSearchTerm: jest.fn(),
  saveSearchTerm: jest.fn(),
}));

jest.mock('../Search/Search', () => {
  const component = () => <div data-testid="search-component" />;
  component.displayName = 'Search';
  return component;
});

jest.mock('../Results/Results', () => {
  const component = () => <div data-testid="results-component" />;
  component.displayName = 'Results';
  return component;
});

jest.mock('../ErrorButton/ErrorButton', () => {
  const component = () => <div data-testid="error-button-component" />;
  component.displayName = 'ErrorButton';
  return component;
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSearchTerm as jest.Mock).mockReturnValue('');
    (saveSearchTerm as jest.Mock).mockImplementation(jest.fn());
  });

  test('renders main structure', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });

  test('handles Error rejection', async () => {
    const errorMessage = 'API Error';
    (fetchCharacters as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      const contextData = JSON.parse(
        screen.getByTestId('app-container').getAttribute('data-context') || '{}'
      );
      expect(contextData.error).toBe(errorMessage);
      expect(contextData.loading).toBe(false);
      expect(contextData.characters).toEqual([]);
    });
  });

  test('handles string rejection', async () => {
    const errorMessage = 'Plain string error';
    (fetchCharacters as jest.Mock).mockRejectedValue(errorMessage);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      const contextData = JSON.parse(
        screen.getByTestId('app-container').getAttribute('data-context') || '{}'
      );
      expect(contextData.error).toBe('Unknown error');
    });
  });

  test('handles object rejection without message', async () => {
    const errorObj = { someField: 'value' };
    (fetchCharacters as jest.Mock).mockRejectedValue(errorObj);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      const contextData = JSON.parse(
        screen.getByTestId('app-container').getAttribute('data-context') || '{}'
      );
      expect(contextData.error).toBe('Unknown error');
    });
  });

  test('handles null rejection', async () => {
    (fetchCharacters as jest.Mock).mockRejectedValue(null);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      const contextData = JSON.parse(
        screen.getByTestId('app-container').getAttribute('data-context') || '{}'
      );
      expect(contextData.error).toBe('Unknown error');
    });
  });
});
