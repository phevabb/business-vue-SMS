import axios from 'axios'

const api = axios.create({


    // baseURL: 'https://kogschool.com/business', // production

   baseURL: 'http://127.0.0.1:9000', // local development
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ✅ Automatically attach token to every protected request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access') || localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// ✅ LOGIN
export const login = (payload) => {
  return api.post('/api/auth/login', payload)
}

// ✅ REGISTER SCHOOL
export const registerSchool = (payload) => {
  return api.post('/api/accounts/register', payload)
}

// ✅ CURRENT USER
export const get_me = () => {
  return api.get('/api/auth/me')
}

// ✅ WORKSPACE DASHBOARD
export const getWorkspaceDashboard = (tenantCode) => {
  return api.get('/api/dashboard/workspace', {
    headers: {
      'X-Tenant-Code': tenantCode,
    },
  })
}

// ✅ LOGOUT
export const logout = () => {
  return api.post('/api/auth/logout')
}



export function forgotPassword(payload) {
  return api.post('/api/auth/forgot-password', payload)
}

export function resetPassword(payload) {
  return api.post('/api/auth/reset-password', payload)
}

export function changePassword(payload) {
  return api.post('/api/auth/change-password', payload)
}

export default api
