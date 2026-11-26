import { apiFetch } from '../../shared/api/httpClient';

export function getCountryInfo(countryName, options) {
  return apiFetch(`/country/${countryName}`, options);
}

export function getNeighbors(countryName) {
  return apiFetch(`/neighbors/${countryName}`);
}
