import api from './api';

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data.data;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
  return user;
}

export async function register({ firstName, lastName, email, password }) {
  const res = await api.post('/auth/register', { firstName, lastName, email, password });
  const { token, user } = res.data.data;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export async function getProfile() {
  const res = await api.get('/auth/me');
  return res.data?.data || res.data;
}


