import { apiFetch } from '../../shared/api/httpClient';

export function getCountryInfo(countryName) {
  return apiFetch(`/country/${countryName}`);
}

export function getNeighbors(countryName) {
  return apiFetch(`/neighbors/${countryName}`);
}
