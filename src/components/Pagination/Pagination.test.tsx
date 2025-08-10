import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  const onPrev = jest.fn();
  const onNext = jest.fn();
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when totalPages is 0 or 1', () => {
    const { container: c1 } = render(
      <Pagination
        currentPage={1}
        totalPages={0}
        hasPrev={false}
        hasNext={false}
        onPreviousPage={onPrev}
        onNextPage={onNext}
        onPageChange={onChange}
      />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        hasPrev={false}
        hasNext={false}
        onPreviousPage={onPrev}
        onNextPage={onNext}
        onPageChange={onChange}
      />
    );
    expect(c2.firstChild).toBeNull();
  });

  test('renders all pages when totalPages <= maxVisiblePages (5)', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        hasPrev
        hasNext
        onPreviousPage={onPrev}
        onNextPage={onNext}
        onPageChange={onChange}
        className="extra"
      />
    );

    expect(screen.getByTestId('pagination')).toHaveClass('extra');
    expect(screen.getByTestId('pagination-prev')).toBeEnabled();
    expect(screen.getByTestId('pagination-next')).toBeEnabled();

    for (let i = 1; i <= 5; i++) {
      const btn = screen.getByTestId(`pagination-page-${i}`);
      expect(btn).toBeInTheDocument();
      if (i === 3) {
        expect(btn).toBeDisabled();
      } else {
        expect(btn).toBeEnabled();
        fireEvent.click(btn);
        expect(onChange).toHaveBeenLastCalledWith(i);
      }
    }

    expect(screen.queryByTestId('pagination-first')).toBeNull();
    expect(screen.queryByTestId('pagination-last')).toBeNull();
    expect(screen.queryByTestId('pagination-ellipsis-start')).toBeNull();
    expect(screen.queryByTestId('pagination-ellipsis-end')).toBeNull();

    fireEvent.click(screen.getByTestId('pagination-prev'));
    expect(onPrev).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('pagination-next'));
    expect(onNext).toHaveBeenCalled();
  });

  describe('when totalPages > maxVisiblePages', () => {
    test('at the start: currentPage <= 2', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          hasPrev={false}
          hasNext
          onPreviousPage={onPrev}
          onNextPage={onNext}
          onPageChange={onChange}
        />
      );

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByTestId(`pagination-page-${i}`)).toBeInTheDocument();
      }

      expect(screen.queryByTestId('pagination-first')).toBeNull();
      expect(screen.queryByTestId('pagination-ellipsis-start')).toBeNull();

      expect(screen.getByTestId('pagination-ellipsis-end')).toBeInTheDocument();
      const lastBtn = screen.getByTestId('pagination-last');
      expect(lastBtn).toBeInTheDocument();
      expect(lastBtn).toHaveTextContent('10');
      expect(lastBtn).toBeEnabled();
    });

    test('in the middle: shows both ellipses and first/last shortcuts', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          hasPrev
          hasNext
          onPreviousPage={onPrev}
          onNextPage={onNext}
          onPageChange={onChange}
        />
      );

      expect(screen.getByTestId('pagination-first')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-first')).toHaveTextContent('1');
      expect(
        screen.getByTestId('pagination-ellipsis-start')
      ).toBeInTheDocument();

      for (let i = 3; i <= 7; i++) {
        const btn = screen.getByTestId(`pagination-page-${i}`);
        expect(btn).toBeInTheDocument();
        if (i === 5) {
          expect(btn).toBeDisabled();
        } else {
          fireEvent.click(btn);
          expect(onChange).toHaveBeenLastCalledWith(i);
        }
      }

      expect(screen.getByTestId('pagination-ellipsis-end')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-last')).toBeInTheDocument();
    });

    test('at the end: currentPage + after >= totalPages', () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          hasPrev
          hasNext={false}
          onPreviousPage={onPrev}
          onNextPage={onNext}
          onPageChange={onChange}
        />
      );

      for (let i = 6; i <= 10; i++) {
        expect(screen.getByTestId(`pagination-page-${i}`)).toBeInTheDocument();
      }

      expect(screen.getByTestId('pagination-first')).toBeInTheDocument();
      expect(
        screen.getByTestId('pagination-ellipsis-start')
      ).toBeInTheDocument();
      expect(screen.queryByTestId('pagination-ellipsis-end')).toBeNull();
      expect(screen.queryByTestId('pagination-last')).toBeNull();

      expect(screen.getByTestId('pagination-prev')).toBeEnabled();
      expect(screen.getByTestId('pagination-next')).toBeDisabled();
    });
  });
});
