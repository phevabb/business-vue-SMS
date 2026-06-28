import axios from 'axios'

const api = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/**
 * Attach SuperAdmin JWT token to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superadmin_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Handle expired/invalid SuperAdmin token globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      localStorage.removeItem('superadmin_token')
      localStorage.removeItem('superadmin_name')
      localStorage.removeItem('superadmin_email')

      if (!window.location.pathname.includes('/superadmin/login')) {
        window.location.href = '/superadmin/login'
      }
    }

    return Promise.reject(error)
  }
)

/**
 * =========================
 * Auth
 * =========================
 */






export function updateTenantStatus(tenantCode, status) {
    return api.patch(`/api//internal/super/tenant/${tenantCode}/status`, { status })
}

export default api
