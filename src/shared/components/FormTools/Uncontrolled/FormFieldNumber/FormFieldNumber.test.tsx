import { render, screen } from '@testing-library/react';
import FormFieldNumberInput from './FormFieldNumber';

jest.mock('../../FormElement/FormElement', () => {
  return function MockFormElement({
    children,
    testId,
    error,
  }: {
    children: React.ReactNode;
    testId: string;
    error?: string;
  }) {
    return (
      <div data-testid={testId}>
        {children}
        {error && <span data-testid={`${testId}-error`}>{error}</span>}
      </div>
    );
  };
});

jest.mock('../../../Input/Input', () => {
  return function MockInput({
    testId,
    inputRef,
    ...props
  }: {
    testId: string;
    inputRef: React.RefObject<HTMLInputElement>;
  }) {
    return <input data-testid={testId} ref={inputRef} {...props} />;
  };
});

describe('FormFieldNumberInput', () => {
  const mockRef = { current: null };
  const testId = 'test-number';
  const id = 'test-id';

  test('renders form element and input with correct test IDs', () => {
    render(
      <FormFieldNumberInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter number"
      />
    );

    const formElement = screen.getByTestId(testId);
    const input = screen.getByTestId(`${id}-number`);

    expect(formElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('passes correct props to input element', () => {
    render(
      <FormFieldNumberInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter number"
        disabled
      />
    );

    const input = screen.getByTestId(`${id}-number`);
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('placeholder', 'Enter number');
    expect(input).toHaveAttribute('id', id);
    expect(input).toBeDisabled();
  });

  test('displays error message when provided', () => {
    const errorMessage = 'Number is required';

    render(
      <FormFieldNumberInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        error={errorMessage}
      />
    );

    const errorElement = screen.getByTestId(`${testId}-error`);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  test('uses id as fallback for form element test ID', () => {
    render(
      <FormFieldNumberInput
        id={id}
        inputRef={mockRef}
        placeholder="Enter number"
      />
    );

    const formElement = screen.getByTestId(`${id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });

  test('passes additional number attributes to input', () => {
    render(
      <FormFieldNumberInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter number"
        min={0}
        max={100}
        step={1}
      />
    );

    const input = screen.getByTestId(`${id}-number`);
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '1');
  });

  test('handles disabled state correctly', () => {
    render(
      <FormFieldNumberInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter number"
        disabled={true}
      />
    );

    const input = screen.getByTestId(`${id}-number`);
    expect(input).toBeDisabled();
  });

  test('handles enabled state correctly', () => {
    render(
      <FormFieldNumberInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter number"
        disabled={false}
      />
    );

    const input = screen.getByTestId(`${id}-number`);
    expect(input).not.toBeDisabled();
  });
});
