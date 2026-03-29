// frontend/composables/useApi.js
//
// Wraps $fetch with the backend base URL from Nuxt runtime config.
// Usage:
//   const { get } = useApi()
//   const data = await get('/health')

export function useApi() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const get = (path, opts = {}) =>
    $fetch(path, { baseURL, method: 'GET', ...opts });

  const post = (path, body, opts = {}) =>
    $fetch(path, { baseURL, method: 'POST', body, ...opts });

  return { get, post };
}
