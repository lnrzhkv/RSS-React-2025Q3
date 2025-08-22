import React from 'react';
import styles from './Results.module.css';
import type { CharacterWithImage } from '../../services/api/types';

interface Props {
  character: CharacterWithImage;
}
const ResultsItem: React.FC<Props> = ({ character }) => {
  return (
    <div
      className={styles.characterCard}
      data-testid={`character-card-${character.id}`}
    >
      <div>
        <h3 className={styles.characterName}>{character.name}</h3>
        <p className={styles.characterDetails}>
          Height: {character.height}, Weight: {character.weight}
        </p>
        <p className={styles.characterType}>
          Types: {character.types.map((t) => t.type.name).join(', ')}
        </p>
      </div>
      <img src={character.image} alt={character.name} />
    </div>
  );
};

export default ResultsItem;
