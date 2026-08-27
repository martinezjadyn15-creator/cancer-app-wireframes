const API_BASE = 'http://10.4.120.61:3051';

export async function fetchDrugs() {
  const res = await fetch(`${API_BASE}/api/drugs`);
  if (!res.ok) throw new Error('Failed to fetch drugs');
  return res.json();
}

export async function fetchInteraction(drug) {
  const params = new URLSearchParams({ drug });
  const res = await fetch(`${API_BASE}/api/interaction?${params.toString()}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch interaction');
  return res.json();
}
