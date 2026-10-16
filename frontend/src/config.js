// In development, reach the Django backend on the same host that served the page,
// so the app works from localhost and from other devices on the network (e.g. a phone).
const withTrailingSlash = (url) => (url.endsWith("/") ? url : `${url}/`);

export const API_BASE_URL = import.meta.env.DEV
    ? `${window.location.protocol}//${window.location.hostname}:8000/`
    : withTrailingSlash(import.meta.env.VITE_API_BASE_URL_PROD);
