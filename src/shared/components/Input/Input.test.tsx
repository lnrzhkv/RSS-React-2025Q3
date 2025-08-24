import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';
import React from 'react';

jest.mock('./Input.module.css', () => ({
  input: 'input-class',
}));

describe('Input Component', () => {
  test('renders input with default props', () => {
    render(<Input testId="test-input" />);
    const input = screen.getAllByTestId('test-input')[0];
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('input-class');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('renders with placeholder', () => {
    const placeholderText = 'Enter your name';
    render(<Input placeholder={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  test('renders with different types', () => {
    const { rerender } = render(<Input testId="email-input" type="email" />);
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');

    rerender(<Input testId="password-input" type="password" />);
    expect(screen.getByTestId('password-input')).toHaveAttribute(
      'type',
      'password'
    );
  });

  test('handles value and onChange', () => {
    const handleChange = jest.fn();
    const testValue = 'test input';

    render(<Input value={testValue} onChange={handleChange} />);

    const input = screen.getByDisplayValue(testValue);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders with id', () => {
    const testId = 'name-input';
    render(<Input id={testId} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', testId);
  });

  test('renders with testId', () => {
    const testId = 'input-test';
    render(<Input testId={testId} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('applies custom className', () => {
    const customClass = 'custom-input';
    render(<Input className={customClass} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input-class');
    expect(input).toHaveClass(customClass);
  });

  test('passes additional props', () => {
    render(
      <Input disabled required maxLength={50} aria-label="Username input" />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('aria-label', 'Username input');
  });

  test('has correct default values', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    expect(input).not.toBeDisabled();
    expect(input).not.toBeRequired();
    expect(input).toHaveValue('');
  });

  test('handles multiple props together', () => {
    const handleChange = jest.fn();
    const testId = 'combined-test';

    render(
      <Input
        type="email"
        placeholder="Enter email"
        value="test@example.com"
        onChange={handleChange}
        disabled
        testId={testId}
        className="additional-class"
      />
    );

    const input = screen.getByTestId(testId);
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveValue('test@example.com');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('input-class');
    expect(input).toHaveClass('additional-class');
  });
});
