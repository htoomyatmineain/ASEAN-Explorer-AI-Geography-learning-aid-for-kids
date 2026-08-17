import { apiFetch } from '../../shared/api/httpClient';

export function getCountryInfo(countryName) {
  return apiFetch(`/country/${countryName}`);
}
