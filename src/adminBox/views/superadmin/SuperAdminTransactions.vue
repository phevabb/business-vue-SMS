<template>
  <section class="transactions-page">
    <div class="hero-card">
      <div>
        <p class="eyebrow">SuperAdmin Finance</p>
        <h1 style="color: bisque;">Account Transactions</h1>
        <p>
          View tenant invoices, free trials, Paystack references, payment status,
          and revenue activity across all schools.
        </p>
      </div>

      <button class="refresh-btn" type="button" :disabled="loading" @click="fetchTransactions">
        <span v-if="loading">Refreshing...</span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <div v-if="error" class="alert-error">
      {{ error }}
    </div>

    <section class="stats-grid">
      <div class="stat-card blue">
        <span>Total Transactions</span>
        <strong>{{ transactions.length }}</strong>
        <small>All invoice records</small>
      </div>

      <div class="stat-card green">
        <span>Total Paid</span>
        <strong>GH₵{{ formatMoney(totalPaidAmount) }}</strong>
        <small>{{ paidCount }} paid transaction(s)</small>
      </div>

      <div class="stat-card amber">
        <span>Outstanding</span>
        <strong>GH₵{{ formatMoney(outstandingAmount) }}</strong>
        <small>{{ unpaidCount }} pending/overdue</small>
      </div>

      <div class="stat-card purple">
        <span>Free Trials</span>
        <strong>{{ freeTrialCount }}</strong>
        <small>Trial billing records</small>
      </div>
    </section>

    <section class="toolbar-card">
      <input
        v-model="search"
        class="search-input"
        type="text"
        placeholder="Search tenant code, Paystack reference, status..."
      />

      <select v-model="statusFilter" class="filter-select">
        <option value="all">All statuses</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
        <option value="free_trial">Free trial</option>
      </select>

      <select v-model="paidFilter" class="filter-select">
        <option value="all">All payments</option>
        <option value="paid">Paid only</option>
        <option value="unpaid">Unpaid only</option>
      </select>
    </section>

    <section class="table-card">
      <div class="table-header">
        <div>
          <h2>Transactions</h2>
          <p>{{ filteredTransactions.length }} transaction(s) shown</p>
        </div>
      </div>

      <div v-if="loading" class="loading-box">
        Loading transactions...
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tenant</th>
              <th>Students</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Paystack Ref</th>
              <th>Due Date</th>
              <th>Paid At</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>


            <tr
  v-for="(transaction, index) in paginatedTransactions"
  :key="transaction.id"
>
  <td>{{ paginationStartIndex + index + 1 }}</td>

              <td>
                <strong>{{ transaction.tenantCode }}</strong>
                <small>Account ID: {{ transaction.accountId }}</small>
              </td>

              <td>{{ Number(transaction.studentCount || 0).toLocaleString() }}</td>

              <td>GH₵{{ formatMoney(transaction.amountPerStudentCedis) }}</td>

              <td>
                <strong>GH₵{{ formatMoney(transaction.totalAmountCedis) }}</strong>
              </td>

              <td>
                <span :class="['status-pill', statusClass(transaction.paymentStatus)]">
                  {{ formatStatus(transaction.paymentStatus) }}
                </span>
              </td>

              <td>
                <code v-if="transaction.paystackReference">
                  {{ transaction.paystackReference }}
                </code>
                <span v-else class="muted">—</span>
              </td>

              <td>{{ formatDate(transaction.dueDateEpochMillis) }}</td>
              <td>{{ formatDate(transaction.paidAtEpochMillis) }}</td>
              <td>{{ formatDate(transaction.createdAtEpochMillis) }}</td>
            </tr>


            <tr v-if="filteredTransactions.length === 0">

              <td colspan="10" class="empty-cell">
                No transactions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
            <div
        v-if="!loading && filteredTransactions.length > 0"
        class="pagination-bar"
      >
        <div class="pagination-info">
          Showing
          <strong>{{ showingFrom }}</strong>
          -
          <strong>{{ showingTo }}</strong>
          of
          <strong>{{ filteredTransactions.length }}</strong>
          transactions
        </div>

        <div class="pagination-controls">
          <button
            class="page-btn"
            type="button"
            :disabled="currentPage === 1"
            @click="goToPage(1)"
          >
            First
          </button>

          <button
            class="page-btn"
            type="button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            Prev
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            :class="['page-number', { active: page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            class="page-btn"
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>

          <button
            class="page-btn"
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
          >
            Last
          </button>

          <select v-model.number="pageSize" class="page-size-select">
            <option :value="5">5 / page</option>
            <option :value="10">10 / page</option>
            <option :value="20">20 / page</option>
            <option :value="50">50 / page</option>
          </select>
        </div>
      </div>


    </section>
  </section>
