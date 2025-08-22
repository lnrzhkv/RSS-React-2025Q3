'use client';
import React from 'react';
import styles from './Navigation.module.css';
import { useTranslations, useLocale } from 'next-intl';
import { Link, getPathname } from '@/shared/lib/navigation.ts';
import { useThemeContext } from '@/context/hooks/useThemeContext.ts';
import { usePathname } from '../../shared/lib/navigation.ts';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const { toggleTheme, theme } = useThemeContext();

  const fullPath = usePathname();

  const locale = useLocale();

  const rawPath = getPathname({
    href: fullPath,
    locale,
  });

  return (
    <nav data-testid="nav" className={styles.nav}>
      <Link href="/" className={styles.navLink}>
        {t('home')}
      </Link>

      <Link href="/about" className={styles.navLink}>
        {t('about')}
      </Link>

      <button
        onClick={toggleTheme}
        className={styles.themeToggle}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '☾' : '☀︎'}
      </button>

      <div className={styles.languageSwitcher}>
        <span>{t('language')}: </span>

        <Link
          href={rawPath}
          locale="en"
          className={styles.navLink}
          scroll={false}
        >
          {t('switchToEn')}
        </Link>

        <Link
          href={rawPath}
          locale="ru"
          className={styles.navLink}
          scroll={false}
        >
          {t('switchToRu')}
        </Link>
      </div>
    </nav>
  );
}
