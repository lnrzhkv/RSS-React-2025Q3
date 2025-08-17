'use client';

import { useTranslations } from 'next-intl';
import styles from './AboutPage.module.css';
import { Link } from '@/shared/lib/navigation.ts';

const AboutPage: React.FC = () => {
  const t = useTranslations('AboutPage');

  const getSavedPage = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('pokemonListPage') || '1';
    }
    return '1';
  };

  return (
    <div className={styles.aboutContainer}>
      <h1>{t('title')}</h1>
      <p>
        {t('developedBy')} <Link href="https://github.com/lnrzhkv">me</Link>
      </p>
      <p>
        {t('coursePart')}{' '}
        <Link
          className={styles.courseLink}
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          {t('react')}
        </Link>
      </p>
      <Link href={`/?page=${getSavedPage()}`} className={styles.backLink}>
        {t('backButton')}
      </Link>
    </div>
  );
};

export default AboutPage;
