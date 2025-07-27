import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';

describe('Navigation Component', () => {
  it('renders navigation component', () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    const navElement = screen.getByTestId('nav');
    expect(navElement).toBeInTheDocument();
  });

  it('contains correct navigation links', () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    const homeLink = screen.getByTestId('nav-item-home');
    const aboutLink = screen.getByTestId('nav-item-about');

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveTextContent('Home');

    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).toHaveTextContent('About');
  });

  it('applies correct CSS classes', () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    const navElement = screen.getByTestId('nav');
    const homeLink = screen.getByTestId('nav-item-home');
    const aboutLink = screen.getByTestId('nav-item-about');

    expect(navElement).toHaveClass('nav');
    expect(homeLink).toHaveClass('navLink');
    expect(aboutLink).toHaveClass('navLink');
  });
});
