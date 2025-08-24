import { render, screen } from '@testing-library/react';
import FormFieldTextInput from './FormFieldText';

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
    ...props
  }: {
    testId: string;
    [key: string]: unknown;
  }) {
    return <input data-testid={testId} {...props} />;
  };
});

describe('FormFieldTextInput', () => {
  const mockRef = { current: null };
  const testId = 'test-input';
  const id = 'test-id';

  test('renders form element and input with correct test IDs', () => {
    render(
      <FormFieldTextInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter text"
      />
    );

    const formElement = screen.getByTestId(`${testId}`);
    const input = screen.getByTestId(`${id}-input-text`);

    expect(formElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('passes correct props to input element', () => {
    render(
      <FormFieldTextInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter text"
        disabled
      />
    );

    const input = screen.getByTestId(`${id}-input-text`);
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('id', id);
    expect(input).toBeDisabled();
  });

  test('displays error message when provided', () => {
    const errorMessage = 'This field is required';

    render(
      <FormFieldTextInput
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
      <FormFieldTextInput id={id} inputRef={mockRef} placeholder="Enter text" />
    );

    const formElement = screen.getByTestId(`${id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });
});
