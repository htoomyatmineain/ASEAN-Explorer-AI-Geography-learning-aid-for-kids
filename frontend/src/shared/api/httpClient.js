// Every feature's *Api.js file builds on this. Components never call fetch()
// or construct backend URLs directly — see docs/02-asean-explorer-architecture.md §2.4.
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function apiFetch(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`Request to ${path} failed`);
  return res.json();
}

export function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
