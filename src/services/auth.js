import axios from 'axios'

const api = axios.create({


    baseURL: import.meta.env.VITE_API_BASE_URL, // local
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


export const updateSchoolBranding = (tenantCode, payload) => {
  return api.put(`/api/accounts/update-school-branding`, payload, {
    headers: {
        'X-Tenant-Code': tenantCode,
    },
  })
}


export const getPendingAccounts = () => {
  return api.get(`/api/accounts/pending-accounts`, {

  })
}

export const uploadSchoolLogo = (
    tenantCode,
    file
) => {

    const formData = new FormData()

    formData.append(
        'file',
        file
    )

    return api.post(
        `/api/accounts/upload-school-logo/${tenantCode}`,
        formData,
        {
            headers: {
                'X-Tenant-Code': tenantCode,
                'Content-Type': 'multipart/form-data',
            },
        }
    )
}


export function createWalletTopUpTransaction(
  payload
) {
  return api.post(
    '/api/sms/wallet/top-up/create',
    payload,
    {
      headers: {
        'X-Tenant-Code': payload.tenantCode,
      },
    }
  )
}


export function purchaseSmsCredits(
  payload
) {
  return api.post(
    '/api/sms/wallet/purchase-sms',
    payload,
    {
      headers: {
        'X-Tenant-Code': payload.tenantCode,
      },
    }
  )
}




export function getClientSmsWallet(
  tenantCode
) {
  return api.get(
    `/api/sms/wallet/${tenantCode}`,
    {
      headers: {
        'X-Tenant-Code': tenantCode,
      },
    }
  )
}


export function verifyWalletTopUpPayment(
  payload
) {
  return api.post(
    '/api/sms/wallet/top-up/verify',
    payload,
    {
      headers: {
        'X-Tenant-Code': payload.tenantCode,
      },
    }
  )
}



export function getAccountEmailByTenantCode(
  tenantCode
) {
  return api.get(
    `/api/accounts/email/${tenantCode}`,
    {
      headers: {
        'X-Tenant-Code': tenantCode,
      },
    }
  )
}


export const getSchoolProfile = (tenantCode) => {
  return api.get(`/api/accounts/school-profile/${tenantCode}`, {
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


const handleDeleteSenderId = async () => {

  const tenantCode =
    localStorage.getItem('tenantCode') || ''

  if (!tenantCode) {

    showToast(
      'error',
      'Missing Tenant',
      'Tenant code not found.'
    )

    return
  }

  if (!senderId.id) {

    showToast(
      'warn',
      'No Sender ID',
      'No sender ID request is available to delete.'
    )

    return
  }

  const confirmDelete =
    window.confirm(
      'Are you sure you want to delete this sender ID request?'
    )

  if (!confirmDelete) {
    return
  }

  try {

    await deleteSenderId(
      tenantCode,
      senderId.id
    )

    senderId.id = null
    senderId.activeSenderId = ''
    senderId.status = 'Not requested'
    senderId.reason = ''
    senderId.rejectionReason = ''
    senderId.available = false

    smsForm.senderId = ''

    smsHistory.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: 'Sender ID',
      description: 'Sender ID request deleted',
      credits: '-',
      status: 'Completed',
    })

    showToast(
      'success',
      'Deleted',
      'Sender ID request deleted successfully.'
    )

    await loadLatestSenderId()

  } catch (error) {



    showToast(
      'error',
      'Delete Failed',
      error?.response?.data?.message ||
        'Unable to delete sender ID request.'
    )
  }
}





export function deleteSenderId(
  tenantCode,
  senderId
) {
  return api.delete(
    `/api/sms/sender-id/${senderId}`,
    {
      headers: {
        'X-Tenant-Code': tenantCode,
      },
    }
  )
}


export function requestSenderId(tenantCode, payload) {
  return api.post(
    '/api/sms/sender-id/request',
    payload,
    {
      headers: {
        'X-Tenant-Code': tenantCode,
      },
    }
  )
}

export function getLatestSenderId(tenantCode) {
  return api.get(`/api/sms/sender-id/latest/${tenantCode}`, {
    headers: {
        'X-Tenant-Code': tenantCode,
    },
  })
}

export function updatePins(payload) {
  return api.put('/api/accounts/update-pins', payload)
}

export default api