</template>

<script setup>
import { getSuperAdminTransactions } from '@/adminBox/services/superadminApi.js'
import { computed, onMounted, ref, watch } from 'vue'

const loading = ref(false)
const error = ref('')
const transactions = ref([])
const currentPage = ref(1)
const pageSize = ref(10)


const search = ref('')
const statusFilter = ref('all')
const paidFilter = ref('all')

const normalizedSearch = computed(() => search.value.trim().toLowerCase())

const filteredTransactions = computed(() => {
  let list = [...transactions.value]

  if (statusFilter.value !== 'all') {
    list = list.filter((item) => {
      return String(item.paymentStatus || '').toLowerCase() === statusFilter.value
    })
  }

  if (paidFilter.value === 'paid') {
    list = list.filter((item) => item.isPaid)
  }

  if (paidFilter.value === 'unpaid') {
    list = list.filter((item) => !item.isPaid)
  }

  if (normalizedSearch.value) {
    list = list.filter((item) => {
      return [
        item.tenantCode,
        item.paymentStatus,
        item.paystackReference,
        item.accountId,
        item.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch.value)
    })
  }

  return list
})



const totalPages = computed(() => {
  const total = Math.ceil(filteredTransactions.value.length / pageSize.value)
  return total > 0 ? total : 1
})

const paginationStartIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const paginatedTransactions = computed(() => {
  const start = paginationStartIndex.value
  const end = start + pageSize.value

  return filteredTransactions.value.slice(start, end)
})

const showingFrom = computed(() => {
  if (!filteredTransactions.value.length) return 0

  return paginationStartIndex.value + 1
})

