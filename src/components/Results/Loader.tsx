import React from 'react';
import styles from './Results.module.css';

class Loader extends React.Component {
  render() {
    return (
      <div className={styles.loaderContainer}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.skeletonItem}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonBody}></div>
          </div>
        ))}
      </div>
    );
  }
}

export default Loader;
