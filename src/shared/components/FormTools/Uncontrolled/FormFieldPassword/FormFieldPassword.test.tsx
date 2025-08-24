import { render, screen } from '@testing-library/react';
import FormFieldPasswordInput from './FormFieldPassword';

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
    [key: string]: unknown;
  }) {
    return <input data-testid={testId} ref={inputRef} {...props} />;
  };
});

describe('FormFieldPasswordInput', () => {
  const mockRef = { current: null };
  const testId = 'test-password';
  const id = 'test-id';

  test('renders form element and input with correct test IDs', () => {
    render(
      <FormFieldPasswordInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter password"
      />
    );

    const formElement = screen.getByTestId(testId);
    const input = screen.getByTestId(`${id}-password`);

    expect(formElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('passes correct props to input element', () => {
    render(
      <FormFieldPasswordInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter password"
        disabled
      />
    );

    const input = screen.getByTestId(`${id}-password`);
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'Enter password');
    expect(input).toHaveAttribute('id', id);
    expect(input).toBeDisabled();
  });

  test('displays error message when provided', () => {
    const errorMessage = 'Password is required';

    render(
      <FormFieldPasswordInput
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
      <FormFieldPasswordInput
        id={id}
        inputRef={mockRef}
        placeholder="Enter password"
      />
    );

    const formElement = screen.getByTestId(`${id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });

  test('passes additional attributes to input', () => {
    render(
      <FormFieldPasswordInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        placeholder="Enter password"
        autoComplete="current-password"
      />
    );

    const input = screen.getByTestId(`${id}-password`);
    expect(input).toHaveAttribute('autoComplete', 'current-password');
  });
});
