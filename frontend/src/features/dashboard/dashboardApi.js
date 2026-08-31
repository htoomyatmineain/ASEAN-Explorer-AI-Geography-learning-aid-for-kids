import { apiFetch, apiPost } from '../../shared/api/httpClient';

export function getAllScores() {
  return apiFetch('/scores');
}

export function getRecommendation() {
  return apiFetch('/recommend');
}

export function setTopicScore(topic, score) {
  return apiPost('/score', { topic, score });
}
