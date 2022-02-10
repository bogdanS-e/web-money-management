import { useEffect } from 'react';

interface IListeners {
  [key: string]: (data: any) => void;
}

const useExtensionMessages = (
  listeners: IListeners,
  dependencies: any[],
): void => {
  const onMessage = (event) => {
    listeners?.[event.data.action]?.(event.data.payload);
  };

  useEffect(() => {
    window.addEventListener('message', onMessage, false);

    return () => window.removeEventListener('message', onMessage, false);
  }, [...dependencies]);
};

export default useExtensionMessages;
