import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorButton from './ErrorButton';

describe('ErrorButton Component', () => {
  test('renders without crashing', () => {
    render(<ErrorButton />);
    expect(screen.getByTestId('error-button')).toBeInTheDocument();
  });

  test('triggers error when clicked', () => {
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <div>
        <ErrorButton />
      </div>
    );

    const button = screen.getByTestId('error-button');

    expect(() => fireEvent.click(button)).toThrow(
      'Test error triggered by button click'
    );

    console.error = originalError;
  });
});
