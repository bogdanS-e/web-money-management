import { useEffect, useRef } from 'react'

const useMountedEffect = (callback: () => void, deps: any[]) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      callback();
    } else {
      isMounted.current = true;
    }
  }, [...deps]);
}

export default useMountedEffect;
