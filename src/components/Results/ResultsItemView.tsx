import React from 'react';
import styles from './Results.module.css';
import type { CharacterWithImage } from '@/shared/api/types.ts';
import Image from 'next/image';

interface Props {
  character: CharacterWithImage;
  description: string;
  typesText: string;
}

const ResultsItemView: React.FC<Props> = ({
  character,
  description,
  typesText,
}) => {
  return (
    <div className={styles.characterInfo}>
      <div>
        <h3 className={styles.characterName}>{character.name}</h3>
        <p className={styles.characterDetails}>{description}</p>
        <p className={styles.characterType}>Types: {typesText}</p>
      </div>
      <div className={styles.characterImageWrapper}>
        <Image
          width={96}
          height={96}
          src={character.image}
          alt={character.name}
        />
      </div>
    </div>
  );
};

export default ResultsItemView;
