import { render, screen, fireEvent } from '@testing-library/react';
import ResultsItem from './ResultsItem';
import { useAppSelector, useAppDispatch } from '../../shared/store/hooks';
import { addItem, removeItem } from '../../shared/store/selectedItemsSlice';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('@/shared/store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('@/shared/store/selectedItemsSlice', () => ({
  addItem: jest.fn((item) => ({
    type: 'selectedItems/addItem',
    payload: item,
  })),
  removeItem: jest.fn((id) => ({
    type: 'selectedItems/removeItem',
    payload: id,
  })),
}));

jest.mock('./ResultsItemView', () => ({
  __esModule: true,
  default: ({ character, description, typesText }) => (
    <div
      data-testid="results-item-view"
      data-name={character.name}
      data-description={description}
      data-types-text={typesText}
    />
  ),
}));

describe('ResultsItem', () => {
  const mockUseSelector = useAppSelector as unknown as jest.Mock;
  const mockUseDispatch = useAppDispatch as unknown as jest.Mock;
  const tMock = jest.fn((key: string, opts) => {
    if (key === 'description') return `desc:${opts.height}:${opts.weight}`;
    if (key === 'heightWeight') return `hw:${opts.height}:${opts.weight}`;
    if (key === 'selectAriaLabel') return `select:${opts.name}`;
    return key;
  });
  const dispatchMock = jest.fn();
  const character = {
    id: 7,
    name: 'Squirtle',
    height: 5,
    weight: 90,
    types: [{ type: { name: 'water' } }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslations as jest.Mock).mockReturnValue(tMock);
    mockUseSelector.mockReturnValue([]);
    mockUseDispatch.mockReturnValue(dispatchMock);
  });

  it('renders correctly when not selected', () => {
    render(<ResultsItem character={character} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /select:Squirtle/,
    });
    expect(checkbox).not.toBeChecked();

    const view = screen.getByTestId('results-item-view');
    expect(view).toHaveAttribute('data-description', 'hw:5:90');
    expect(view).toHaveAttribute('data-types-text', 'water');
  });

  it('dispatches addItem when checkbox is checked', () => {
    render(<ResultsItem character={character} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /select:Squirtle/,
    });

    fireEvent.click(checkbox);

    expect(addItem).toHaveBeenCalledWith({
      id: '7',
      name: 'Squirtle',
      description: 'desc:5:90',
      detailsUrl: '/details/7',
    });

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'selectedItems/addItem',
      payload: {
        id: '7',
        name: 'Squirtle',
        description: 'desc:5:90',
        detailsUrl: '/details/7',
      },
    });
  });

  it('dispatches removeItem when checkbox is unchecked', () => {
    mockUseSelector.mockReturnValue([{ id: '7' }]);
    render(<ResultsItem character={character} />);

    const checkbox = screen.getByRole('checkbox', {
      name: /select:Squirtle/,
    });

    fireEvent.click(checkbox);

    expect(removeItem).toHaveBeenCalledWith('7');
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'selectedItems/removeItem',
      payload: '7',
    });
  });
});
