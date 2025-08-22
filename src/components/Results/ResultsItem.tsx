'use client';

import React from 'react';
import styles from './Results.module.css';
import type { CharacterWithImage } from '@/shared/api/types.ts';
import { RootState } from '@/shared/store/store.ts';
import { addItem, removeItem } from '@/shared/store/selectedItemsSlice.ts';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks.ts';
import { useTranslations } from 'next-intl';
import ResultsItemView from './ResultsItemView.tsx';

interface Props {
  character: CharacterWithImage;
}

const ResultsItem: React.FC<Props> = ({ character }) => {
  const t = useTranslations('ResultsItem');
  const selectedItems = useAppSelector(
    (state: RootState) => state.selectedItems
  );
  const dispatch = useAppDispatch();

  const isSelected = selectedItems.some(
    (item) => item.id === String(character.id)
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(
        addItem({
          id: String(character.id),
          name: character.name,
          description: t('description', {
            height: character.height,
            weight: character.weight,
          }),
          detailsUrl: `/details/${character.id}`,
        })
      );
    } else {
      dispatch(removeItem(String(character.id)));
    }
  };

  const typesText = character.types.map((tt) => tt.type.name).join(', ');
  const description = t('heightWeight', {
    height: character.height,
    weight: character.weight,
  });

  return (
    <div
      className={styles.characterCard}
      data-testid={`character-card-${character.id}`}
    >
      <label className={styles.toggle} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={t('selectAriaLabel', { name: character.name })}
          className={styles.toggleInput}
        />
        <span className={styles.slider}></span>
      </label>

      <ResultsItemView
        character={character}
        description={description}
        typesText={typesText}
      />
    </div>
  );
};

export default ResultsItem;
