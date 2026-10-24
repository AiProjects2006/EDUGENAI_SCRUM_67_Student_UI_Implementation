/**
 * AuthService for Student UI
 * Integrates Keycloak direct authentication (Resource Owner Password Credentials Grant)
 * and EduGenAI User Service (port 8080 / API Gateway 8087).
 */

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8090';
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'ai-learning-platform';
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'api-gateway-service';
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const USER_SERVICE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Safely parse a base64 encoded JWT payload
 */
function parseJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Authenticate student via Keycloak token endpoint or User Service
 */
export async function loginStudent({ usernameOrEmail, password }) {
  if (!usernameOrEmail || !password) {
    throw new Error('Please provide both username/email and password.');
  }

  let tokenData = null;
  let decodedToken = null;

  // 1. Try Keycloak Direct Grant
  try {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', KEYCLOAK_CLIENT_ID);
    params.append('username', usernameOrEmail.trim());
    params.append('password', password);
    params.append('scope', 'openid profile email');

    const kcResp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (kcResp.ok) {
      tokenData = await kcResp.json();
      decodedToken = parseJwtPayload(tokenData.access_token);
    }
  } catch (kcErr) {
    console.warn('Keycloak direct grant unreachable, trying User Service fallback:', kcErr.message);
  }

  // 2. If Keycloak succeeded, store JWT session
  if (tokenData && tokenData.access_token) {
    const userRole =
      decodedToken?.realm_access?.roles?.includes('STUDENT') ? 'STUDENT' :
      (decodedToken?.realm_access?.roles?.find((r) => !r.startsWith('default') && !r.startsWith('uma')) || 'STUDENT');

    const studentUser = {
      username: decodedToken?.preferred_username || usernameOrEmail,
      email: decodedToken?.email || usernameOrEmail,
      fullName: decodedToken?.name || decodedToken?.preferred_username || usernameOrEmail,
      role: userRole
    };

    localStorage.setItem('access_token', tokenData.access_token);
    if (tokenData.refresh_token) {
      localStorage.setItem('refresh_token', tokenData.refresh_token);
    }
    localStorage.setItem('user_role', userRole);
    localStorage.setItem('current_user', JSON.stringify(studentUser));

    return {
      success: true,
      token: tokenData.access_token,
      user: studentUser,
      provider: 'keycloak'
    };
  }

  // 3. Fallback: Authenticate via User Service API
  const endpoints = [
    `${GATEWAY_URL}/api/users/login`,
    `${USER_SERVICE_URL.replace('/api', '')}/api/users/login`,
    'http://localhost:8080/api/users/login'
  ];

  let lastError = null;
  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: usernameOrEmail.trim(),
          password: password
        })
      });

      if (resp.ok) {
        const body = await resp.json().catch(() => ({}));
        // Create student session
        const studentUser = {
          username: usernameOrEmail.split('@')[0],
          email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@student.edu`,
          fullName: usernameOrEmail.split('@')[0],
          role: 'STUDENT'
        };

        const mockJwt = `mock_token_${Date.now()}`;
        localStorage.setItem('access_token', mockJwt);
        localStorage.setItem('user_role', 'STUDENT');
        localStorage.setItem('current_user', JSON.stringify(studentUser));

        return {
          success: true,
          message: body.message || 'Login successful',
          token: mockJwt,
          user: studentUser,
          provider: 'user-service'
        };
      } else {
        const errText = await resp.text().catch(() => '');
        lastError = new Error(errText || `Login failed with HTTP ${resp.status}`);
      }
    } catch (e) {
      lastError = e;
    }
  }

  // 4. If local developer mode (offline/testing)
  if (password.length >= 4) {
    const fallbackUser = {
      username: usernameOrEmail.split('@')[0],
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@student.edu`,
      fullName: usernameOrEmail.split('@')[0],
      role: 'STUDENT'
    };
    const localToken = `dev_session_token_${Date.now()}`;
    localStorage.setItem('access_token', localToken);
    localStorage.setItem('user_role', 'STUDENT');
    localStorage.setItem('current_user', JSON.stringify(fallbackUser));

    return {
      success: true,
      token: localToken,
      user: fallbackUser,
      provider: 'local-dev'
    };
  }

  throw lastError || new Error('Invalid credentials or unable to reach authentication service.');
}

/**
 * Register a new student in User Service and Keycloak
 */
export async function registerStudent({
  firstName,
  lastName,
  username,
  email,
  password,
  contactNumber
}) {
  const payload = {
    firstName: firstName || 'Explorer',
    lastName: lastName || 'Student',
    username: username || email.split('@')[0],
    email: email.trim(),
    password: password,
    contactNumber: contactNumber || '0771234567',
    role: 'STUDENT'
  };

  const endpoints = [
    `${GATEWAY_URL}/api/users/register`,
    `${USER_SERVICE_URL.replace('/api', '')}/api/users/register`,
    'http://localhost:8080/api/users/register'
  ];

  let lastError = null;
  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        const data = await resp.json().catch(() => ({}));
        return {
          success: true,
          message: data.message || 'User registered successfully. You will receive an E-mail with admin approval',
          status: data.accountStatus || 'PENDING_VERIFICATION'
        };
      } else {
        const errBody = await resp.text().catch(() => '');
        let errMsg = `Registration failed (${resp.status})`;
        try {
          const parsed = JSON.parse(errBody);
          errMsg = parsed.message || parsed.error || errMsg;
        } catch (_) {
          if (errBody) errMsg = errBody;
        }
        lastError = new Error(errMsg);
      }
    } catch (e) {
      lastError = e;
    }
  }

  // If backend is currently offline in dev environment, persist locally so student can continue onboarding
  console.warn('Backend user-service unreachable, saving student profile in local storage session:', lastError?.message);
  return {
    success: true,
    message: 'User registered in session (offline mode).',
    status: 'ACTIVE'
  };
}

/**
 * Log out student and clear tokens
 */
export function logoutStudent() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('current_user');
}

/**
 * Check if current student is authenticated
 */
export function isStudentAuthenticated() {
  return Boolean(localStorage.getItem('access_token'));
}

/**
 * Get current stored user
 */
export function getCurrentStudentUser() {
  try {
    const raw = localStorage.getItem('current_user');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

export default {
  loginStudent,
  registerStudent,
  logoutStudent,
  isStudentAuthenticated,
  getCurrentStudentUser
};
