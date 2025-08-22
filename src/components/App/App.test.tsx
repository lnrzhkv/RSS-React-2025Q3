import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders layout and main page by default', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByTestId('layout-container')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-home')).toBeInTheDocument();
    expect(screen.getByTestId('app-main-title')).toHaveTextContent(
      'Pokémon Search'
    );
  });

  it('renders about page on /about route', () => {
    window.history.pushState({}, '', '/about');
    render(<App />);
    expect(screen.getByText(/About Pokémon Search/i)).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-about')).toBeInTheDocument();
  });

  it('renders NotFoundPage for unknown route', () => {
    window.history.pushState({}, '', '/not-exist');
    render(<App />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/does not exist/i)).toBeInTheDocument();
  });
});
