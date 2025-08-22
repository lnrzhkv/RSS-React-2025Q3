import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PokemonDetails from './PokemonDetails';
import { useGetPokemonDetailsQuery } from '../../shared/api/apiSlice';
import { Provider } from 'react-redux';
import { store } from '../../shared/store/store';

jest.mock('../../shared/api/apiSlice', () => ({
  ...jest.requireActual('../../shared/api/apiSlice'),
  useGetPokemonDetailsQuery: jest.fn(),
}));

const mockHook = useGetPokemonDetailsQuery as jest.Mock;

const defaultHookReturn = {
  data: null,
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
  beforeEach(() => {
    jest.clearAllMocks();
    mockHook.mockReturnValue(defaultHookReturn);
  });

  function renderWithId(characterId?: string) {
    const initialEntries = characterId
      ? [`/?characterId=${characterId}`]
      : ['/'];
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Provider store={store}>
          <PokemonDetails />
        </Provider>
      </MemoryRouter>
    );
  }

  it('does not render anything when characterId is missing', () => {
    renderWithId();
    expect(screen.queryByTestId('box')).toBeNull();
    expect(screen.queryByTestId('details-close')).toBeNull();
  });

  it('renders close and refresh buttons when characterId is present', () => {
    renderWithId('1');

    expect(screen.getByTestId('box')).toBeInTheDocument();
    expect(screen.getByTestId('details-close')).toBeInTheDocument();
    expect(screen.getByTestId('details-refresh-button')).toBeInTheDocument();
  });

  it('shows loader while loading', () => {
    mockHook.mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    renderWithId('1');
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows error message on API error', () => {
    mockHook.mockReturnValue({
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
    mockHook.mockReturnValue({
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

  it('calls refetch when refresh button is clicked', async () => {
    const refetchMock = jest.fn();
    mockHook.mockReturnValue({
      ...defaultHookReturn,
      data: mockData,
      refetch: refetchMock,
    });

    renderWithId('1');
    fireEvent.click(screen.getByTestId('details-refresh-button'));

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it('closes details panel on close button click', async () => {
    mockHook.mockReturnValue({
      ...defaultHookReturn,
      data: mockData,
    });

    renderWithId('1');
    fireEvent.click(screen.getByTestId('details-close'));

    await waitFor(() => {
      expect(screen.queryByTestId('box')).toBeNull();
    });
  });
});
