import { apiPost } from '../../shared/api/httpClient';

export function guessCountry(clues) {
  return apiPost('/guess', { clues });
}
