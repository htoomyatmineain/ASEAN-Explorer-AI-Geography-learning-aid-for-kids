import { apiPost } from '../../shared/api/httpClient';

export function checkCapitalMatch(country, guessedCity) {
  return apiPost('/capital_match', { country, guessed_city: guessedCity });
}
