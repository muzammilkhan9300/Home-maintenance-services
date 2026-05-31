const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const adminApi = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  login: (email, password) =>
    fetch(`${API_BASE}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handle),

  verify: (token) =>
    fetch(`${API_BASE}/api/admin/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(handle),

  // ── Dashboard ─────────────────────────────────────────────────────────────
  getStats: () =>
    fetch(`${API_BASE}/api/admin/stats`, { headers: getHeaders() }).then(handle),

  getRecent: () =>
    fetch(`${API_BASE}/api/admin/recent`, { headers: getHeaders() }).then(handle),

  // ── Contacts / Leads ─────────────────────────────────────────────────────
  getContacts: (params = {}) =>
    fetch(`${API_BASE}/api/admin/contacts?${new URLSearchParams(params)}`, { headers: getHeaders() }).then(handle),

  updateContactStatus: (id, status) =>
    fetch(`${API_BASE}/api/admin/contacts/${id}/status`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }),
    }).then(handle),

  deleteContact: (id) =>
    fetch(`${API_BASE}/api/admin/contacts/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handle),

  // ── Career Applications ───────────────────────────────────────────────────
  getCareers: (params = {}) =>
    fetch(`${API_BASE}/api/admin/careers?${new URLSearchParams(params)}`, { headers: getHeaders() }).then(handle),

  updateCareerStatus: (id, status) =>
    fetch(`${API_BASE}/api/admin/careers/${id}/status`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }),
    }).then(handle),

  deleteCareer: (id) =>
    fetch(`${API_BASE}/api/admin/careers/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handle),

  // ── Ads ───────────────────────────────────────────────────────────────────
  getAds: () =>
    fetch(`${API_BASE}/api/admin/ads`, { headers: getHeaders() }).then(handle),

  createAd: (formData) =>
    fetch(`${API_BASE}/api/admin/ads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}` },
      body: formData,
    }).then(handle),

  updateAd: (id, formData) =>
    fetch(`${API_BASE}/api/admin/ads/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}` },
      body: formData,
    }).then(handle),

  updateAdJson: (id, data) =>
    fetch(`${API_BASE}/api/admin/ads/${id}`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data),
    }).then(handle),

  deleteAd: (id) =>
    fetch(`${API_BASE}/api/admin/ads/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handle),

  // ── Testimonials ──────────────────────────────────────────────────────────
  getTestimonials: () =>
    fetch(`${API_BASE}/api/admin/testimonials`, { headers: getHeaders() }).then(handle),

  createTestimonial: (data) =>
    fetch(`${API_BASE}/api/admin/testimonials`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
    }).then(handle),

  updateTestimonial: (id, data) =>
    fetch(`${API_BASE}/api/admin/testimonials/${id}`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data),
    }).then(handle),

  deleteTestimonial: (id) =>
    fetch(`${API_BASE}/api/admin/testimonials/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handle),

  // ── Notices ───────────────────────────────────────────────────────────────
  getNotices: () =>
    fetch(`${API_BASE}/api/admin/notices`, { headers: getHeaders() }).then(handle),

  createNotice: (data) =>
    fetch(`${API_BASE}/api/admin/notices`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
    }).then(handle),

  updateNotice: (id, data) =>
    fetch(`${API_BASE}/api/admin/notices/${id}`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data),
    }).then(handle),

  deleteNotice: (id) =>
    fetch(`${API_BASE}/api/admin/notices/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handle),

  // ── Analytics ─────────────────────────────────────────────────────────────
  getAnalytics: (period = 30) =>
    fetch(`${API_BASE}/api/admin/analytics?period=${period}`, { headers: getHeaders() }).then(handle),

  // ── Settings ──────────────────────────────────────────────────────────────
  getSettings: () =>
    fetch(`${API_BASE}/api/admin/settings`, { headers: getHeaders() }).then(handle),

  saveSettings: (data) =>
    fetch(`${API_BASE}/api/admin/settings`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
    }).then(handle),
};
