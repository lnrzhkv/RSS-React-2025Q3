import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

jest.mock('./Button.module.css', () => ({
  button: 'button-class',
}));

describe('Button Component', () => {
  const testId = 'test-button';

  test('renders button with children', () => {
    render(<Button testId={testId}>Click me</Button>);

    const button = screen.getByTestId(testId);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button-class');
    expect(button).toHaveTextContent('Click me');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Button testId={testId} onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByTestId(testId);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    const customClass = 'custom-button';
    render(
      <Button testId={testId} className={customClass}>
        Click me
      </Button>
    );

    const button = screen.getByTestId(testId);
    expect(button).toHaveClass('button-class');
    expect(button).toHaveClass(customClass);
  });

  test('passes additional props', () => {
    render(
      <Button testId={testId} disabled type="submit" aria-label="Submit form">
        Submit
      </Button>
    );

    const button = screen.getByTestId(testId);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  test('has correct default values', () => {
    render(<Button testId={testId}>Click me</Button>);

    const button = screen.getByTestId(testId);
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
  });

  test('handles multiple props together', () => {
    const handleClick = jest.fn();

    render(
      <Button
        testId={testId}
        onClick={handleClick}
        className="primary-button"
        type="button"
      >
        Submit
      </Button>
    );

    const button = screen.getByTestId(testId);
    expect(button).toHaveClass('button-class');
    expect(button).toHaveClass('primary-button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Submit');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
