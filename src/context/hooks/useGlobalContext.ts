import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

export const useGlobalContext = () => {
  const contextData = useContext(GlobalContext);

  if (!contextData) {
    throw new Error('No context data');
  }

  return contextData;
};
