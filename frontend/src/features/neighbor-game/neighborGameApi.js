import { apiPost } from '../../shared/api/httpClient';

export function checkNeighbors(country, candidates) {
  return apiPost('/neighbor_check', { country, candidates });
}
