import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080/api/', // ✅ Ktor server

    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

// ✅ Tenant helpers
export function setTenantSlug(slug) {
    if (slug) {
        localStorage.setItem('tenantSlug', slug);
    }
}

export function getTenantSlug() {
    return localStorage.getItem('tenantSlug');
}

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');

    // ✅ Attach JWT from Django
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Attach tenant slug
    const tenantSlug = getTenantSlug();
    if (tenantSlug) {
        config.headers['X-Tenant-Slug'] = tenantSlug;
    }

    return config;
});

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('tenantSlug');
        }

        return Promise.reject(error);
    }
);

export default api;
