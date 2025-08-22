'use client';

import React, { useState } from 'react';
import styles from './ErrorButton.module.css';
import { useTranslations } from 'next-intl';

const ErrorButton: React.FC = () => {
  const [shouldError, setShouldError] = useState(false);
  const t = useTranslations('ErrorButton');

  const triggerError = () => {
    setShouldError(true);
  };

  if (shouldError) {
    throw new Error('Test error triggered by button click');
  }

  return (
    <button
      data-testid="error-button"
      className={styles.errorButton}
      onClick={triggerError}
    >
      {t('triggerError')}
    </button>
  );
};

export default ErrorButton;
