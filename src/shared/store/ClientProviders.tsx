'use client';
import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store.ts';
import type { RootState } from './store.ts';

type Props = {
  children: React.ReactNode;
  preloadedState?: Partial<RootState>;
};

export default function ClientProviders({ children, preloadedState }: Props) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState) as AppStore;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
