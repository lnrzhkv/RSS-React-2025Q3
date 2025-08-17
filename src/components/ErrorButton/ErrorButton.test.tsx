import { render, screen, fireEvent } from '@testing-library/react';
import ErrorButton from './ErrorButton';
import React from 'react';

jest.mock('next-intl', () => ({
  useTranslations: () => () => 'Trigger error',
}));

describe('ErrorButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with the translated label', () => {
    render(<ErrorButton />);

    const btn = screen.getByTestId('error-button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Trigger error');
  });

  it('throws the expected error when clicked', () => {
    render(<ErrorButton />);
    const btn = screen.getByTestId('error-button');

    expect(() => {
      fireEvent.click(btn);
    }).toThrow('Test error triggered by button click');
  });

  it('can be caught by an error boundary (fallback UI)', () => {
    class ErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean }
    > {
      state = { hasError: false };
      static getDerivedStateFromError() {
        return { hasError: true };
      }
      render() {
        return this.state.hasError ? (
          <div data-testid="fallback">Something went wrong</div>
        ) : (
          this.props.children
        );
      }
    }

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByTestId('error-button'));

    expect(screen.getByTestId('fallback')).toHaveTextContent(
      'Something went wrong'
    );
  });
});
