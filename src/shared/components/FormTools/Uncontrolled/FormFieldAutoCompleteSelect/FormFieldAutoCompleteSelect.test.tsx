import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormFieldAutoCompleteSelect from './FormFieldAutoCompleteSelect';

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
    'data-testid': testId,
    id,
    list,
    placeholder,
    ...rest
  }: {
    'data-testid': string;
    id: string;
    list: string;
    placeholder?: string;
  }) {
    return (
      <input
        data-testid={testId}
        id={id}
        list={list}
        placeholder={placeholder}
        {...rest}
      />
    );
  };
});

describe('FormFieldAutoCompleteSelect', () => {
  const mockRef = { current: null };
  const testId = 'test-autocomplete';
  const id = 'test-id';
  const options = ['Option 1', 'Option 2', 'Option 3'];

  test('renders form element and autocomplete input with correct test IDs', () => {
    render(
      <FormFieldAutoCompleteSelect
        id={id}
        inputRef={mockRef}
        testId={testId}
        options={options}
      />
    );

    const formElement = screen.getByTestId(testId);
    const input = screen.getByTestId(`${id}-autocomplete-select`);
    const datalist = screen.getByTestId(`${id}-autocomplete-select-datalist`);

    expect(formElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(datalist).toBeInTheDocument();
    expect(input).toHaveAttribute('list', `${id}-datalist`);
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  test('displays error message when provided', () => {
    const errorMessage = 'This field is required';

    render(
      <FormFieldAutoCompleteSelect
        id={id}
        inputRef={mockRef}
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
    render(
      <FormFieldAutoCompleteSelect
        id={id}
        inputRef={mockRef}
        options={options}
      />
    );

    const formElement = screen.getByTestId(`${id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });

  test('displays placeholder when provided', () => {
    const placeholderText = 'Select an option';

    render(
      <FormFieldAutoCompleteSelect
        id={id}
        inputRef={mockRef}
        testId={testId}
        options={options}
        placeholder={placeholderText}
      />
    );

    const input = screen.getByTestId(`${id}-autocomplete-select`);
    expect(input).toHaveAttribute('placeholder', placeholderText);
  });

  test('renders all options in datalist', () => {
    render(
      <FormFieldAutoCompleteSelect
        id={id}
        inputRef={mockRef}
        testId={testId}
        options={options}
      />
    );

    options.forEach((option, index) => {
      const optionElement = screen.getByTestId(
        `${id}-autocomplete-select-option-${index}`
      );
      expect(optionElement).toBeInTheDocument();
      expect(optionElement).toHaveAttribute('value', option);
    });
  });

  test('passes additional props to input element', () => {
    render(
      <FormFieldAutoCompleteSelect
        id={id}
        inputRef={mockRef}
        testId={testId}
        options={options}
        name="autocomplete"
      />
    );

    const input = screen.getByTestId(`${id}-autocomplete-select`);
    expect(input).toHaveAttribute('name', 'autocomplete');
  });

  test('allows user to type in the input', async () => {
    const user = userEvent.setup();

    render(
      <FormFieldAutoCompleteSelect
        id={id}
        inputRef={mockRef}
        testId={testId}
        options={options}
      />
    );

    const input = screen.getByTestId(
      `${id}-autocomplete-select`
    ) as HTMLInputElement;

    await user.type(input, 'Custom value');
    expect(input.value).toBe('Custom value');
  });
});
