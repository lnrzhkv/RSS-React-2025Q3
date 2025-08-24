import { render, screen } from '@testing-library/react';
import FormFieldNumber from './FormFieldNumber';

describe('FormFieldNumber', () => {
  const defaultProps = {
    id: 'test-number',
    value: 0,
    onChange: jest.fn(),
  };

  test('renders form element and number input with correct test IDs', () => {
    render(<FormFieldNumber {...defaultProps} />);

    const formElement = screen.getByTestId(`${defaultProps.id}-form-element`);
    const input = screen.getByTestId(`${defaultProps.id}-number`);

    expect(formElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
});
