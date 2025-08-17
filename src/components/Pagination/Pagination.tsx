'use client';
import React from 'react';
import styles from './Pagination.module.css';

interface Props {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  hasPrev,
  hasNext,
  onPreviousPage,
  onNextPage,
  onPageChange,
  className,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const maxVisiblePages = 5;
  let startPage: number, endPage: number;

  if (totalPages <= maxVisiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
    const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

    if (currentPage <= maxPagesBeforeCurrent) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrent;
      endPage = currentPage + maxPagesAfterCurrent;
    }
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div
      className={`${styles.pagination} ${className ? className : ''}`}
      data-testid="pagination"
    >
      <button
        onClick={onPreviousPage}
        disabled={!hasPrev}
        className={`${styles.pageButton} ${!hasPrev ? styles.disabled : ''}`}
        data-testid="pagination-prev"
      >
        &laquo;
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${styles.pageButton} ${currentPage === 1 ? styles.active : ''}`}
            disabled={currentPage === 1}
            data-testid="pagination-first"
          >
            1
          </button>
          {startPage > 2 && (
            <span
              className={styles.ellipsis}
              data-testid="pagination-ellipsis-start"
            >
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
          disabled={currentPage === page}
          data-testid={`pagination-page-${page}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span
              className={styles.ellipsis}
              data-testid="pagination-ellipsis-end"
            >
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ''}`}
            disabled={currentPage === totalPages}
            data-testid="pagination-last"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={onNextPage}
        disabled={!hasNext}
        className={`${styles.pageButton} ${!hasNext ? styles.disabled : ''}`}
        data-testid="pagination-next"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
