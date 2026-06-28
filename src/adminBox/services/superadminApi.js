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

export function superAdminLogin(payload) {
  return api.post('/api/superadmin/login', payload)
}

export function getSuperAdminMe() {
  return api.get('/api/superadmin/me')
}

export function superAdminLogout() {
  localStorage.removeItem('superadmin_token')
  localStorage.removeItem('superadmin_name')
  localStorage.removeItem('superadmin_email')
}

/**
 * =========================
 * Accounts
 * Source: ktor-business accounts table
 * =========================
 */

export function getSuperAdminAccounts(params = {}) {
  return api.get('/api/super', {
    params,
  })
}

export function getSuperAdminAccountById(accountId) {
  return api.get(`/api/super/${accountId}`)
}

export function updateSuperAdminAccountActive(accountId, isActive) {
  return api.patch(`/api/super/accounts/${accountId}/active`, {
    isActive,
  })
}

export function updateSuperAdminAccountStatus(accountId, payload) {
  return api.patch(`/api/super/accounts/${accountId}/status`, payload)
}

/**
 * =========================
 * Tenants
 * Frontend calls ktor-business.
 * ktor-business internally calls ktor-tenant.
 * =========================
 */


export function getSuperAdminTenants(params = {}) {
  return api.get('/api/internal/super/tenant ', {
    params,
  })
}

export function getSuperAdminTenantByCode(tenantCode) {
  return api.get(`/api/superadmin/tenants/${tenantCode}`)
}

export function updateSuperAdminTenantStatus(tenantCode, status) {
  return api.patch(`/api/internal/super/tenant/${tenantCode}/status`, {
    status,
  })
}

/**
 * =========================
 * Transactions
 * Source: ktor-business account transactions
 * =========================
 */

export function getSuperAdminTransactions(params = {}) {
  return api.get('/api/superadmin/account-transactions', {
    params,
  })
}

export function getSuperAdminTransactionsByTenant(tenantCode) {
  return api.get('/api/superadmin/account-transactions', {
    params: {
      tenantCode,
    },
  })
}

/**
 * =========================
 * Provisioning
 * =========================
 */

export function getSuperAdminProvisioningIssues() {
  return api.get('/api/superadmin/provisioning/issues')
}

export function retryTenantProvisioning(accountId) {
  return api.post(`/api/superadmin/accounts/${accountId}/retry-provisioning`)
}

/**
 * =========================
 * Audit logs
 * =========================
 */

export function getSuperAdminAuditLogs(params = {}) {
  return api.get('/api/superadmin/audit-logs', {
    params,
  })
}

export function createAcademicYearCalendar(payload) {
  return api.post('/api/billing/academic-years', payload)
}

export function getAcademicYearCalendars(params = {}) {
  return api.get('/api/superadmin/billing/academic-years', {
    params,
  })
}

export function updateAcademicYearCalendar(academicYearId, payload) {
  return api.patch(`/api/billing/academic-years/${academicYearId}`, payload)
}

export function deleteAcademicYearCalendar(academicYearId) {
  return api.delete(`/api/billing/academic-years/${academicYearId}`)
}



export function updateTenantStatus(tenantCode, status) {
    return api.patch(`/api/internal/super/tenant/${tenantCode}/status`, { status })
}

export default api
