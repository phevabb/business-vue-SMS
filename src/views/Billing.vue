<script setup>
import {
    getInvoices,
    initializePaystackPayment,
    verifyPaystackPayment,
} from '@/adminBox/services/billingApi.js'

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  planName: {
    type: String,
    default: 'Growth Plan',
  },
  billingCycle: {
    type: String,
    default: 'Billed Per Term',
  },
  pollIntervalMs: {
    type: Number,
    default: 30000,
  },
})

const route = useRoute()

const loading = ref(false)
const paying = ref(false)
const verifying = ref(false)
const error = ref('')
const success = ref('')
const invoices = ref([])
const pollTimer = ref(null)

const tenantCode = computed(() => {
  return (
    localStorage.getItem('tenantCode') ||
    localStorage.getItem('tenant_code') ||
    ''
  )
})

const sortedInvoices = computed(() => {
  return [...invoices.value].sort((a, b) => {
    return Number(b.createdAtEpochMillis || 0) - Number(a.createdAtEpochMillis || 0)
  })
})

const outstandingInvoices = computed(() => {
  return sortedInvoices.value.filter((invoice) => {
    const status = String(invoice.paymentStatus || '').toLowerCase()

    return !invoice.isPaid && ['pending', 'overdue'].includes(status)
  })
})

const paidInvoices = computed(() => {
  return sortedInvoices.value.filter((invoice) => {
    return invoice.isPaid || String(invoice.paymentStatus || '').toLowerCase() === 'paid'
  })
})

const latestInvoice = computed(() => {
  return sortedInvoices.value[0] || null
})

const nextPayableInvoice = computed(() => {
  return outstandingInvoices.value[0] || null
})

const displayInvoice = computed(() => {
  return nextPayableInvoice.value || latestInvoice.value || null
})

const currentBalance = computed(() => {
  return outstandingInvoices.value.reduce((sum, invoice) => {
    return sum + Number(invoice.totalAmountCedis || 0)
  }, 0)
})

const nextInvoiceAmount = computed(() => {
  return Number(nextPayableInvoice.value?.totalAmountCedis || 0)
})

const nextInvoiceDate = computed(() => {
  return formatDate(nextPayableInvoice.value?.dueDateEpochMillis)
})

const paymentMethod = computed(() => {
  return 'Paystack Checkout'
})

const invoiceStatus = computed(() => {
  if (currentBalance.value <= 0) return 'Settled'

  const hasOverdue = outstandingInvoices.value.some((invoice) => {
    return String(invoice.paymentStatus || '').toLowerCase() === 'overdue'
  })

  return hasOverdue ? 'Overdue' : 'Outstanding'
})

const invoiceStatusClass = computed(() => {
  switch (invoiceStatus.value.toLowerCase()) {
    case 'settled':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'overdue':
      return 'bg-red-50 text-red-700 border border-red-200'
    default:
      return 'bg-amber-50 text-amber-700 border border-amber-200'
  }
})

const totalPaid = computed(() => {
  return paidInvoices.value.reduce((sum, invoice) => {
    return sum + Number(invoice.totalAmountCedis || 0)
  }, 0)
})

const formattedTotalPaid = computed(() => {
  return formatMoney(totalPaid.value)
})

const recentPayments = computed(() => {
  return paidInvoices.value.slice(0, 5).map((invoice) => {
    return {
      title: `${invoice.academicYearName} • ${invoice.termName}`,
      reference: invoice.paystackReference || `INV-${invoice.invoiceId}`,
      date: formatDate(invoice.paidAtEpochMillis || invoice.createdAtEpochMillis),
      amount: Number(invoice.totalAmountCedis || 0),
      status: 'Paid',
    }
  })
})

const canMakePayment = computed(() => {
  return Boolean(nextPayableInvoice.value) && !paying.value && !verifying.value
})

const payButtonLabel = computed(() => {
  if (paying.value) return 'Redirecting...'
  if (verifying.value) return 'Verifying...'
  if (!nextPayableInvoice.value) return 'No Payment Due'

  const status = String(nextPayableInvoice.value.paymentStatus || '').toLowerCase()

  if (status === 'overdue') return 'Pay Now To Reactivate'

  return 'Make Payment'
})

