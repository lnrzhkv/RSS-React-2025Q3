import { render, screen, fireEvent } from '@testing-library/react';
import FormFieldText from './FormFieldText';

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
    onChange,
    ...props
  }: {
    testId: string;
    onChange?: (event: unknown) => void;
    [key: string]: unknown;
  }) {
    return <input data-testid={testId} onChange={onChange} {...props} />;
  };
});

describe('FormFieldText', () => {
  const defaultProps = {
    id: 'test-id',
    testId: 'test-input',
    value: '',
    onChange: jest.fn(),
  };

  test('renders form element and input with correct test IDs', () => {
    render(<FormFieldText {...defaultProps} />);

    const formElement = screen.getByTestId(defaultProps.testId);
    const input = screen.getByTestId(`${defaultProps.id}-input-text`);

    expect(formElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('passes correct props to input element', () => {
    render(
      <FormFieldText
        {...defaultProps}
        placeholder="Enter text"
        disabled
        value="test value"
      />
    );

    const input = screen.getByTestId(`${defaultProps.id}-input-text`);
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('id', defaultProps.id);
    expect(input).toHaveValue('test value');
    expect(input).toBeDisabled();
  });

  test('displays error message when provided', () => {
    const errorMessage = 'This field is required';

    render(<FormFieldText {...defaultProps} error={errorMessage} />);

    const errorElement = screen.getByTestId(`${defaultProps.testId}-error`);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  test('uses id as fallback for form element test ID', () => {
    render(
      <FormFieldText
        id={defaultProps.id}
        value={defaultProps.value}
        onChange={defaultProps.onChange}
      />
    );

    const formElement = screen.getByTestId(`${defaultProps.id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<FormFieldText {...defaultProps} onChange={onChange} />);

    const input = screen.getByTestId(`${defaultProps.id}-input-text`);
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(onChange).toHaveBeenCalled();
  });

  test('maintains controlled value', () => {
    const { rerender } = render(
      <FormFieldText {...defaultProps} value="initial value" />
    );

    const input = screen.getByTestId(`${defaultProps.id}-input-text`);
    expect(input).toHaveValue('initial value');

    rerender(<FormFieldText {...defaultProps} value="updated value" />);

    expect(input).toHaveValue('updated value');
  });
});
