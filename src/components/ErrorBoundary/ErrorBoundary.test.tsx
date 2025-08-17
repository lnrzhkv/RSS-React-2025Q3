import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const tMock = (key: string) => {
  const dict: Record<string, string> = {
    'ErrorBoundary.title': 'Error',
    'ErrorBoundary.unknownError': 'Unknown error',
    'ErrorBoundary.description': 'Something went wrong',
  };
  return dict[key] ?? key;
};

describe('ErrorBoundary', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary t={tMock}>
        <div data-testid="child">Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Content');
    expect(
      screen.queryByTestId('error-boundary-fallback')
    ).not.toBeInTheDocument();
  });

  it('displays fallback UI with error message when an error occurs', () => {
    const ProblemChild = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary t={tMock}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('shows unknown error text if no error object is present', () => {
    const ProblemChild = () => {
      throw {} as Error;
    };

    render(
      <ErrorBoundary t={tMock}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });
});
