'use client';

import React from 'react';
import { RootState } from '@/shared/store/store.ts';
import { clearItems } from '@/shared/store/selectedItemsSlice.ts';
import { generateCSV } from '@/shared/actions/generate-csv.ts';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks.ts';
import SelectedItemsFlyoutView from './SelectedItemsFlyoutView.tsx';
import { generateCSVBlob } from '../../shared/actions/generate-csv.client.ts';

const SelectedItemsFlyout: React.FC = () => {
  const selectedItems = useAppSelector(
    (state: RootState) => state.selectedItems
  );
  const dispatch = useAppDispatch();
  const downloadLinkRef = React.useRef<HTMLAnchorElement>(null);

  if (selectedItems.length === 0) return null;

  const handleUnselectAll = () => {
    dispatch(clearItems());
  };

  const handleDownload = async () => {
    const csvString = await generateCSV(selectedItems);
    if (!csvString) return;

    const blob = generateCSVBlob(csvString);

    const url = URL.createObjectURL(blob);

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = `${selectedItems.length}_items.csv`;
      downloadLinkRef.current.click();
    }
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SelectedItemsFlyoutView items={selectedItems} />
      <div style={{ display: 'none' }}>
        <a ref={downloadLinkRef} />
      </div>
      <div style={{ display: 'none' }}>
        <button onClick={handleUnselectAll} />
        <button onClick={handleDownload} />
      </div>
    </>
  );
};

export default SelectedItemsFlyout;
