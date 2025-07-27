import React, { useEffect, useState } from 'react';
import Box from '../../components/Box/Box';
import { useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';
import styles from './PokemonDetails.module.css';
import usePokemonDetails from './hooks/usePokemonDetails';
import Loader from '../Results/Loader';

const PokemonDetails: React.FC = () => {
  const { setIsDetailsOpen, isDetailsOpen } = useGlobalContext();
  const location = useLocation();
  const [charId, setCharId] = useState<string | null | undefined>();

  const { details, loading, error } = usePokemonDetails({ charId });

  console.log(details, 'details');
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const characterId = params.get('characterId');
    setCharId(characterId);

    if (!characterId) {
      setIsDetailsOpen(false);
    }
  }, [location.search]);

  if (!isDetailsOpen) return null;

  if (loading)
    return (
      <Box className={styles.container} data-testid="details-container">
        <Loader data-testid="details-loader" />
      </Box>
    );

  if (error)
    return (
      <Box className={styles.container} data-testid="details-container">
        <div className={styles.errorContainer} data-testid="details-error">
          <p className={styles.errorTitle}>Error</p>
          <p>{error}</p>
        </div>
      </Box>
    );

  const listData = [
    {
      label: 'Base happyness',
      value: details?.baseHappyness,
    },
    {
      label: 'Color',
      value: details?.color,
    },

    {
      label: 'Generation',
      value: details?.generation,
    },
    {
      label: 'Growth rate',
      value: details?.growthRate,
    },
    {
      label: 'Shape',
      value: details?.shape,
    },
    {
      label: 'Form swithcable',
      value: details?.formSwitchable,
    },
    {
      label: 'Baby',
      value: details?.isBaby,
    },
    {
      label: 'Legendary',
      value: details?.isLegendary,
    },
    {
      label: 'Mythical',
      value: details?.isMythical,
    },
  ];

  return (
    <Box className={styles.container} data-testid="details-container">
      <div
        className={styles.close}
        data-testid="details-close"
        onClick={() => setIsDetailsOpen(false)}
      >
        &#10005;
      </div>

      <div className={styles.name} data-testid="details-name">
        {details?.name}
      </div>

      {details?.flavorText && (
        <p data-testid="details-flavor">{details.flavorText}</p>
      )}

      {details?.formDescription && (
        <p data-testid="details-form-desc">{details.formDescription} </p>
      )}

      <ul className={styles.ul} data-testid="details-list">
        {listData.map((item) => {
          return (
            <li
              className={styles.li}
              key={item.label}
              data-testid="details-list-item"
            >
              <div className={styles.liWrapper}>
                <span>{item.label}:</span> <span>{item.value}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Box>
  );
};

export default PokemonDetails;
