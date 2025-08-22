'use client';
import styles from './NotFoundPage.module.css';
import { Link } from '@/shared/lib/navigation.ts';
import { useTranslations } from 'next-intl';

const NotFoundPage = () => {
  const t = useTranslations('NotFound');

  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.notFoundTitle}>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/" className={styles.homeLink}>
        {t('homeLink')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
