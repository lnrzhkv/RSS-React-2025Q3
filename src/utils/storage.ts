export const getSearchTerm = (defaultValue = ''): string => {
  return localStorage.getItem('searchTerm') ?? defaultValue;
};

export const saveSearchTerm = (term: string): void => {
  localStorage.setItem('searchTerm', term);
};
