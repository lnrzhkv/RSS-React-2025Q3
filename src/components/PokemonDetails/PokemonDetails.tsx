import React, { useCallback, useEffect, useState } from 'react';
import Box from '../../components/Box/Box';
import { useLocation, useSearchParams } from 'react-router-dom';
import styles from './PokemonDetails.module.css';
import { useGetPokemonDetailsQuery } from '../../shared/api/apiSlice';
import Loader from '../Results/Loader';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

const PokemonDetails: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [charId, setCharId] = useState<string | null | undefined>();

  const {
    data: details,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetPokemonDetailsQuery(charId ?? '', { skip: !charId });

  const handleClose = () => {
    searchParams.delete('characterId');
    setSearchParams(searchParams);
  };

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const characterId = params.get('characterId');
    setCharId(characterId);
  }, [location.search]);

  if (!charId) return null;

  const getErrorMessage = (error: FetchBaseQueryError | unknown): string => {
    if (typeof error === 'object' && error !== null) {
      const queryError = error as FetchBaseQueryError;
      if (
        'data' in queryError &&
        typeof queryError.data === 'object' &&
        queryError.data !== null
      ) {
        const errorData = queryError.data as { error?: string };
        return errorData.error || 'Failed to load details';
      }
    }
    return 'Failed to load details';
  };

  const listData = [
    { label: 'Base happyness', value: details?.baseHappyness },
    { label: 'Color', value: details?.color },
    { label: 'Generation', value: details?.generation },
    { label: 'Growth rate', value: details?.growthRate },
    { label: 'Shape', value: details?.shape },
    { label: 'Form switchable', value: details?.formSwitchable },
    { label: 'Baby', value: details?.isBaby },
    { label: 'Legendary', value: details?.isLegendary },
    { label: 'Mythical', value: details?.isMythical },
  ];

  return (
    <Box className={styles.container} data-testid="details-container">
      <div
        className={styles.close}
        data-testid="details-close"
        onClick={handleClose}
      >
        &#10005;
      </div>

      <button
        onClick={handleRefresh}
        disabled={isFetching}
        className={styles.refreshButton}
        data-testid="details-refresh-button"
        aria-label="Refresh details"
      >
        <FontAwesomeIcon
          icon={faSync}
          spin={isFetching}
          className={`${styles.refreshIcon} ${isFetching ? styles.spinning : ''}`}
        />
      </button>

      {isLoading && <Loader data-testid="details-loader" />}

      {isError && (
        <div className={styles.errorContainer} data-testid="details-error">
          <p className={styles.errorTitle}>Error</p>
          <p>{getErrorMessage(error)}</p>
        </div>
      )}

      {details && (
        <>
          <div className={styles.name} data-testid="details-name">
            {details.name}
          </div>

          {details.flavorText && (
            <p data-testid="details-flavor">{details.flavorText}</p>
          )}

          {details.formDescription && (
            <p data-testid="details-form-desc">{details.formDescription}</p>
          )}

          <ul className={styles.ul} data-testid="details-list">
            {listData.map((item) => (
              <li
                className={styles.li}
                key={item.label}
                data-testid="details-list-item"
              >
                <div className={styles.liWrapper}>
                  <span>{item.label}:</span> <span>{item.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Box>
  );
};

export default PokemonDetails;
