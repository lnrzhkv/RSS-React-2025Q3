import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';
import ErrorButton from '../ErrorButton/ErrorButton';

describe('ErrorBoundary Component', () => {
  let originalError: typeof console.error;

  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="safe-child">Safe content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('safe-child')).toBeInTheDocument();
    expect(
      screen.queryByTestId('error-boundary-fallback')
    ).not.toBeInTheDocument();
  });

  test('displays fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    const button = screen.getByTestId('error-button');
    fireEvent.click(button);

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Test error triggered by button click')
    ).toBeInTheDocument();
  });

  test('logs error to console', () => {
    const mockError = jest.fn();
    console.error = mockError;

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    const button = screen.getByTestId('error-button');
    fireEvent.click(button);

    expect(mockError).toHaveBeenCalled();

    const errorLogged = mockError.mock.calls.some((call: unknown[]) => {
      return call.some((arg: unknown) => {
        if (typeof arg === 'string') {
          return arg.includes('Test error triggered by button click');
        }
        if (arg instanceof Error) {
          return arg.message.includes('Test error triggered by button click');
        }
        return false;
      });
    });

    expect(errorLogged).toBeTruthy();
  });

  test('shows unknown error message when error has no message', () => {
    const BrokenComponent = () => {
      throw new Error();
    };

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });
});
