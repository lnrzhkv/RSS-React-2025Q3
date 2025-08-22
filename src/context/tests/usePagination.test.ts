import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../hooks/usePagination';

const mockSetSearchParams = jest.fn();
let mockSearchParams: URLSearchParams;
let mockLocation: { search: string };

jest.mock('react-router-dom', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  useLocation: () => mockLocation,
}));

describe('usePagination', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    mockLocation = { search: '' };
    mockSetSearchParams.mockReset();
  });

  it('should set default page param if missing', () => {
    mockLocation.search = '';
    renderHook(() => usePagination());
    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
      { replace: true }
    );
    expect(mockSetSearchParams.mock.calls[0][0].get('page')).toBe('1');
  });

  it('should get currentPage from searchParams if set', () => {
    mockSearchParams = new URLSearchParams('page=4');
    mockLocation.search = '?page=4';
    const { result } = renderHook(() => usePagination());
    expect(result.current.currentPage).toBe('4');
  });

  it('should return currentPage as 1 if param missing', () => {
    mockSearchParams = new URLSearchParams();
    mockLocation.search = '';
    const { result } = renderHook(() => usePagination());
    expect(result.current.currentPage).toBe('1');
  });

  it('should calculate totalPages based on count', () => {
    mockSearchParams = new URLSearchParams();
    mockLocation.search = '';
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setPaginationData({
        next: '3',
        previous: null,
        count: 37,
      });
    });
    expect(result.current.totalPages).toBe(4);
  });

  it('should return hasNext and hasPrev correctly', () => {
    mockSearchParams = new URLSearchParams();
    mockLocation.search = '';
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setPaginationData({
        next: '2',
        previous: null,
        count: 20,
      });
    });
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrev).toBe(false);

    act(() => {
      result.current.setPaginationData({
        next: null,
        previous: '1',
        count: 20,
      });
    });
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrev).toBe(true);
  });

  it('should update page in searchParams when setPage called', () => {
    mockSearchParams = new URLSearchParams();
    mockLocation.search = '';
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setPage(5);
    });

    const params = mockSetSearchParams.mock.calls[1][0];
    const options = mockSetSearchParams.mock.calls[1][1];
    expect(params.get('page')).toBe('5');
    expect(options).toEqual({ replace: true });
  });
});
