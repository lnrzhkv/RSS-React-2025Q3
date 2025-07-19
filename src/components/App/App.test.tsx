import App from './App';
import { render } from '@testing-library/react';

test('correct render app container', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('app-container')).toBeInTheDocument();
});

test('correct render titles in container', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('app-main-title')).toHaveTextContent('Pokémon Search');
  expect(getByTestId('app-results-title')).toHaveTextContent('Search Results');
});
