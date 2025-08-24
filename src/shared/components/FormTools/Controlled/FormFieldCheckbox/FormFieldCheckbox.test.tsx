import { render, screen } from '@testing-library/react';
import FormFieldCheckbox from './FormFieldCheckbox';

describe('FormFieldCheckbox', () => {
  const defaultProps = {
    id: 'test-checkbox',
    checked: false,
    onChange: jest.fn(),
  };

  test('renders checkbox and label when provided', () => {
    render(<FormFieldCheckbox {...defaultProps} label="Test Checkbox" />);

    const checkbox = screen.getByTestId(`${defaultProps.id}-checkbox`);
    const label = screen.getByTestId(`${defaultProps.id}-checkbox-label`);

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Test Checkbox');
  });
});
