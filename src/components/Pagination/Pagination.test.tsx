import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();
  const mockOnPreviousPage = jest.fn();
  const mockOnNextPage = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
    mockOnPreviousPage.mockClear();
    mockOnNextPage.mockClear();
  });

  it('renders pagination buttons correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        hasPrev={false}
        hasNext={true}
        onPreviousPage={mockOnPreviousPage}
        onNextPage={mockOnNextPage}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onPageChange when a page button is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        hasPrev={false}
        hasNext={true}
        onPreviousPage={mockOnPreviousPage}
        onNextPage={mockOnNextPage}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('2'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on the first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        hasPrev={false}
        hasNext={true}
        onPreviousPage={mockOnPreviousPage}
        onNextPage={mockOnNextPage}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByTestId('pagination-prev')).toBeDisabled();
  });

  it('disables next button on the last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        hasPrev={true}
        hasNext={false}
        onPreviousPage={mockOnPreviousPage}
        onNextPage={mockOnNextPage}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByTestId('pagination-next')).toBeDisabled();
  });

  it('renders correctly when totalPages is less than maxVisiblePages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        hasPrev={false}
        hasNext={true}
        onPreviousPage={mockOnPreviousPage}
        onNextPage={mockOnNextPage}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders correctly when currentPage is in the middle of the range', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        hasPrev={true}
        hasNext={true}
        onPreviousPage={mockOnPreviousPage}
        onNextPage={mockOnNextPage}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders first page button and ellipsis when startPage > 1', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        hasPrev={true}
        hasNext={true}
        onPreviousPage={mockOnPreviousPage}
        onNextPage={mockOnNextPage}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByTestId('pagination-first')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-ellipsis-start')).toBeInTheDocument();
  });
});
