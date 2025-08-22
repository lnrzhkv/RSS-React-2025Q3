'use client';
import React, { type FC } from 'react';
import Box from '@/components/Box/Box.tsx';
import styles from './PokemonDetails.module.css';
import {
  pokemonApi,
  useGetPokemonDetailsQuery,
} from '@/shared/api/apiSlice.ts';
import Loader from '@/components/Results/Loader.tsx';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '@/shared/store/hooks.ts';
import { useRouter } from '@/shared/lib/navigation.ts';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation.js';

interface Props {
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PokemonDetails: FC<Props> = ({ setIsDetailsOpen }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const t = useTranslations('PokemonDetails');

  const characterId = searchParams.get('characterId');

  const {
    data: details,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetPokemonDetailsQuery(characterId ?? '', {
    skip: !characterId,
  });

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('characterId');
    router.replace(`/?${newParams.toString()}`);
    setIsDetailsOpen(false);
  };

  const handleRefresh = () => {
    dispatch(
      pokemonApi.util.invalidateTags([
        { type: 'PokemonDetails', id: 'characterId' },
      ])
    );
  };

  if (!characterId || !details) return null;

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
    { label: t('baseHappyness'), value: details?.baseHappyness },
    { label: t('color'), value: details?.color },
    { label: t('generation'), value: details?.generation },
    { label: t('growthRate'), value: details?.growthRate },
    { label: t('shape'), value: details?.shape },
    { label: t('formSwitchable'), value: details?.formSwitchable },
    { label: t('baby'), value: details?.isBaby },
    { label: t('legendary'), value: details?.isLegendary },
    { label: t('mythical'), value: details?.isMythical },
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
