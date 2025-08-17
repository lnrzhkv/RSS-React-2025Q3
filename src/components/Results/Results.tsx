'use client';
import React from 'react';
import type { CharacterWithImage } from '@/shared/api/types.ts';
import { usePathname, useRouter } from '@/shared/lib/navigation.ts';
import { useSearchParams } from 'next/navigation.js';

import ResultsView from './ResultsView.tsx';

interface ResultsProps {
  characters: CharacterWithImage[];
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isError?: boolean;
  isLoading?: boolean;
}

const Results: React.FC<ResultsProps> = ({
  characters,
  isError,
  isLoading,
  setIsDetailsOpen,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDelegatedClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    const item = target?.closest('[data-character-id]') as HTMLElement | null;
    if (!item) return;
    const id = item.getAttribute('data-character-id');
    if (!id) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('characterId', id);
    router.replace(`${pathname}?${params.toString()}`);
    setIsDetailsOpen(true);
  };

  return (
    <div onClick={handleDelegatedClick}>
      <ResultsView
        characters={characters}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default Results;
