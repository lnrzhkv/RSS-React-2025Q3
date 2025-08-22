import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer, {
  addItem,
  removeItem,
  clearItems,
  SelectedItem,
} from './selectedItemsSlice';

describe('selectedItemsSlice', () => {
  const mockItem1: SelectedItem = {
    id: '1',
    name: 'Item 1',
    description: 'Description 1',
    detailsUrl: '/details/1',
  };

  const mockItem2: SelectedItem = {
    id: '2',
    name: 'Item 2',
    description: 'Description 2',
    detailsUrl: '/details/2',
  };

  it('should handle initial state', () => {
    expect(selectedItemsReducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  it('should handle addItem', () => {
    let state = selectedItemsReducer(undefined, addItem(mockItem1));
    expect(state).toEqual([mockItem1]);

    state = selectedItemsReducer(state, addItem(mockItem1));
    expect(state).toEqual([mockItem1]);

    state = selectedItemsReducer(state, addItem(mockItem2));
    expect(state).toEqual([mockItem1, mockItem2]);
  });

  it('should handle removeItem', () => {
    const initialState = [mockItem1, mockItem2];
    let state = selectedItemsReducer(initialState, removeItem('1'));
    expect(state).toEqual([mockItem2]);

    state = selectedItemsReducer(state, removeItem('999'));
    expect(state).toEqual([mockItem2]);

    state = selectedItemsReducer(state, removeItem('2'));
    expect(state).toEqual([]);
  });

  it('should handle clearItems', () => {
    const initialState = [mockItem1, mockItem2];
    const state = selectedItemsReducer(initialState, clearItems());
    expect(state).toEqual([]);
  });
});

describe('Redux store integration', () => {
  const mockItem: SelectedItem = {
    id: '3',
    name: 'Store Test Item',
    description: 'Store test description',
    detailsUrl: '/details/store-test',
  };

  it('should store handle selectedItems actions', () => {
    const store = configureStore({
      reducer: {
        selectedItems: selectedItemsReducer,
      },
    });

    expect(store.getState().selectedItems).toEqual([]);

    store.dispatch(addItem(mockItem));
    expect(store.getState().selectedItems).toEqual([mockItem]);

    store.dispatch(removeItem(mockItem.id));
    expect(store.getState().selectedItems).toEqual([]);

    store.dispatch(addItem(mockItem));
    store.dispatch(addItem({ ...mockItem, id: '4' }));
    store.dispatch(clearItems());
    expect(store.getState().selectedItems).toEqual([]);
  });

  it('should not add duplicates', () => {
    const store = configureStore({
      reducer: {
        selectedItems: selectedItemsReducer,
      },
    });

    store.dispatch(addItem(mockItem));
    store.dispatch(addItem(mockItem));
    store.dispatch(addItem({ ...mockItem, id: '5' }));

    expect(store.getState().selectedItems).toEqual([
      mockItem,
      { ...mockItem, id: '5' },
    ]);
  });
});
