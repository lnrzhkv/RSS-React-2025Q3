'use client';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface PaginationState {
  next: string | null;
  previous: string | null;
  count: number;
}

const DEFAULT_PAGE = 1;
const LIMIT = 10;

export function usePagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getCurrentPage = useCallback(() => {
    const p = Number(searchParams.get('page'));
    return !isNaN(p) && p > 0 ? p : DEFAULT_PAGE;
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [getCurrentPage]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const setPage = useCallback(
    (page: number) => {
      const qs = createQueryString('page', String(page));
      router.replace(`${pathname}?${qs}`);
      setCurrentPage(page);
    },
    [createQueryString, pathname, router]
  );

  const [paginationData, setPaginationData] = useState<PaginationState | null>(
    null
  );

  const totalPages = useMemo(
    () => (paginationData ? Math.ceil(paginationData.count / LIMIT) : 0),
    [paginationData]
  );
  const hasNext = Boolean(paginationData?.next);
  const hasPrev = Boolean(paginationData?.previous);

  return {
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    setPage,
    paginationData,
    setPaginationData,
  };
}
