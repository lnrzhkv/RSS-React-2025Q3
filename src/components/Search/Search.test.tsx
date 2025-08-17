import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

describe('Search component', () => {
  const tMock = jest.fn((key: string) => {
    if (key === 'searchPlaceholder') return 'Type to search';
    if (key === 'searchButton') return 'Go';
    return key;
  });

  const onChangeSearchValue = jest.fn();
  const onSearch = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslations as jest.Mock).mockReturnValue(tMock);
  });

  it('renders input and button with correct attributes', () => {
    render(
      <Search
        searchValue="hello"
        onChangeSearchValue={onChangeSearchValue}
        onSearch={onSearch}
        data-testid="search-root"
      />
    );

    expect(screen.getByTestId('search-root')).toBeInTheDocument();

    const input = screen.getByTestId('search-input') as HTMLInputElement;
    expect(input.value).toBe('hello');
    expect(input).toHaveAttribute('placeholder', 'Type to search');

    const button = screen.getByTestId('search-button');
    expect(button).toHaveTextContent('Go');
    expect(button).toHaveAttribute('aria-label', 'Search');
  });

  it('calls onChangeSearchValue on user typing', () => {
    render(
      <Search
        searchValue=""
        onChangeSearchValue={onChangeSearchValue}
        onSearch={onSearch}
      />
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(onChangeSearchValue).toHaveBeenCalledTimes(1);
    expect(onChangeSearchValue).toHaveBeenCalledWith('abc');
  });

  it('calls onSearch with trimmed value when clicking the button', () => {
    render(
      <Search
        searchValue="  spaced value  "
        onChangeSearchValue={onChangeSearchValue}
        onSearch={onSearch}
      />
    );

    const button = screen.getByTestId('search-button');
    fireEvent.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('spaced value');
  });

  it('does not show an error message initially', () => {
    render(
      <Search
        searchValue=""
        onChangeSearchValue={onChangeSearchValue}
        onSearch={onSearch}
      />
    );

    expect(screen.queryByTestId('search-error')).toBeNull();
  });
});
