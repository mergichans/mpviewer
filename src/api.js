import { API_URL, HMAC_KEY, HASH_KEY } from './Constants';

export async function fetchMasterpieces(username, domain) {
  const url = `${API_URL}/api/masterpiece/search?domain=${domain}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
    'Authorization': `HMAC ${HMAC_KEY}`,
    'X-Hash-Key': HASH_KEY
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ user: username })
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return response.json();
}
