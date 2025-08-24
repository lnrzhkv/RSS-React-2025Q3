import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

jest.mock('./Select.module.css', () => ({
  select: 'select-class',
}));

describe('Select Component', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const testId = 'test-select';

  test('renders select with options', () => {
    render(<Select id="select" options={options} testId={testId} />);

    const select = screen.getByTestId(testId);
    expect(select).toBeInTheDocument();
    expect(select).toHaveClass('select-class');

    options.forEach((option, index) => {
      const optionElement = screen.getByTestId(`${testId}-${index}`);
      expect(optionElement).toBeInTheDocument();
      expect(optionElement).toHaveValue(option);
      expect(optionElement).toHaveTextContent(option);
    });
  });

  test('applies custom className', () => {
    const customClass = 'custom-select';
    render(
      <Select
        id="select"
        options={options}
        className={customClass}
        testId={testId}
      />
    );

    const select = screen.getByTestId(testId);
    expect(select).toHaveClass('select-class');
    expect(select).toHaveClass(customClass);
  });

  test('renders with id', () => {
    const id = 'select-id';
    render(<Select options={options} id={id} testId={testId} />);

    const select = screen.getByTestId(testId);
    expect(select).toHaveAttribute('id', id);
  });

  test('handles uncontrolled mode with defaultValue', () => {
    const defaultValue = 'Option 2';
    render(
      <Select
        id="select"
        options={options}
        defaultValue={defaultValue}
        testId={testId}
      />
    );

    const select = screen.getByTestId(testId);
    expect(select).toHaveValue(defaultValue);
  });

  test('handles controlled mode with value', () => {
    const value = 'Option 3';
    render(
      <Select id="select" options={options} value={value} testId={testId} />
    );

    const select = screen.getByTestId(testId);
    expect(select).toHaveValue(value);
  });

  test('handles onChange in uncontrolled mode', () => {
    const handleChange = jest.fn();
    render(
      <Select
        id="select"
        options={options}
        onChange={handleChange}
        testId={testId}
      />
    );

    const select = screen.getByTestId(testId);
    fireEvent.change(select, { target: { value: 'Option 2' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue('Option 2');
  });

  test('handles onChange in controlled mode', () => {
    const handleChange = jest.fn();
    const value = 'Option 1';

    render(
      <Select
        id="select"
        options={options}
        value={value}
        onChange={handleChange}
        testId={testId}
      />
    );

    const select = screen.getByTestId(testId);
    fireEvent.change(select, { target: { value: 'Option 3' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue(value);
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select id="select" options={options} selectRef={ref} testId={testId} />
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current).toBe(screen.getByTestId(testId));
  });

  test('passes additional props', () => {
    render(
      <Select
        id="select"
        options={options}
        disabled
        required
        aria-label="Test select"
        testId={testId}
      />
    );

    const select = screen.getByTestId(testId);
    expect(select).toBeDisabled();
    expect(select).toBeRequired();
    expect(select).toHaveAttribute('aria-label', 'Test select');
  });

  test('updates value when props change in controlled mode', () => {
    const { rerender } = render(
      <Select id="select" options={options} value="Option 1" testId={testId} />
    );

    const select = screen.getByTestId(testId);
    expect(select).toHaveValue('Option 1');

    rerender(
      <Select id="select" options={options} value="Option 3" testId={testId} />
    );
    expect(select).toHaveValue('Option 3');
  });

  test('handles empty options array', () => {
    render(<Select id="select" options={[]} testId={testId} />);

    const select = screen.getByTestId(testId);
    expect(select).toBeInTheDocument();
    expect(select.children).toHaveLength(0);
  });

  test('handles multiple props together', () => {
    const handleChange = jest.fn();

    render(
      <Select
        options={options}
        value="Option 2"
        onChange={handleChange}
        disabled
        className="additional-class"
        id="select-id"
        testId={testId}
      />
    );

    const select = screen.getByTestId(testId);
    expect(select).toHaveValue('Option 2');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('select-class');
    expect(select).toHaveClass('additional-class');
    expect(select).toHaveAttribute('id', 'select-id');
  });
});
