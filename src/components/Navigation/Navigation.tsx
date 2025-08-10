import React from 'react';
import styles from './Navigation.module.css';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../context/hooks/useThemeContext';

const Navigation: React.FC = () => {
  const navigator = useNavigate();
  const { toggleTheme, theme } = useThemeContext();

  const handleNavigate = (path: string) => {
    navigator(path);
  };

  return (
    <nav data-testid={'nav'} className={styles.nav}>
      <div
        data-testid="nav-item-home"
        onClick={() => handleNavigate('/')}
        className={styles.navLink}
      >
        Home
      </div>
      <div
        data-testid="nav-item-about"
        onClick={() => handleNavigate('/about')}
        className={styles.navLink}
      >
        About
      </div>
      <button
        onClick={toggleTheme}
        className={styles.themeToggle}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '☾' : '☀︎'}
      </button>
    </nav>
  );
};

export default Navigation;
