import { render, screen } from '@testing-library/react';
import Box from './Box';

describe('Box Component', () => {
  it('renders children content', () => {
    render(<Box>Test Content</Box>);
    expect(screen.getByTestId('box')).toHaveTextContent('Test Content');
  });

  it('has the correct role attribute', () => {
    render(<Box>Test</Box>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(<Box>Test</Box>);
    const box = screen.getByTestId('box');
    expect(box).toHaveClass('box');
    expect(box).toHaveClass('withShadow');
  });

  it('applies shadow conditionally', () => {
    const { rerender } = render(<Box withShadow={true}>With Shadow</Box>);
    expect(screen.getByTestId('box')).toHaveClass('withShadow');

    rerender(<Box withShadow={false}>Without Shadow</Box>);
    expect(screen.getByTestId('box')).not.toHaveClass('withShadow');
  });

  it('merges custom className properly', () => {
    render(<Box className="custom-class">Test</Box>);
    const box = screen.getByTestId('box');
    expect(box).toHaveClass('box');
    expect(box).toHaveClass('custom-class');
  });

  it('handles all props together correctly', () => {
    render(
      <Box withShadow={false} className="custom-class">
        Complex Test
      </Box>
    );
    const box = screen.getByTestId('box');
    expect(box).toHaveClass('box');
    expect(box).not.toHaveClass('withShadow');
    expect(box).toHaveClass('custom-class');
    expect(box).toHaveTextContent('Complex Test');
    expect(box).toHaveAttribute('role', 'banner');
  });
});
