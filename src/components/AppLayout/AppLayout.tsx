import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './AppLayout.module.css';
import Navigation from '../../components/Navigation/Navigation';

const AppLayout: React.FC = () => {
  return (
    <div data-testid="layout-container" className={styles.appContainer}>
      <Navigation />

      <div data-testid="outlet-slot">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
