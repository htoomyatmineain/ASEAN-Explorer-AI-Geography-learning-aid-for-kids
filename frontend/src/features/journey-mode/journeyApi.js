import { apiFetch } from '../../shared/api/httpClient';

// Journey Mode isn't built yet — see docs/04-asean-explorer-features.md "What's
// Still Open". This calls the placeholder /journey/status route, which
// currently replies 501, so callers should expect it to reject.
export function getJourneyStatus() {
  return apiFetch('/journey/status');
}
