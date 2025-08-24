import { render, screen } from '@testing-library/react';
import FormElement from './FormElement';

jest.mock('./FormElement.module.css', () => ({
  formElement: 'formElement-class',
  formLabel: 'formLabel-class',
  formError: 'formError-class',
}));

describe('FormElement Component', () => {
  const testId = 'test-form-element';
  const id = 'test-id';
  const labelText = 'Test Label';

  test('renders form element with label', () => {
    render(
      <FormElement id={id} testId={testId}>
        {labelText}
      </FormElement>
    );

    const formElement = screen.getByTestId(testId);
    const label = screen.getByTestId(`${testId}-label`);

    expect(formElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(labelText);
    expect(label).toHaveAttribute('for', id);
  });

  test('does not render error when error is not provided', () => {
    render(
      <FormElement id={id} testId={testId}>
        {labelText}
      </FormElement>
    );

    const errorElement = screen.queryByTestId(`${testId}-error`);
    expect(errorElement).not.toBeInTheDocument();
  });

  test('renders error when error is provided', () => {
    const errorMessage = 'This field is required';

    render(
      <FormElement id={id} error={errorMessage} testId={testId}>
        {labelText}
      </FormElement>
    );

    const errorElement = screen.getByTestId(`${testId}-error`);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  test('applies correct CSS classes', () => {
    const errorMessage = 'This field is required';

    render(
      <FormElement id={id} error={errorMessage} testId={testId}>
        {labelText}
      </FormElement>
    );

    const formElement = screen.getByTestId(testId);
    const label = screen.getByTestId(`${testId}-label`);
    const error = screen.getByTestId(`${testId}-error`);

    expect(formElement).toHaveClass('formElement-class');
    expect(label).toHaveClass('formLabel-class');
    expect(error).toHaveClass('formError-class');
  });
});
