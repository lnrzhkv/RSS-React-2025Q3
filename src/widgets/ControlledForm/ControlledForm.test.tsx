import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ControlledForm from './ControlledForm';
import { useFormStore } from '../../shared/store/useFormStore';
import { convertFileToBase64 } from '../../shared/lib/convertFileToBase64/convertFileToBase64';

jest.mock('../../shared/store/useFormStore', () => ({
  useFormStore: jest.fn(),
}));

jest.mock('../../shared/lib/convertFileToBase64/convertFileToBase64', () => ({
  convertFileToBase64: jest.fn(),
}));

declare global {
  interface URL {
    createObjectURL?: jest.Mock;
  }
}

URL.createObjectURL = jest.fn(() => 'mockedObjectURL');

describe('ControlledForm', () => {
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
    render(<ControlledForm />);

    expect(screen.getByTestId('name-input-text')).toBeInTheDocument();
    expect(screen.getByTestId('email-input-text')).toBeInTheDocument();
    expect(screen.getByTestId('password-password')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword-password')).toBeInTheDocument();
    expect(screen.getByTestId('age-number')).toBeInTheDocument();
    expect(
      screen.getByTestId('country-autocomplete-select')
    ).toBeInTheDocument();
    expect(screen.getByTestId('accepted-terms-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<ControlledForm />);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errors = [
        'Name is required',
        'Invalid email address',
        'Age is required and must be greater than 0',
        'Country is required',
        'You must accept the terms and conditions',
      ];

      errors.forEach((error) => {
        expect(screen.getByText(error)).toBeInTheDocument();
      });

      const passwordErrors = [
        'Password must be at least 8 characters',
        'Password must contain at least 1 number, 1 uppercase, 1 lowercase, and 1 special character',
      ];
      const foundPasswordError = passwordErrors.some((err) => {
        try {
          expect(screen.getByText(err)).toBeInTheDocument();
          return true;
        } catch {
          return false;
        }
      });
      expect(foundPasswordError).toBe(true);
    });
  });

  test('submits the form with valid data', async () => {
    render(<ControlledForm />);

    await userEvent.type(screen.getByTestId('name-input-text'), 'John');
    await userEvent.type(
      screen.getByTestId('email-input-text'),
      'john@example.com'
    );
    await userEvent.type(screen.getByTestId('password-password'), 'Password1!');
    await userEvent.type(
      screen.getByTestId('confirmPassword-password'),
      'Password1!'
    );
    await userEvent.type(screen.getByTestId('age-number'), '25');
    await userEvent.type(
      screen.getByTestId('country-autocomplete-select'),
      'USA'
    );
    await userEvent.click(screen.getAllByTestId('accepted-terms-checkbox')[0]);

    const file = new File(['test'], 'test.png', {
      type: 'image/png',
    });

    await userEvent.upload(
      screen.getByTestId('picture-imageloader-input'),
      file
    );

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetModalDataByKey).toHaveBeenCalledWith(
        'controlled',
        expect.objectContaining({
          name: 'John',
          email: 'john@example.com',
          password: 'Password1!',
          confirmPassword: 'Password1!',
          age: 25,
          country: 'USA',
          acceptedTerms: true,
          picture: 'data:image/png;base64,mockBase64',
        })
      );
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });
});
