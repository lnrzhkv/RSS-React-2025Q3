import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './AppLayout.module.css';
import Navigation from '../../components/Navigation/Navigation';
import { useThemeContext } from '../../context/hooks/useThemeContext';

const AppLayout: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <div
      data-testid="layout-container"
      className={`${styles.appContainer} ${styles[theme]}`}
    >
      <Navigation />

      <div data-testid="outlet-slot">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
