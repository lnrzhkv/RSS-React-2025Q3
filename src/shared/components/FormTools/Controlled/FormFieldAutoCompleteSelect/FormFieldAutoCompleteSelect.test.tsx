import { render, screen } from '@testing-library/react';
import FormFieldAutoCompleteSelect from './FormFieldAutoCompleteSelect';

describe('FormFieldAutoCompleteSelect', () => {
  const defaultProps = {
    id: 'test-autocomplete',
    value: '',
    onChange: jest.fn(),
    options: ['Apple', 'Banana', 'Orange'],
  };

  test('renders input and datalist with options', () => {
    render(<FormFieldAutoCompleteSelect {...defaultProps} />);

    const input = screen.getByTestId(`${defaultProps.id}-autocomplete-select`);
    const datalist = screen.getByTestId(
      `${defaultProps.id}-autocomplete-select-datalist`
    );

    expect(input).toBeInTheDocument();
    expect(datalist).toBeInTheDocument();
    expect(screen.getAllByTestId(/-option-/)).toHaveLength(3);
  });
});
