import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from './Search';
import { BrowserRouter } from 'react-router-dom';

describe('Search Component', () => {
  const mockOnChange = jest.fn();
  const successfulSearchMock = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search form with input and button', () => {
    render(
      <BrowserRouter>
        <Search
          searchValue=""
          onChangeSearchValue={mockOnChange}
          onSearch={successfulSearchMock}
        />
      </BrowserRouter>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('calls onChange handler with new value', () => {
    render(
      <BrowserRouter>
        <Search
          searchValue=""
          onChangeSearchValue={mockOnChange}
          onSearch={successfulSearchMock}
        />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'pikachu' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('pikachu');
  });

  test('calls onSearch with trimmed value when button clicked', async () => {
    render(
      <BrowserRouter>
        <Search
          searchValue="  charizard  "
          onChangeSearchValue={mockOnChange}
          onSearch={successfulSearchMock}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(successfulSearchMock).toHaveBeenCalledWith('charizard');
    });
  });

  test('shows error message when search fails', async () => {
    const errorMessage = 'Search failed';
    const failingSearchMock = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <Search
          searchValue="error-case"
          onChangeSearchValue={mockOnChange}
          onSearch={failingSearchMock}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('search-error')).toBeInTheDocument();
      expect(screen.getByTestId('search-error')).toHaveTextContent(
        'Search failed. Please try again.'
      );
    });
  });

  test('clears error message on new search attempt', async () => {
    const errorMessage = 'Search failed';
    const mockSearch = jest
      .fn()
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <Search
          searchValue="error-case"
          onChangeSearchValue={mockOnChange}
          onSearch={mockSearch}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByTestId('search-error')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.queryByTestId('search-error')).not.toBeInTheDocument();
    });
  });
});
