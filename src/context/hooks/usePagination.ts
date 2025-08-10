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

  const totalPages = paginationData
    ? Math.ceil(paginationData.count / LIMIT)
    : 0;

  const hasNext = Boolean(paginationData?.next);
  const hasPrev = Boolean(paginationData?.previous);

  const getInitialPage = () => {
    const pageParam = searchParams.get('page');
    if (pageParam && !isNaN(Number(pageParam))) {
      return String(Number(pageParam));
    }
    return String(sessionStorage.getItem('pokemonListPage') || DEFAULT_PAGE);
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('page')) {
      const savedPage =
        sessionStorage.getItem('pokemonListPage') || DEFAULT_PAGE;
      params.set('page', String(savedPage));
      setSearchParams(params, { replace: true });
    }
  }, [location.search, setSearchParams]);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params, { replace: true });
    setCurrentPage(String(page));
    sessionStorage.setItem('pokemonListPage', String(page));
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
