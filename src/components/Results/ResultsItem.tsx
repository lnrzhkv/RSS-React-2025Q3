import React from 'react';
import styles from './Results.module.css';
import type { Character } from '../../services/api/types';

class ResultsItem extends React.Component<{ character: Character }> {
  render() {
    const { character } = this.props;
    return (
      <div className={styles.characterCard}>
        <h3 className={styles.characterName}>{character.name}</h3>
        <p className={styles.characterDetails}>
          Height: {character.height}, Weight: {character.weight}
        </p>
        <p className={styles.characterType}>
          Types: {character.types.map((t) => t.type.name).join(', ')}
        </p>
      </div>
    );
  }
}

export default ResultsItem;
