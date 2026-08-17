import { apiFetch } from '../../shared/api/httpClient';

export function explainNeighbor(a, b) {
  return apiFetch(`/explain/neighbor?a=${a}&b=${b}`);
}

export function explainMembership(country) {
  return apiFetch(`/explain/membership?country=${country}`);
}
