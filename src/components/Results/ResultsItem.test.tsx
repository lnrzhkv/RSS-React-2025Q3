import { render, screen, fireEvent } from '@testing-library/react';
import ResultsItem from './ResultsItem';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../../shared/store/selectedItemsSlice';
import type { CharacterWithImage } from '../../shared/api/types';

describe('ResultsItem (with real Redux store)', () => {
  const character: CharacterWithImage = {
    id: 1,
    name: 'Pikachu',
    height: 4,
    weight: 6,
    image: 'https://img.url/pikachu.png',
    types: [
      {
        slot: 1,
        type: {
          name: 'electric',
          url: 'https://pokeapi.co/type/electric',
        },
      },
    ],
  };

  function renderWithStore() {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
    });
    render(
      <Provider store={store}>
        <ResultsItem character={character} />
      </Provider>
    );
    return store;
  }

  it('initially renders unchecked, then adds item to store on check', () => {
    const store = renderWithStore();

    const checkbox = screen.getByRole('checkbox', {
      name: /select-pikachu/i,
    });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    const itemsState = store.getState().selectedItems;
    expect(itemsState).toHaveLength(1);
    expect(itemsState[0]).toEqual({
      id: '1',
      name: 'Pikachu',
      description: 'Height: 4, Weight: 6',
      detailsUrl: '/details/1',
    });

    expect(checkbox).toBeChecked();
  });

  it('removes item from store on uncheck', () => {
    const store = renderWithStore();

    const checkbox = screen.getByRole('checkbox', {
      name: /select-pikachu/i,
    });

    fireEvent.click(checkbox);
    expect(store.getState().selectedItems).toHaveLength(1);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(store.getState().selectedItems).toHaveLength(0);
    expect(checkbox).not.toBeChecked();
  });

  it('renders all character info correctly', () => {
    renderWithStore();

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Pikachu'
    );
    expect(screen.getByText('Height: 4, Weight: 6')).toBeInTheDocument();
    expect(screen.getByText('Types: electric')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: 'Pikachu' });
    expect(img).toHaveAttribute('src', 'https://img.url/pikachu.png');

    const checkbox = screen.getByRole('checkbox', {
      name: /select-pikachu/i,
    });
    expect(checkbox).not.toBeChecked();
  });
});
