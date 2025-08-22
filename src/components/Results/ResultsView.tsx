import React from 'react';
import ResultsItemView from './ResultsItemView.tsx';
import Loader from '@/components/Results/Loader.tsx';
import styles from './Results.module.css';
import type { CharacterWithImage } from '@/shared/api/types.ts';
import { useTranslations } from 'next-intl';

interface ResultsViewProps {
  characters: CharacterWithImage[];
  isLoading?: boolean;
  isError?: boolean;
}

const ResultsView = ({ characters, isLoading, isError }: ResultsViewProps) => {
  const t = useTranslations('Results');

  if (isLoading) {
    return <Loader />;
  }

  if (!characters || characters.length === 0 || isError) {
    return <div className={styles.noResults}>{t('noPokemonFound')}</div>;
  }

  return (
    <div className={styles.resultsContainer} data-testid="results-container">
      {characters.map((character) => (
        <div key={character.id} data-character-id={String(character.id)}>
          <ResultsItemView
            character={character}
            description={t('heightWeight', {
              height: character.height,
              weight: character.weight,
            })}
            typesText={character.types.map((tt) => tt.type.name).join(', ')}
          />
        </div>
      ))}
    </div>
  );
};

export default ResultsView;
