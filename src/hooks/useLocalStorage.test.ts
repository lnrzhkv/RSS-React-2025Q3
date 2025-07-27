import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

const localStorageMock = (() => {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('returns value from localStorage if it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored value'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('stored value');
  });

  it('uses fallback if there is nothing in localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('empty-key', 'default')
    );
    expect(result.current[0]).toBe('default');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('update-key', 'default')
    );

    act(() => {
      result.current[1]('new value');
    });

    expect(JSON.parse(localStorage.getItem('update-key') || '{}')).toBe(
      'new value'
    );
    expect(result.current[0]).toBe('new value');
  });

  it('handles invalid JSON in localStorage', () => {
    localStorage.setItem('broken-key', '{broken json');
    const { result } = renderHook(() => useLocalStorage('broken-key', 'safe'));
    expect(result.current[0]).toBe('safe');
  });

  it('uses fallback if parsed value is an object', () => {
    localStorage.setItem('object-key', JSON.stringify({}));
    const { result } = renderHook(() =>
      useLocalStorage('object-key', 'fallbackObj')
    );
    expect(result.current[0]).toBe('fallbackObj');
  });
});
