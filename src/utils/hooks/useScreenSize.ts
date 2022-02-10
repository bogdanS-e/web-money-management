import { useCallback, useLayoutEffect, useState } from 'react';

const initialState = {
  width: 0,
  height: 0,
};

const useScreenSize = () => {
  const [size, setSize] = useState(initialState);

  const updateSize = useCallback(() => {
    setSize({
      width: document.body.clientWidth || window.innerWidth,
      height: document.body.clientHeight || window.innerHeight,
    });
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

export default useScreenSize;
