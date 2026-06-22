import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:9000',

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getCurrentBilling(accountId) {
  return api.get('/api/billing/current', {
    params: {
      accountId,
    },
  })
}

export function initializePaystackPayment(invoiceId) {
  return api.post(`/api/billing/invoices/${invoiceId}/paystack/initialize`)
}

export function verifyPaystackPayment(reference) {
  return api.get(`/api/billing/paystack/verify/${reference}`)
}

export function getInvoices(params = {}) {
  return api.get('/api/billing/invoices', {
    params,
  })
}