function formatMoney(value) {
  return new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

function formatDate(epochMillis) {
  if (!epochMillis) return '-'

  return new Date(Number(epochMillis)).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

async function fetchInvoices(options = {}) {
  const { silent = false } = options

  if (!tenantCode.value) {
    error.value = 'Tenant code not found. Please login again.'
    return
  }

  if (!silent) {
    loading.value = true
  }

  error.value = ''

  try {
    const response = await getInvoices({
      tenantCode: tenantCode.value,
    })

    invoices.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to load billing information.'
  } finally {
    loading.value = false
  }
}

async function makePayment() {
  const invoiceId = nextPayableInvoice.value?.invoiceId

  if (!invoiceId) {
    error.value = 'No payable invoice found.'
    return
  }

  paying.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await initializePaystackPayment(invoiceId)

    const authorizationUrl = response.data?.authorizationUrl

    if (!authorizationUrl) {
      throw new Error('Payment authorization URL was not returned.')
    }

    window.location.href = authorizationUrl
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to initialize payment.'
  } finally {
    paying.value = false
  }
}

async function verifyFromCallbackIfNeeded() {
  const reference = route.query.reference || route.query.trxref

  if (!reference) return

  verifying.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await verifyPaystackPayment(reference)

    if (response.data?.success) {
      success.value = 'Payment verified successfully.'
    } else {
      error.value = response.data?.message || 'Payment could not be verified.'
    }

    await fetchInvoices({ silent: true })
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to verify payment.'
  } finally {
    verifying.value = false
  }
}

function startPolling() {
  stopPolling()

  pollTimer.value = window.setInterval(() => {
    fetchInvoices({ silent: true })
  }, props.pollIntervalMs)
}

function stopPolling() {
  if (pollTimer.value) {
    clearInterval(pollTimer.value)
    pollTimer.value = null
  }
}

onMounted(async () => {
  await verifyFromCallbackIfNeeded()
  await fetchInvoices()
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<template>
  <section class="billing-card">
    <div v-if="loading" class="state-box">
      Loading billing summary...
    </div>

    <template v-else>
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>

      <!-- Header -->
      <div class="card-header">
        <div>
          <p class="eyebrow">Billing Summary</p>
          <h2 class="card-title">Finance</h2>
          <p class="card-subtitle">
            Review balances, upcoming invoices, payment status, and recent billing activity for this workspace.
          </p>
        </div>

        <div class="header-badges">
          <span class="badge badge-soft-blue">
            {{ tenantCode || 'No Tenant' }}
          </span>

          <span class="badge" :class="invoiceStatusClass">
            {{ invoiceStatus }}
          </span>
        </div>
      </div>

      <!-- Hero Panel -->
      <div class="hero-panel">
        <div class="hero-left">
          <p class="hero-label">Current Balance</p>

          <div class="hero-value">
            ₵{{ formatMoney(currentBalance) }}
          </div>

          <p class="hero-note">
            <template v-if="nextPayableInvoice">
              Next payable invoice is
              <strong>₵{{ formatMoney(nextInvoiceAmount) }}</strong>
              due on
              <strong>{{ nextInvoiceDate }}</strong>.
            </template>

            <template v-else>
              There is no outstanding invoice for this tenant.
            </template>
          </p>
        </div>

        <div class="hero-right">
          <div class="mini-summary">
            <span class="mini-label">Payment Method</span>
            <span class="mini-value">{{ paymentMethod }}</span>
          </div>
        </div>
      </div>

      <!-- Financial overview -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon icon-emerald">
            ₵
          </div>

          <div>
            <p class="stat-label">Current Balance</p>
            <p class="stat-value">₵{{ formatMoney(currentBalance) }}</p>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon icon-blue">
            ₵
          </div>

          <div>
            <p class="stat-label">Next Invoice</p>
            <p class="stat-value">₵{{ formatMoney(nextInvoiceAmount) }}</p>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon icon-sky">
            📅
          </div>

          <div>
            <p class="stat-label">Next Invoice Date</p>
            <p class="stat-value">{{ nextInvoiceDate }}</p>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon icon-indigo">
            ✓
          </div>

          <div>
            <p class="stat-label">Total Paid</p>
            <p class="stat-value">₵{{ formattedTotalPaid }}</p>
          </div>
        </div>
      </div>

      <!-- Payment action -->
      <div class="action-panel">
        <div>
          <p class="action-title">Payment Action</p>
          <p class="action-text">
            If a pending or overdue invoice exists, you can complete payment securely with Paystack.
          </p>
        </div>

        <button
          class="btn btn-primary"
          type="button"
          :disabled="!canMakePayment"
          @click="makePayment"
        >
          {{ payButtonLabel }}
        </button>
      </div>

      <!-- Recent payments -->
      <div class="payments-section">
        <div class="payments-header">
          <div>
            <p class="section-title">Recent Payments</p>
            <p class="section-subtitle">
              Latest successful invoice payments recorded for this workspace.
            </p>
          </div>

          <button class="btn btn-secondary" type="button" @click="fetchInvoices()">
            Refresh
          </button>
        </div>

        <div v-if="recentPayments.length === 0" class="empty-box">
          No successful payments found yet.
        </div>

        <div v-else class="payments-list">
          <div
            v-for="payment in recentPayments"
            :key="`${payment.reference}-${payment.date}`"
            class="payment-item"
          >
            <div class="payment-left">
              <div class="payment-icon">
                ₵
              </div>

              <div class="payment-meta">
                <p class="payment-title">{{ payment.title }}</p>
                <p class="payment-reference">
                  {{ payment.reference }} • {{ payment.date }}
                </p>
              </div>
            </div>

            <div class="payment-right">
              <p class="payment-amount">₵{{ formatMoney(payment.amount) }}</p>

              <span
                class="payment-status"
                :class="payment.status.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending'"
              >
                {{ payment.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.billing-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  padding: 1.5rem;
  box-shadow:
    0 12px 30px rgba(15, 23, 42, 0.06),
    0 2px 8px rgba(15, 23, 42, 0.03);
}

.state-box,
.empty-box {
  padding: 1rem;
  border-radius: 16px;
  background: #f8fafc;
  color: #64748b;
  font-weight: 700;
}

.alert {
  padding: 0.9rem 1rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  font-weight: 800;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.35rem;
}

.card-title {
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.card-subtitle {
  margin-top: 0.35rem;
  font-size: 0.95rem;
  color: #64748b;
  max-width: 680px;
}

.header-badges {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 800;
  white-space: nowrap;
  text-transform: capitalize;
}

.badge-soft-blue {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: stretch;
  background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
  border: 1px solid #dbeafe;
  border-radius: 22px;
  padding: 1.2rem;
  margin-bottom: 1.1rem;
  flex-wrap: wrap;
}

.hero-left {
  flex: 1 1 320px;
}

.hero-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 0.4rem;
}

.hero-value {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin-bottom: 0.3rem;
}

.hero-note {
  color: #64748b;
  font-size: 0.92rem;
  line-height: 1.5;
}

.hero-note strong {
  color: #0f172a;
}

.hero-right {
  display: flex;
  align-items: center;
}

.mini-summary {
  min-width: 220px;
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.06);
}

.mini-label {
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.06em;
  margin-bottom: 0.3rem;
}

.mini-value {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.95rem;
  margin-bottom: 1.25rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 20px;
  padding: 1rem;
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 900;
}

.icon-emerald {
  background: #ecfdf5;
  color: #059669;
}

.icon-blue {
  background: #eff6ff;
  color: #2563eb;
}

.icon-sky {
  background: #f0f9ff;
  color: #0284c7;
}

.icon-indigo {
  background: #eef2ff;
  color: #4f46e5;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.stat-value {
  font-size: 1.02rem;
  color: #0f172a;
  font-weight: 800;
}

.action-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 22px;
  padding: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.action-title {
  margin: 0 0 0.25rem;
  font-size: 0.98rem;
  font-weight: 800;
  color: #0f172a;
}

.action-text {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}

.payments-section {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 22px;
  padding: 1rem;
}

.payments-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.95rem;
  flex-wrap: wrap;
}

.section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.2rem;
}

