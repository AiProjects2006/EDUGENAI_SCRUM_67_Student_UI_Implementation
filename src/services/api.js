const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const ACTIVITY_SERVICE_URL = import.meta.env.VITE_ACTIVITY_SERVICE_URL || 'http://localhost:8083';

/**
 * Base request utility for communicating with backend services through the API Gateway
 */
export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const token = localStorage.getItem('access_token');

  const headers = {
    'Accept': 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = path.startsWith('http') ? path : `${GATEWAY_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers
    });

    if (!response.ok) {
      // If gateway is down or path not routed, try direct activity service fallback for /api/v1/activities
      if (path.startsWith('/api/v1/activities') && !path.startsWith('http')) {
        const directUrl = `${ACTIVITY_SERVICE_URL}${path}`;
        const directResp = await fetch(directUrl, { ...options, method, headers });
        if (directResp.ok) {
          return await directResp.json();
        }
      }
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // If gateway connection failed entirely, try direct fallback
    if (path.startsWith('/api/v1/activities') && !path.startsWith('http')) {
      try {
        const directUrl = `${ACTIVITY_SERVICE_URL}${path}`;
        const directResp = await fetch(directUrl, { ...options, method, headers });
        if (directResp.ok) {
          return await directResp.json();
        }
      } catch (fallbackError) {
        // Fall through to throw original error
      }
    }
    throw error;
  }
}

export default { apiRequest };
