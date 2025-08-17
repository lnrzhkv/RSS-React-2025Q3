import React from 'react';
import styles from './SelectedItemsFlyout.module.css';
import type { SelectedItem } from '@/shared/store/selectedItemsSlice.ts';
import { useTranslations } from 'next-intl';

interface Props {
  items: SelectedItem[];
}

const SelectedItemsFlyoutView = ({ items }: Props) => {
  const t = useTranslations('SelectedItems');

  if (!items || items.length === 0) return null;

  const itemsText =
    items.length === 1
      ? t('itemSelected', { count: items.length })
      : t('itemsSelected', { count: items.length });

  return (
    <div className={styles.flyoutWrapper} data-testid="selected-items-flyout">
      <div className={styles.flyoutBox}>
        <span className={styles.count}>{itemsText}</span>
        <button className={styles.button}>{t('unselectAll')}</button>
        <button className={styles.button}>{t('downloadCSV')}</button>
        <a style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default SelectedItemsFlyoutView;
