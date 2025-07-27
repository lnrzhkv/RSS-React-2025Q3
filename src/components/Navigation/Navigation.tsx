import React from 'react';
import styles from './Navigation.module.css';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav data-testid={'nav'} className={styles.nav}>
      <Link data-testid="nav-item-home" to="/" className={styles.navLink}>
        Home
      </Link>
      <Link data-testid="nav-item-about" to="/about" className={styles.navLink}>
        About
      </Link>
    </nav>
  );
};

export default Navigation;
