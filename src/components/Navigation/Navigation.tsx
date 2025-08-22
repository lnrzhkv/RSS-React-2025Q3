import React from 'react';
import styles from './Navigation.module.css';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';

const Navigation: React.FC = () => {
  const navigator = useNavigate();
  const { onChangeSearchValue, fetchPokemons } = useGlobalContext();

  const handleNavigate = (from: string) => {
    onChangeSearchValue('');
    fetchPokemons(1);
    navigator(from);
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
    </nav>
  );
};

export default Navigation;
