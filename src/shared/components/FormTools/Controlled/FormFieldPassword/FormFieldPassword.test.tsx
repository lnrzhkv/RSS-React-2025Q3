import { render, screen, fireEvent } from '@testing-library/react';
import FormFieldPassword from './FormFieldPassword';

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
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: unknown;
  }) {
    return <input data-testid={testId} onChange={onChange} {...props} />;
  };
});

describe('FormFieldPassword', () => {
  const defaultProps = {
    id: 'test-password',
    testId: 'test-password-input',
    value: '',
    onChange: jest.fn(),
  };

  test('renders form element and password input with correct test IDs', () => {
    render(<FormFieldPassword {...defaultProps} />);

    const formElement = screen.getByTestId(defaultProps.testId);
    const input = screen.getByTestId(`${defaultProps.id}-password`);

    expect(formElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('passes correct props to input element', () => {
    render(
      <FormFieldPassword
        {...defaultProps}
        placeholder="Enter password"
        disabled
        value="test password"
        autoComplete="current-password"
      />
    );

    const input = screen.getByTestId(`${defaultProps.id}-password`);
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'Enter password');
    expect(input).toHaveAttribute('id', defaultProps.id);
    expect(input).toHaveAttribute('autoComplete', 'current-password');
    expect(input).toHaveValue('test password');
    expect(input).toBeDisabled();
  });

  test('displays error message when provided', () => {
    const errorMessage = 'Password is required';
    render(<FormFieldPassword {...defaultProps} error={errorMessage} />);

    const errorElement = screen.getByTestId(`${defaultProps.testId}-error`);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  test('calls onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<FormFieldPassword {...defaultProps} onChange={onChange} />);

    const input = screen.getByTestId(`${defaultProps.id}-password`);
    fireEvent.change(input, { target: { value: 'new password' } });

    expect(onChange).toHaveBeenCalled();
  });

  test('maintains controlled value', () => {
    const { rerender } = render(
      <FormFieldPassword {...defaultProps} value="initial password" />
    );

    const input = screen.getByTestId(`${defaultProps.id}-password`);
    expect(input).toHaveValue('initial password');

    rerender(<FormFieldPassword {...defaultProps} value="updated password" />);
    expect(input).toHaveValue('updated password');
  });

  test('handles empty placeholder', () => {
    render(<FormFieldPassword {...defaultProps} placeholder="" />);

    const input = screen.getByTestId(`${defaultProps.id}-password`);
    expect(input).toHaveAttribute('placeholder', '');
  });

  test('uses default test ID when not provided', () => {
    const propsWithoutTestId = {
      id: 'test-password',
      value: '',
      onChange: jest.fn(),
    };

    render(<FormFieldPassword {...propsWithoutTestId} />);

    expect(
      screen.getByTestId('test-password-form-element')
    ).toBeInTheDocument();
  });

  test('handles empty className', () => {
    const { rerender } = render(
      <FormFieldPassword {...defaultProps} className="" />
    );

    const input = screen.getByTestId(`${defaultProps.id}-password`);
    expect(input).toHaveClass('input-password');

    rerender(<FormFieldPassword {...defaultProps} value="updated password" />);
    const updatedInput = screen.getByTestId(`${defaultProps.id}-password`);
    expect(updatedInput).toHaveValue('updated password');
  });
});
