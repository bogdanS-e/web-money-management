export default function useQueryParams<T>(): T {
  if (typeof window === "undefined") return JSON.parse('2');

  let params = window.location.search.substring(1)

  if (!params.length) return {} as T

  params = decodeURIComponent(params);

  return JSON.parse(`{"${params.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)
}
