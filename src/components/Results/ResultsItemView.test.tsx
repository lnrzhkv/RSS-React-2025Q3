import { render, screen } from '@testing-library/react';
import ResultsItemView from './ResultsItemView';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

describe('ResultsItemView', () => {
  const character = {
    name: 'Pikachu',
    image: '/images/pikachu.png',
  };

  const description = 'Electric rodent';
  const typesText = 'electric, mascot';

  beforeEach(() => {
    render(
      <ResultsItemView
        character={character}
        description={description}
        typesText={typesText}
      />
    );
  });

  it('renders the character name in an h3', () => {
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Pikachu');
  });

  it('renders the description paragraph', () => {
    const descNode = screen.getByText(description);
    expect(descNode).toBeInTheDocument();
  });

  it('renders the types paragraph with prefix', () => {
    const typesNode = screen.getByText(`Types: ${typesText}`);
    expect(typesNode).toBeInTheDocument();
  });

  it('renders the image with correct src and alt', () => {
    const img = screen.getByRole('img', { name: 'Pikachu' });
    expect(img).toHaveAttribute('src', '/images/pikachu.png');
    expect(img).toHaveAttribute('alt', 'Pikachu');
  });
});
