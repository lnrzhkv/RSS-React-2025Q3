import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/store/store';
import { clearItems } from '../../shared/store/selectedItemsSlice';
import styles from './SelectedItemsFlyout.module.css';

const SelectedItemsFlyout: React.FC = () => {
  const selectedItems = useSelector((state: RootState) => state.selectedItems);
  const dispatch = useDispatch();
  const downloadLinkRef = React.useRef<HTMLAnchorElement>(null);

  if (selectedItems.length === 0) return null;

  const handleUnselectAll = () => {
    dispatch(clearItems());
  };

  const handleDownload = () => {
    const csvRows = [
      'id,name,description,detailsUrl',
      ...selectedItems.map(
        (item) =>
          `${item.id},"${item.name}","${item.description ?? ''}",${item.detailsUrl ?? ''}`
      ),
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = `${selectedItems.length}_items.csv`;
      downloadLinkRef.current.click();
    }
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.flyoutWrapper} data-testid="selected-items-flyout">
      <div className={styles.flyoutBox}>
        <span className={styles.count}>
          {selectedItems.length}{' '}
          {selectedItems.length === 1
            ? 'item is selected'
            : 'items are selected'}
        </span>
        <button className={styles.button} onClick={handleUnselectAll}>
          Unselect all
        </button>
        <button className={styles.button} onClick={handleDownload}>
          Download
        </button>
        <a ref={downloadLinkRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default SelectedItemsFlyout;
