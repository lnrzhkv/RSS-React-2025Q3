import { render, screen, fireEvent } from '@testing-library/react';
import FormFieldSelect from './FormFieldSelect';

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

jest.mock('../../../Select/Select', () => {
  return function MockSelect({
    testId,
    onChange,
    options,
    value,
    ...props
  }: {
    testId: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    value: string;
    [key: string]: unknown;
  }) {
    return (
      <select data-testid={testId} onChange={onChange} value={value} {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };
});

describe('FormFieldSelect', () => {
  const defaultProps = {
    id: 'test-select',
    value: '',
    onChange: jest.fn(),
    options: ['option1', 'option2', 'option3'],
  };

  test('renders form element and select with correct test IDs', () => {
    render(<FormFieldSelect {...defaultProps} />);

    const formElement = screen.getByTestId(`${defaultProps.id}-form-element`);
    const select = screen.getByTestId(`${defaultProps.id}-select`);

    expect(formElement).toBeInTheDocument();
    expect(select).toBeInTheDocument();
  });

  test('renders all options', () => {
    render(<FormFieldSelect {...defaultProps} />);

    const select = screen.getByTestId(`${defaultProps.id}-select`);
    const options = select.getElementsByTagName('option');

    expect(options).toHaveLength(defaultProps.options.length);
    defaultProps.options.forEach((optionText, index) => {
      expect(options[index]).toHaveValue(optionText);
      expect(options[index]).toHaveTextContent(optionText);
    });
  });

  test('displays error message when provided', () => {
    const errorMessage = 'Please select an option';
    render(<FormFieldSelect {...defaultProps} error={errorMessage} />);

    const errorElement = screen.getByTestId(
      `${defaultProps.id}-form-element-error`
    );
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  test('is disabled when disabled prop is true', () => {
    render(<FormFieldSelect {...defaultProps} disabled />);

    const select = screen.getByTestId(`${defaultProps.id}-select`);
    expect(select).toBeDisabled();
  });

  test('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<FormFieldSelect {...defaultProps} onChange={onChange} />);

    const select = screen.getByTestId(`${defaultProps.id}-select`);
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(onChange).toHaveBeenCalled();
  });

  test('maintains controlled value', () => {
    const { rerender } = render(
      <FormFieldSelect {...defaultProps} value="option1" />
    );

    const select = screen.getByTestId(`${defaultProps.id}-select`);
    expect(select).toHaveValue('option1');

    rerender(<FormFieldSelect {...defaultProps} value="option2" />);
    expect(select).toHaveValue('option2');
  });
});
