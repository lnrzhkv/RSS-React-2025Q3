import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormFieldCheckboxInput from './FormFieldCheckbox';

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

describe('FormFieldCheckboxInput', () => {
  const mockRef = { current: null };
  const testId = 'test-checkbox';
  const id = 'test-id';

  test('renders form element and checkbox with correct test IDs', () => {
    render(
      <FormFieldCheckboxInput id={id} inputRef={mockRef} testId={testId} />
    );

    const formElement = screen.getByTestId(testId);
    const checkbox = screen.getByTestId(`${id}-checkbox`);
    const label = screen.getByTestId(`${id}-checkbox-label`);

    expect(formElement).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  test('displays error message when provided', () => {
    const errorMessage = 'This field is required';

    render(
      <FormFieldCheckboxInput
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
    render(<FormFieldCheckboxInput id={id} inputRef={mockRef} />);

    const formElement = screen.getByTestId(`${id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });

  test('displays label when provided', () => {
    const labelText = 'Accept terms and conditions';

    render(
      <FormFieldCheckboxInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        label={labelText}
      />
    );

    const label = screen.getByTestId(`${id}-checkbox-label`);
    expect(label).toHaveTextContent(labelText);
  });

  test('checkbox can be checked and unchecked', async () => {
    const user = userEvent.setup();

    render(
      <FormFieldCheckboxInput id={id} inputRef={mockRef} testId={testId} />
    );

    const checkbox = screen.getByTestId(`${id}-checkbox`) as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);

    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test('checkbox is disabled when disabled prop is true', () => {
    render(
      <FormFieldCheckboxInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        disabled={true}
      />
    );

    const checkbox = screen.getByTestId(`${id}-checkbox`);
    expect(checkbox).toBeDisabled();
  });

  test('checkbox is not disabled by default', () => {
    render(
      <FormFieldCheckboxInput id={id} inputRef={mockRef} testId={testId} />
    );

    const checkbox = screen.getByTestId(`${id}-checkbox`);
    expect(checkbox).not.toBeDisabled();
  });

  test('passes additional props to input element', () => {
    render(
      <FormFieldCheckboxInput
        id={id}
        inputRef={mockRef}
        testId={testId}
        name="terms"
      />
    );

    const checkbox = screen.getByTestId(`${id}-checkbox`);
    expect(checkbox).toHaveAttribute('name', 'terms');
  });
});
