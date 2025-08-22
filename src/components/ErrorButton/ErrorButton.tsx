import React, { useState } from 'react';
import styles from './ErrorButton.module.css';

const ErrorButton: React.FC = () => {
  const [shouldError, setShouldError] = useState(false);

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
      Trigger Test Error
    </button>
  );
};

export default ErrorButton;
