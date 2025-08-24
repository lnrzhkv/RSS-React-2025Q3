import { render, screen } from '@testing-library/react';
import ImageLoader from './ImageLoader';

describe('ImageLoader', () => {
  const testId = 'test-imageloader';
  const defaultId = 'test-id';

  test('renders with default props', () => {
    render(<ImageLoader id={defaultId} testId={testId} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-input`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-label`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-svg`)).toBeInTheDocument();
  });
});
