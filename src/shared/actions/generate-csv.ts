'use server';

import type { SelectedItem } from '@/shared/store/selectedItemsSlice.ts';

export async function generateCSV(data: SelectedItem[]) {
  const csvRows = [
    'id,name,description,detailsUrl',
    ...data.map(
      (item) =>
        `${item.id},"${item.name}","${item.description ?? ''}",${item.detailsUrl ?? ''}`
    ),
  ];

  return csvRows.join('\n');
}
