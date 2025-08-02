import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './AppLayout.module.css';
import Navigation from '../../components/Navigation/Navigation';
import { useGlobalContext } from '../../context/hooks/useGlobalContext';

const AppLayout: React.FC = () => {
  const { theme } = useGlobalContext();
  return (
    <div
      data-testid="layout-container"
      className={styles.appContainer}
      data-theme={theme}
    >
      <Navigation />

      <div data-testid="outlet-slot">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
