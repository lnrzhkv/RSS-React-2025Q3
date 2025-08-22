import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

interface PaginationState {
  next: string | null;
  previous: string | null;
  count: number;
}

const DEFAULT_PAGE = 1;
const LIMIT = 10;

export const usePagination = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [paginationData, setPaginationData] = useState<PaginationState | null>(
    null
  );

  const currentPage = String(Number(searchParams.get('page')) || DEFAULT_PAGE);

  const totalPages = paginationData
    ? Math.ceil(paginationData.count / LIMIT)
    : 0;

  const hasNext = Boolean(paginationData?.next);
  const hasPrev = Boolean(paginationData?.previous);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('page')) {
      params.set('page', String(DEFAULT_PAGE));
      setSearchParams(params, { replace: true });
    }
  }, [location.search]);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params, { replace: true });
  };

  const updatePaginationData = (data: PaginationState) => {
    setPaginationData(data);
  };

  return {
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    setPage,
    setPaginationData: updatePaginationData,
  };
};
