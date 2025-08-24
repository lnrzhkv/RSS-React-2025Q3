import { render, screen } from '@testing-library/react';
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
    options,
    selectRef,
    ...props
  }: {
    testId: string;
    options: string[];
    selectRef?: React.RefObject<HTMLSelectElement | null>;
    [key: string]: unknown;
  }) {
    return (
      <select data-testid={testId} ref={selectRef} {...props}>
        {options.map((option: string, index: number) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };
});

describe('FormFieldSelect', () => {
  const mockRef = { current: null };
  const testId = 'test-select';
  const id = 'test-id';
  const options = ['Option 1', 'Option 2', 'Option 3'];

  test('renders form element and select with correct test IDs', () => {
    render(
      <FormFieldSelect
        id={id}
        selectRef={mockRef}
        testId={testId}
        options={options}
      />
    );

    const formElement = screen.getByTestId(testId);
    const select = screen.getByTestId(`${id}-select`);

    expect(formElement).toBeInTheDocument();
    expect(select).toBeInTheDocument();
  });

  test('passes correct props to select element', () => {
    render(
      <FormFieldSelect
        id={id}
        selectRef={mockRef}
        testId={testId}
        options={options}
        disabled
      />
    );

    const select = screen.getByTestId(`${id}-select`);
    expect(select).toHaveAttribute('id', id);
    expect(select).toBeDisabled();
  });

  test('renders all options correctly', () => {
    render(
      <FormFieldSelect
        id={id}
        selectRef={mockRef}
        testId={testId}
        options={options}
      />
    );

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('displays error message when provided', () => {
    const errorMessage = 'This field is required';

    render(
      <FormFieldSelect
        id={id}
        selectRef={mockRef}
        testId={testId}
        options={options}
        error={errorMessage}
      />
    );

    const errorElement = screen.getByTestId(`${testId}-error`);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  test('uses id as fallback for form element test ID', () => {
    render(<FormFieldSelect id={id} selectRef={mockRef} options={options} />);

    const formElement = screen.getByTestId(`${id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });
});
