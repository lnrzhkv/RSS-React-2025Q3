import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectedItemsFlyout from './SelectedItemsFlyout';
import { useAppSelector, useAppDispatch } from '../../shared/store/hooks';
import { clearItems } from '../../shared/store/selectedItemsSlice';
import { generateCSV } from '../../shared/actions/generate-csv';
import { generateCSVBlob } from '../../shared/actions/generate-csv.client';

jest.mock('@/shared/store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('@/shared/store/selectedItemsSlice', () => ({
  clearItems: jest.fn(() => ({ type: 'selectedItems/clearItems' })),
}));

jest.mock('@/shared/actions/generate-csv', () => ({
  generateCSV: jest.fn(),
}));
jest.mock('../../shared/actions/generate-csv.client', () => ({
  generateCSVBlob: jest.fn(),
}));

jest.mock('./SelectedItemsFlyoutView', () => {
  return function MockFlyoutView(props) {
    return (
      <div data-testid="flyout-view" data-items={JSON.stringify(props.items)} />
    );
  };
});

describe('SelectedItemsFlyout', () => {
  const mockUseSelector = useAppSelector as unknown as jest.Mock;
  const mockUseDispatch = useAppDispatch as unknown as jest.Mock;
  const dispatchMock = jest.fn();

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn().mockReturnValue('blob://test-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(dispatchMock);
  });

  it('does not render anything when there are no selected items', () => {
    mockUseSelector.mockReturnValue([]);
    const { container } = render(<SelectedItemsFlyout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the flyout view when there are selected items', () => {
    const items = [{ id: 42, name: 'Bulbasaur' }];
    mockUseSelector.mockReturnValue(items);

    render(<SelectedItemsFlyout />);

    const flyout = screen.getByTestId('flyout-view');
    expect(flyout).toBeInTheDocument();
    expect(flyout).toHaveAttribute('data-items', JSON.stringify(items));
  });

  it('dispatches clearItems when the "unselect all" button is clicked', () => {
    mockUseSelector.mockReturnValue([{ id: 7 }]);
    render(<SelectedItemsFlyout />);

    const [unselectAllBtn] = screen.getAllByRole('button', { hidden: true });
    fireEvent.click(unselectAllBtn);

    expect(clearItems).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'selectedItems/clearItems',
    });
  });

  it('generates and downloads CSV when download button is clicked', async () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    mockUseSelector.mockReturnValue(items);

    const fakeCsv = 'h1,h2\nv1,v2';
    (generateCSV as jest.Mock).mockResolvedValue(fakeCsv);

    const fakeBlob = new Blob(['dummy']);
    (generateCSVBlob as jest.Mock).mockReturnValue(fakeBlob);

    const { container } = render(<SelectedItemsFlyout />);
    const link = container.querySelector('a') as HTMLAnchorElement;
    const clickSpy = jest.spyOn(link, 'click');

    const [, downloadBtn] = screen.getAllByRole('button', { hidden: true });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(generateCSV).toHaveBeenCalledWith(items);
    });

    expect(generateCSVBlob).toHaveBeenCalledWith(fakeCsv);
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);
    expect(link.getAttribute('href')).toBe('blob://test-url');
    expect(link.download).toBe('2_items.csv');
    expect(clickSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob://test-url');
  });
});
