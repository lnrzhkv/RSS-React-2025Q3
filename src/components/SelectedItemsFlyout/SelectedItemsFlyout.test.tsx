import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SelectedItemsFlyout from './SelectedItemsFlyout';
import selectedItemsReducer, {
  SelectedItem,
} from '../../shared/selectedItemsSlice';

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

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

  const setup = (
    preloadedState: { selectedItems: SelectedItem[] } = { selectedItems: [] }
  ) => {
    const store = configureStore({
      reducer: {
        selectedItems: selectedItemsReducer,
      },
      preloadedState,
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <SelectedItemsFlyout />
        </Provider>
      ),
    };
  };

  it('should not render when no items are selected', () => {
    const { container } = setup();
    expect(container.firstChild).toBeNull();
  });

  it('should render when items are selected', () => {
    setup({ selectedItems: mockItems });
    expect(screen.getByText('2 items are selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should display singular text when only one item is selected', () => {
    setup({ selectedItems: [mockItems[0]] });
    expect(screen.getByText('1 item is selected')).toBeInTheDocument();
  });

  it('should trigger download when Download button is clicked', () => {
    setup({ selectedItems: mockItems });
    const createElementSpy = jest.spyOn(document, 'createElement');
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click');

    fireEvent.click(screen.getByText('Download'));

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    createElementSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it('should generate correct CSV content', () => {
    setup({ selectedItems: mockItems });
    fireEvent.click(screen.getByText('Download'));

    const blob = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('text/csv');

    const fileReader = new FileReader();
    fileReader.onload = function (this: FileReader) {
      expect(this.result).toBe(
        'id,name,description,detailsUrl\r\n' +
          '1,"Item 1","Description 1",http://example.com/1\r\n' +
          '2,"Item 2","Description 2",http://example.com/2'
      );
    };
    fileReader.readAsText(blob);
  });
});
