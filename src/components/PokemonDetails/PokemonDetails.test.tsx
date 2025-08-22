import { render, screen, fireEvent } from '@testing-library/react';
import PokemonDetails from './PokemonDetails';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';
import { useLocation } from 'react-router-dom';
import usePokemonDetails from './hooks/usePokemonDetails';

jest.mock('../../context/hooks/useGlobalContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
jest.mock('./hooks/usePokemonDetails');

const mockSetIsDetailsOpen = jest.fn();

const renderWithContext = (
  hookData: ReturnType<typeof usePokemonDetails>,
  isDetailsOpen = true,
  search = '?characterId=1'
) => {
  (useGlobalContext as jest.Mock).mockReturnValue({
    setIsDetailsOpen: mockSetIsDetailsOpen,
    isDetailsOpen,
  });
  (useLocation as jest.Mock).mockReturnValue({ search });
  (usePokemonDetails as jest.Mock).mockReturnValue(hookData);
  return render(<PokemonDetails />);
};

describe('PokemonDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if isDetailsOpen is false', () => {
    renderWithContext(
      { details: undefined, error: null, loading: false },
      false
    );
    expect(screen.queryByTestId('details-container')).toBeNull();
  });

  it('renders loader if loading', () => {
    renderWithContext({ details: undefined, error: null, loading: true });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error if error', () => {
    renderWithContext({ details: undefined, error: 'fail', loading: false });
    expect(screen.getByTestId('details-error')).toBeInTheDocument();
    expect(screen.getByText('fail')).toBeInTheDocument();
  });

  it('renders details and closes on click', () => {
    renderWithContext({
      details: {
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
      },
      loading: false,
      error: null,
    });
    expect(screen.getByTestId('details-name')).toHaveTextContent('Pikachu');
    expect(screen.getByTestId('details-flavor')).toHaveTextContent(
      'Electric mouse'
    );
    expect(screen.getByTestId('details-form-desc')).toHaveTextContent('Cute');
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('details-list-item').length).toBeGreaterThan(
      0
    );
    fireEvent.click(screen.getByTestId('details-close'));
    expect(mockSetIsDetailsOpen).toHaveBeenCalledWith(false);
  });
});
