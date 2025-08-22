import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PokemonDetails from './PokemonDetails';
import { useGetPokemonDetailsQuery } from '../../shared/api/apiSlice';
import { Provider } from 'react-redux';
import { makeStore } from '../../shared/store/store';

import { useRouter } from '../../shared/lib/navigation';
import { useSearchParams } from 'next/navigation.js';

jest.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/shared/api/apiSlice', () => ({
  ...jest.requireActual('@/shared/api/apiSlice'),
  useGetPokemonDetailsQuery: jest.fn(),
}));

jest.mock('next/navigation.js', () => ({
  __esModule: true,
  useSearchParams: jest.fn(),
}));

jest.mock('@/shared/lib/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const mockGetDetails = useGetPokemonDetailsQuery as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

const defaultHookReturn = {
  data: {},
  isLoading: false,
  isError: false,
  error: null,
  isFetching: false,
  refetch: jest.fn(),
};

const mockData = {
  name: 'Pikachu',
  flavorText: 'Electric mouse',
  formDescription: 'Cute',
  baseHappyness: 70,
  color: 'yellow',
  generation: 'I',
  growthRate: 'medium',
  shape: 'quadruped',
  formSwitchable: 'Yes',
  isBaby: 'No',
  isLegendary: 'No',
  isMythical: 'No',
};

describe('PokemonDetails Component', () => {
  let mockParams: { get: jest.Mock; toString: jest.Mock };
  let mockRouter: { replace: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetDetails.mockReturnValue(defaultHookReturn);

    mockParams = {
      get: jest.fn(),
      toString: jest.fn(),
    };
    mockUseSearchParams.mockReturnValue(mockParams);

    mockRouter = {
      replace: jest.fn(),
    };
    mockUseRouter.mockReturnValue(mockRouter);
  });

  function renderWithId(id?: string) {
    mockParams.get.mockReturnValue(id ?? null);
    mockParams.toString.mockReturnValue(id ? `characterId=${id}` : '');
    return render(
      <Provider store={makeStore()}>
        <PokemonDetails setIsDetailsOpen={jest.fn()} />
      </Provider>
    );
  }

  it('does not render anything when characterId is missing', () => {
    renderWithId();
    expect(screen.queryByTestId('details-container')).toBeNull();
    expect(screen.queryByTestId('details-close')).toBeNull();
  });

  it('renders close and refresh buttons when characterId is present', () => {
    renderWithId('1');

    expect(screen.getByTestId('details-close')).toBeInTheDocument();
    expect(screen.getByTestId('details-refresh-button')).toBeInTheDocument();
  });

  it('shows loader while loading', () => {
    mockGetDetails.mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    renderWithId('1');
  });

  it('shows error message on API error', () => {
    mockGetDetails.mockReturnValue({
      ...defaultHookReturn,
      isError: true,
      error: { data: { error: 'Not found' } },
    });

    renderWithId('1');
    expect(screen.getByTestId('details-error')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('renders all details when data is loaded', () => {
    mockGetDetails.mockReturnValue({
      ...defaultHookReturn,
      data: mockData,
    });

    renderWithId('1');

    expect(screen.getByTestId('details-name')).toHaveTextContent('Pikachu');
    expect(screen.getByTestId('details-flavor')).toHaveTextContent(
      'Electric mouse'
    );
    expect(screen.getByTestId('details-form-desc')).toHaveTextContent('Cute');

    const items = screen.getAllByTestId('details-list-item');
    expect(items).toHaveLength(9);

    items.forEach((li) => {
      const spans = li.querySelectorAll('span');
      expect(spans.length).toBe(2);
    });
  });

  it('closes details panel on close button click', async () => {
    mockGetDetails.mockReturnValue({
      ...defaultHookReturn,
      data: mockData,
    });

    const { rerender } = renderWithId('1');

    fireEvent.click(screen.getByTestId('details-close'));

    expect(mockRouter.replace).toHaveBeenCalledWith('/?');

    mockParams.get.mockReturnValue(null);
    mockParams.toString.mockReturnValue('');

    rerender(
      <Provider store={makeStore()}>
        <PokemonDetails setIsDetailsOpen={jest.fn()} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('details-container')).toBeNull();
    });
  });
});
