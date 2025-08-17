'use client';

export function generateCSVBlob(csvString: string) {
  return new Blob([csvString], { type: 'text/csv' });
}
