import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import { GlobalProvider } from '../../context/GlobalContext';

const MockChild = () => (
  <div data-testid="mock-child">Mock Child Component</div>
);

jest.mock('../../context/hooks/useGlobalContext', () => ({
  useGlobalContext: () => ({
    theme: 'light',
  }),
}));

jest.mock('../../components/Navigation/Navigation', () => {
  function MockedNavigation() {
    return <nav data-testid="mocked-navigation">Mock Navigation</nav>;
  }
  return MockedNavigation;
});

describe('AppLayout Component', () => {
  it('renders the layout container', () => {
    render(
      <MemoryRouter>
        <GlobalProvider>
          <AppLayout />
        </GlobalProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('layout-container')).toBeInTheDocument();
  });

  it('includes the Navigation component', () => {
    render(
      <MemoryRouter>
        <GlobalProvider>
          <AppLayout />
        </GlobalProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('mocked-navigation')).toBeInTheDocument();
  });

  it('renders the Outlet content when nested routes are provided', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <GlobalProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<MockChild />} />
            </Route>
          </Routes>
        </GlobalProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });

  it('has the correct CSS class applied', () => {
    render(
      <MemoryRouter>
        <GlobalProvider>
          <AppLayout />
        </GlobalProvider>
      </MemoryRouter>
    );
    const container = screen.getByTestId('layout-container');
    expect(container).toHaveClass('appContainer');
  });

  it('contains the outlet slot div', () => {
    render(
      <MemoryRouter>
        <GlobalProvider>
          <AppLayout />
        </GlobalProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('outlet-slot')).toBeInTheDocument();
  });
});
