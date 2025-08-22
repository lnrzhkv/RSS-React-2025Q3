'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/shared/store/store.ts';

export default function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
