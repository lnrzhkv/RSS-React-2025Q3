import React from 'react';
import styles from './Results.module.css';
import type { CharacterWithImage } from '../../services/api/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/store';
import { addItem, removeItem } from '../../shared/selectedItemsSlice';

interface Props {
  character: CharacterWithImage;
}
const ResultsItem: React.FC<Props> = ({ character }) => {
  const selectedItems = useSelector((state: RootState) => state.selectedItems);
  const dispatch = useDispatch();

  const isSelected = selectedItems.some(
    (item) => item.id === String(character.id)
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(
        addItem({
          id: String(character.id),
          name: character.name,
          description: `Height: ${character.height}, Weight: ${character.weight}`,
          detailsUrl: `/details/${character.id}`,
        })
      );
    } else {
      dispatch(removeItem(String(character.id)));
    }
  };

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
          aria-label={`select-${character.name}`}
          className={styles.toggleInput}
        />
        <span className={styles.slider}></span>
      </label>
      <div
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          width: 'calc(100% - 40px)',
        }}
      >
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
