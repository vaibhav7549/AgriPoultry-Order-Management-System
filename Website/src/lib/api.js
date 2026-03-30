// ============================
// API Utility — AgriPoultry OS
// ============================

const API_BASE = '/api';

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  // Handle empty responses (204 No Content)
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return null;
}

export const api = {
  get:   (path) => request('GET', path),
  post:  (path, body) => request('POST', path, body),
  put:   (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  del:   (path) => request('DELETE', path),
};

export default api;
