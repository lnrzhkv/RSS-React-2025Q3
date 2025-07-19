import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './Loader';

describe('Loader Component', () => {
  test('renders loader with 5 skeleton items', () => {
    render(<Loader />);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();

    const skeletonItems = loader.querySelectorAll('.skeletonItem');
    expect(skeletonItems).toHaveLength(5);
  });

  test('each skeleton item has title and body', () => {
    render(<Loader />);

    const loader = screen.getByTestId('loader');
    const firstItem = loader.querySelector('.skeletonItem');

    expect(firstItem?.querySelector('.skeletonTitle')).toBeInTheDocument();
    expect(firstItem?.querySelector('.skeletonBody')).toBeInTheDocument();
  });
});
