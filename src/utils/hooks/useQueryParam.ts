import React from 'react';
import { useRouter } from 'next/router';

export function useQueryParam(paramName: string) {
  const router = useRouter();

  const paramValue = React.useMemo(() => {
    return router.query[paramName] as string;
  }, [paramName, router.query]);

  return paramValue;
}
