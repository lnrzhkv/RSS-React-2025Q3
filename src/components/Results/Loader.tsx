import React from 'react';
import styles from './Results.module.css';

interface LoaderProps {
  testId?: string;
}

const Loader: React.FC<LoaderProps> = ({ testId }) => {
  return (
    <div className={styles.loaderContainer} data-testid={testId || 'loader'}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonBody}></div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
