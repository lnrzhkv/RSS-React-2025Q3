import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormFieldImageloader from './FormFieldImageloader';

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

jest.mock('./FormFieldImageloader.module.css', () => ({
  'file-input-container': 'file-input-container-class',
  'file-input': 'file-input-class',
  'file-input-label': 'file-input-label-class',
  'upload-icon': 'upload-icon-class',
  'file-name': 'file-name-class',
  'loading-overlay': 'loading-overlay-class',
  'file-preview': 'file-preview-class',
}));

describe('FormFieldImageloader', () => {
  const mockRef = { current: null };
  const testId = 'test-imageloader';
  const id = 'test-id';

  test('renders form element and file input with correct test IDs', () => {
    render(<FormFieldImageloader id={id} inputRef={mockRef} testId={testId} />);

    const formElement = screen.getByTestId(testId);
    const fileInputContainer = screen.getByTestId(`${id}-imageloader`);
    const input = screen.getByTestId(`${id}-imageloader-input`);
    const label = screen.getByTestId(`${id}-imageloader-label`);
    const svg = screen.getByTestId(`${id}-imageloader-svg`);

    expect(formElement).toBeInTheDocument();
    expect(fileInputContainer).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(svg).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/jpeg, image/png');
  });

  test('displays error message when provided', () => {
    const errorMessage = 'Image is required';

    render(
      <FormFieldImageloader
        id={id}
        inputRef={mockRef}
        testId={testId}
        error={errorMessage}
      />
    );

    const errorElement = screen.getByTestId(`${testId}-error`);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  test('uses id as fallback for form element test ID', () => {
    render(<FormFieldImageloader id={id} inputRef={mockRef} />);

    const formElement = screen.getByTestId(`${id}-form-element`);
    expect(formElement).toBeInTheDocument();
  });

  test('displays file name when file is selected', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(<FormFieldImageloader id={id} inputRef={mockRef} testId={testId} />);

    const input = screen.getByTestId(`${id}-imageloader-input`);
    await user.upload(input, file);

    await screen.findByTestId(`${id}-imageloader-preview`);
    await screen.findByTestId(`${id}-imageloader-clear-button`);

    const clearButton = screen.getByTestId(`${id}-imageloader-clear-button`);
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveTextContent('Clear');
  });

  test('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClearMock = jest.fn();
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(
      <FormFieldImageloader
        id={id}
        inputRef={mockRef}
        testId={testId}
        onClear={onClearMock}
      />
    );

    const input = screen.getByTestId(`${id}-imageloader-input`);
    await user.upload(input, file);

    await screen.findByTestId(`${id}-imageloader-preview`);
    await screen.findByTestId(`${id}-imageloader-clear-button`);

    const clearButton = screen.getByTestId(`${id}-imageloader-clear-button`);
    await user.click(clearButton);

    expect(onClearMock).toHaveBeenCalledTimes(1);
  });

  test('clears file when clear button is clicked', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(<FormFieldImageloader id={id} inputRef={mockRef} testId={testId} />);

    const input = screen.getByTestId(`${id}-imageloader-input`);
    await user.upload(input, file);

    await screen.findByTestId(`${id}-imageloader-preview`);
    await screen.findByTestId(`${id}-imageloader-clear-button`);

    const clearButton = screen.getByTestId(`${id}-imageloader-clear-button`);
    await user.click(clearButton);

    expect(screen.queryByTestId(`${id}-imageloader-svg`)).toBeInTheDocument();
  });

  test('shows preview for image files after loading', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(<FormFieldImageloader id={id} inputRef={mockRef} testId={testId} />);

    const input = screen.getByTestId(`${id}-imageloader-input`);
    await user.upload(input, file);

    const preview = await screen.findByTestId(`${id}-imageloader-preview`);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('alt', 'Preview');
  });

  test('does not show preview for non-image files', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    render(<FormFieldImageloader id={id} inputRef={mockRef} testId={testId} />);

    const input = screen.getByTestId(`${id}-imageloader-input`);
    await user.upload(input, file);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const preview = screen.queryByTestId(`${id}-imageloader-preview`);
    expect(preview).not.toBeInTheDocument();
  });
});
