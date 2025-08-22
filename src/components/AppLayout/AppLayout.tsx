'use client';
import React from 'react';
import styles from './AppLayout.module.css';
import Navigation from '@/components/Navigation/Navigation.tsx';
import { useThemeContext } from '@/context/hooks/useThemeContext.ts';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <div
      data-testid="layout-container"
      className={`${styles.appContainer} ${styles[theme]}`}
    >
      <Navigation />
      <div data-testid="content-slot" className={styles.contentContainer}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