const showingTo = computed(() => {
  const end = paginationStartIndex.value + paginatedTransactions.value.length

  return Math.min(end, filteredTransactions.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1

  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  return pages
})

function goToPage(page) {
  if (page < 1) {
    currentPage.value = 1
    return
  }

  if (page > totalPages.value) {
    currentPage.value = totalPages.value
    return
  }

  currentPage.value = page
}


watch(
  [search, statusFilter, paidFilter, pageSize],
  () => {
    currentPage.value = 1
  }
)

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

const paidCount = computed(() => {
  return transactions.value.filter((item) => item.isPaid).length
})

const unpaidCount = computed(() => {
  return transactions.value.filter((item) => !item.isPaid).length
})

const freeTrialCount = computed(() => {
  return transactions.value.filter((item) => {
    return String(item.paymentStatus || '').toLowerCase() === 'free_trial'
  }).length
})

const totalPaidAmount = computed(() => {
  return transactions.value
    .filter((item) => item.isPaid)
    .reduce((sum, item) => sum + Number(item.totalAmountCedis || 0), 0)
})

const outstandingAmount = computed(() => {
  return transactions.value
    .filter((item) => {
      const status = String(item.paymentStatus || '').toLowerCase()
      return ['pending', 'overdue'].includes(status)
    })
    .reduce((sum, item) => sum + Number(item.totalAmountCedis || 0), 0)
})

async function fetchTransactions() {
  loading.value = true
  error.value = ''

  try {
    const response = await getSuperAdminTransactions()

    transactions.value = Array.isArray(response.data)
      ? response.data
      : []
  } catch (err) {


    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to load transactions.'
  } finally {
    loading.value = false
  }
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(value) {
  if (!value) return '—'

  return new Date(Number(value)).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatStatus(status) {
  return String(status || 'unknown').replaceAll('_', ' ')
}

function statusClass(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'paid') return 'paid'
  if (value === 'pending') return 'pending'
  if (value === 'overdue') return 'overdue'
  if (value === 'free_trial') return 'trial'

  return 'unknown'
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped>
.transactions-page {
  display: grid;
  gap: 24px;
  animation: fadeIn 0.45s ease both;
}

.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 22px;
  border-top: 1px solid #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.06), transparent 32%),
    #ffffff;
}

.pagination-info {
  color: #64748b;
  font-size: 0.92rem;
  font-weight: 750;
}

.pagination-info strong {
  color: #0f172a;
  font-weight: 950;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.page-btn,
.page-number {
  min-width: 38px;
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #ffffff;
  color: #334155;
  font-weight: 850;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.page-btn {
  padding: 0 12px;
}

.page-btn:hover:not(:disabled),
.page-number:hover {
  transform: translateY(-2px);
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-number.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
}

.page-size-select {
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #ffffff;
  color: #334155;
  padding: 0 10px;
  font-weight: 850;
  outline: none;
}

.page-size-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

@media (max-width: 650px) {
  .pagination-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .pagination-controls {
    justify-content: center;
  }

  .page-size-select {
    width: 100%;
  }
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-end;
  border-radius: 34px;
  padding: 34px;
  color: #ffffff;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.5), transparent 34%),
    radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.35), transparent 35%),
    linear-gradient(135deg, #020617, #111827 55%, #1e293b);
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.32);
}

.eyebrow {
  margin: 0 0 10px;
  color: #93c5fd;
  font-size: 0.75rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.hero-card h1 {
  margin: 0 0 10px;
  font-size: 2.35rem;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.hero-card p {
  margin: 0;
  max-width: 760px;
  color: #cbd5e1;
  line-height: 1.7;
}

.refresh-btn {
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1.2rem;
  background: #ffffff;
  color: #0f172a;
  font-weight: 950;
  cursor: pointer;
}

.alert-error {
  padding: 15px 18px;
  border-radius: 18px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  font-weight: 800;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  border-radius: 28px;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 22px 56px rgba(15, 23, 42, 0.08);
}

.stat-card span {
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 1.75rem;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.stat-card small {
  color: #64748b;
  font-weight: 700;
}

.blue {
  border-top: 4px solid #2563eb;
}

.green {
  border-top: 4px solid #16a34a;
}

.amber {
  border-top: 4px solid #d97706;
}

.purple {
  border-top: 4px solid #7c3aed;
}

.toolbar-card {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  padding: 18px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06);
}

.search-input,
.filter-select {
  min-height: 44px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  padding: 0 14px;
  outline: none;
  font-weight: 750;
}

.search-input {
  flex: 1 1 340px;
}

.filter-select {
  flex: 0 0 180px;
}

.table-card {
  background: #ffffff;
  border-radius: 30px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.table-header {
  padding: 22px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.table-header h2 {
  margin: 0;
  color: #0f172a;
  font-weight: 950;
}

.table-header p {
  margin: 4px 0 0;
  color: #64748b;
}

.loading-box,
.empty-cell {
  padding: 42px;
  text-align: center;
  color: #64748b;
  font-weight: 850;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1180px;
}

th {
  text-align: left;
  padding: 15px 16px;
  background: #f8fafc;
  color: #475569;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

td {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
  color: #0f172a;
  vertical-align: top;
}

td small {
  display: block;
  color: #64748b;
  margin-top: 4px;
}

code {
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 9px;
  background: #f1f5f9;
  color: #334155;
  font-weight: 800;
}

.muted {
  color: #94a3b8;
}

.status-pill {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 950;
  text-transform: capitalize;
}

.status-pill.paid {
  background: #dcfce7;
  color: #166534;
}

.status-pill.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-pill.overdue {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.trial {
  background: #ede9fe;
  color: #5b21b6;
}

.status-pill.unknown {
  background: #f1f5f9;
  color: #475569;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 650px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-card {
    padding: 26px;
    border-radius: 26px;
  }

  .hero-card h1 {
    font-size: 1.7rem;
  }

  .refresh-btn,
  .filter-select {
    width: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
