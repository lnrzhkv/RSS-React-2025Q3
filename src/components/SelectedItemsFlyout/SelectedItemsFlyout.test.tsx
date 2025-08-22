import { render, screen, fireEvent } from '@testing-library/react';
import SelectedItemsFlyout from './SelectedItemsFlyout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer, {
  SelectedItem,
} from '../../shared/store/selectedItemsSlice';

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob://test');
  global.URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('SelectedItemsFlyout', () => {
  const mockItems: SelectedItem[] = [
    {
      id: '1',
      name: 'Item 1',
      description: 'Description 1',
      detailsUrl: 'http://example.com/1',
    },
    {
      id: '2',
      name: 'Item 2',
      description: 'Description 2',
      detailsUrl: 'http://example.com/2',
    },
  ];

  function setup(preloadedItems: SelectedItem[]) {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState: { selectedItems: preloadedItems },
    });

    const utils = render(
      <Provider store={store}>
        <SelectedItemsFlyout />
      </Provider>
    );
    return { store, ...utils };
  }

  it('does not render when no items are selected', () => {
    const { container } = setup([]);
    expect(container.firstChild).toBeNull();
  });

  it('renders count, Unselect all and Download buttons', () => {
    setup(mockItems);
    expect(screen.getByText('2 items are selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('triggers download when Download button is clicked', () => {
    const { container } = setup(mockItems);

    const anchor = container.querySelector('a') as HTMLAnchorElement;
    expect(anchor).toBeInTheDocument();

    const clickSpy = jest.spyOn(anchor, 'click');

    fireEvent.click(screen.getByText('Download'));

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));

    expect(anchor.download).toBe('2_items.csv');

    expect(clickSpy).toHaveBeenCalled();

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob://test');
  });

  it('generates correct CSV content', (done) => {
    setup(mockItems);

    fireEvent.click(screen.getByText('Download'));

    const blobArg = (global.URL.createObjectURL as jest.Mock).mock
      .calls[0][0] as Blob;

    const reader = new FileReader();
    reader.onloadend = () => {
      const text = reader.result as string;

      const expected = [
        'id,name,description,detailsUrl',
        '1,"Item 1","Description 1",http://example.com/1',
        '2,"Item 2","Description 2",http://example.com/2',
      ].join('\n');

      expect(text).toBe(expected);
      done();
    };
    reader.onerror = () => done.fail('Failed to read blob as text');

    reader.readAsText(blobArg);
  });

  it('clears all items on Unselect all click', () => {
    const { store } = setup(mockItems);

    fireEvent.click(screen.getByText('Unselect all'));

    const state = store.getState().selectedItems;
    expect(state).toHaveLength(0);

    expect(screen.queryByTestId('selected-items-flyout')).toBeNull();
  });
});
