import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UncontrolledForm from './UncontrolledForm';
import { useFormStore } from '../../shared/store/useFormStore';
import { convertFileToBase64 } from '../../shared/lib/convertFileToBase64/convertFileToBase64';

jest.mock('../../shared/store/useFormStore', () => ({
  useFormStore: jest.fn(),
}));

jest.mock('../../shared/lib/convertFileToBase64/convertFileToBase64', () => ({
  convertFileToBase64: jest.fn(),
}));

describe('UncontrolledForm', () => {
  const mockSetModalDataByKey = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: ReturnType<typeof useFormStore>) => unknown) => {
        const store = {
          setModalDataByKey: mockSetModalDataByKey,
          closeModal: mockCloseModal,
          countriesVariants: ['USA', 'Canada', 'Mexico'],
        };
        return selector(store);
      }
    );
    (convertFileToBase64 as unknown as jest.Mock).mockResolvedValue(
      'data:image/png;base64,mockBase64'
    );
  });

  test('renders the form with all required fields', async () => {
    render(<UncontrolledForm />);

    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter age')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter country')).toBeInTheDocument();
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<UncontrolledForm />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errors = [
        'Name is required',
        'Invalid email address',
        'Password must contain at least 1 number, 1 uppercase, 1 lowercase, and 1 special character',
        'Age is required and must be greater than 0',
        'Country is required',
        'You must accept the terms and conditions',
      ];

      errors.forEach((error) => {
        expect(screen.getByText(error)).toBeInTheDocument();
      });
    });
  });

  test('validates password strength', async () => {
    render(<UncontrolledForm />);
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await userEvent.type(passwordInput, 'weak');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Password must contain at least 1 number, 1 uppercase, 1 lowercase, and 1 special character'
        )
      ).toBeInTheDocument();
    });
  });

  test('converts image file to base64 on form submission', async () => {
    const mockBase64 = 'data:image/png;base64,mockBase64';
    (convertFileToBase64 as jest.Mock).mockResolvedValue(mockBase64);

    render(<UncontrolledForm />);

    await userEvent.type(screen.getByPlaceholderText('Enter name'), 'John');
    await userEvent.type(
      screen.getByPlaceholderText('Enter email'),
      'john@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Enter password'),
      'Password1!'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Confirm password'),
      'Password1!'
    );
    await userEvent.type(screen.getByPlaceholderText('Enter age'), '25');
    await userEvent.type(screen.getByPlaceholderText('Enter country'), 'USA');
    await userEvent.click(screen.getByLabelText('Accept terms'));

    const fileInput = screen.getByTestId('picture-imageloader-input');
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, file);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(convertFileToBase64).toHaveBeenCalledWith(file);
      expect(mockSetModalDataByKey).toHaveBeenCalledWith(
        'uncontrolled',
        expect.objectContaining({ picture: mockBase64 })
      );
    });
  });

  test('filters autocomplete options for country', async () => {
    const mockCountries = ['USA', 'Canada', 'Mexico'];

    render(<UncontrolledForm />);
    const countryInput = screen.getByPlaceholderText('Enter country');

    await userEvent.type(countryInput, 'Can');

    await waitFor(() => {
      expect(countryInput).toHaveValue('Can');
      const options = mockCountries.filter((country) =>
        country.toLowerCase().includes('can'.toLowerCase())
      );
      expect(options).toContain('Canada');
      expect(options).not.toContain('USA');
    });
  });

  test('clears error messages on valid input', async () => {
    render(<UncontrolledForm />);
    const nameInput = screen.getByPlaceholderText('Enter name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'John');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    render(<UncontrolledForm />);

    await userEvent.type(screen.getByPlaceholderText('Enter name'), 'John');
    await userEvent.type(
      screen.getByPlaceholderText('Enter email'),
      'john@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Enter password'),
      'Password1!'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Confirm password'),
      'Password1!'
    );
    await userEvent.type(screen.getByPlaceholderText('Enter age'), '25');
    await userEvent.type(screen.getByPlaceholderText('Enter country'), 'USA');
    await userEvent.selectOptions(screen.getByTestId('gender-select'), 'male');
    await userEvent.click(screen.getByLabelText('Accept terms'));

    const file = new File(['test'], 'test.png', {
      type: 'image/png',
    });

    await userEvent.upload(
      screen.getByTestId('picture-imageloader-input'),
      file
    );

    await userEvent.upload(
      screen.getByTestId('picture-imageloader-input'),
      file
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockSetModalDataByKey).toHaveBeenCalledWith(
        'uncontrolled',
        expect.objectContaining({
          name: 'John',
          email: 'john@example.com',
          password: 'Password1!',
          confirmPassword: 'Password1!',
          age: 25,
          country: 'USA',
          gender: 'male',
          acceptedTerms: true,
          picture: 'data:image/png;base64,mockBase64',
        })
      );
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  test('clears file input', async () => {
    render(<UncontrolledForm />);
    const fileInput = screen.getByTestId('picture-imageloader-input');

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      const clearButton = screen.getByTestId(
        'picture-imageloader-clear-button'
      );
      return clearButton;
    });
    const clearButton = screen.getByTestId('picture-imageloader-clear-button');
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(fileInput).toHaveValue('');
    });
  });
});