.section-subtitle {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.4;
}

.payments-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 0;
  border-top: 1px solid #f1f5f9;
}

.payment-item:first-child {
  border-top: none;
  padding-top: 0;
}

.payment-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}

.payment-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #eff6ff;
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 900;
}

.payment-meta {
  min-width: 0;
}

.payment-title {
  font-size: 0.94rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.15rem;
}

.payment-reference {
  font-size: 0.84rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.payment-right {
  text-align: right;
  flex-shrink: 0;
}

.payment-amount {
  font-size: 0.96rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.payment-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
}

.status-paid {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-pending {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.btn {
  min-height: 44px;
  border-radius: 14px;
  padding: 0 1rem;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  border: none;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-secondary {
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #d1d5db;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
}

.bg-emerald-50 {
  background: #ecfdf5;
}

.text-emerald-700 {
  color: #047857;
}

.border-emerald-200 {
  border-color: #a7f3d0;
}

.bg-amber-50 {
  background: #fffbeb;
}

.text-amber-700 {
  color: #b45309;
}

.border-amber-200 {
  border-color: #fde68a;
}

.bg-red-50 {
  background: #fef2f2;
}

.text-red-700 {
  color: #b91c1c;
}

.border-red-200 {
  border-color: #fecaca;
}

.border {
  border-width: 1px;
  border-style: solid;
}

@media (max-width: 768px) {
  .billing-card {
    padding: 1.15rem;
  }

  .hero-value {
    font-size: 1.7rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .payment-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .payment-right {
    text-align: left;
    width: 100%;
  }

  .mini-summary {
    min-width: 100%;
  }

  .action-panel {
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }
}
</style>
