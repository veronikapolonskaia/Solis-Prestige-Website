import api from './api';

export async function fetchEditorials({ page = 1, limit = 12 } = {}) {
  const res = await api.get('/editorials', { params: { page, limit } });
  return res.data.data;
}

export async function fetchEditorial(slug) {
  const res = await api.get(`/editorials/${slug}`);
  return res.data.data;
}


