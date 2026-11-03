import { BASE_URL } from '../../shared/api/httpClient';

// Custom fetch (rather than the shared apiPost helper) because this feature needs the
// real error message from a non-2xx response body (e.g. the 404 "no country matches
// those clues" from routes.pl) — the shared apiFetch discards the body on failure.
export async function guessCountry(clues) {
  const res = await fetch(`${BASE_URL}/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clues }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: body.error || 'The Guess the Country backend is not available right now.' };
  }
  return body;
}
