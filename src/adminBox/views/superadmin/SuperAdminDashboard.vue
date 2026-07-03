<template>
  <div class="superadmin-page">
    <div v-if="loading" class="dashboard-state">
      Loading superadmin dashboard...
    </div>

    <div v-else-if="error" class="dashboard-state dashboard-error">
      {{ error }}
    </div>

    <template v-else>
      <!-- Header -->
      <section class="hero">
        <div>
          <span class="hero-badge">SuperAdmin Control Center</span>

          <h1 style="color:bisque">Business Administration</h1>

          <p>
            Manage school accounts, tenants, subscriptions, provisioning status,
            transactions, and platform activity from one secure dashboard.
          </p>
        </div>

        <div class="hero-actions">
          <button class="btn btn-light" type="button" @click="refreshDashboard">
            Refresh
          </button>

          <button class="btn btn-dark" type="button" @click="goToAccounts">
            Manage Accounts
          </button>
        </div>
      </section>

      <!-- Summary Cards -->
      <section class="summary-grid">
        <div class="summary-card">
          <span class="summary-label">Total Accounts</span>
          <strong>{{ stats.totalAccounts }}</strong>
          <small>
            {{ stats.activeAccounts }} active • {{ stats.inactiveAccounts }} inactive
          </small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Total Tenants</span>
          <strong>{{ stats.totalTenants }}</strong>
          <small>
            {{ stats.activeTenants }} active • {{ stats.suspendedTenants }} suspended
          </small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Provisioned</span>
          <strong>{{ stats.provisionedAccounts }}</strong>
          <small>{{ stats.failedProvisioning }} failed provisioning</small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Revenue</span>
          <strong>₵{{ totalRevenueFormatted }}</strong>
          <small>{{ successfulTransactions.length }} paid transactions</small>
        </div>
      </section>

      <!-- Transaction Summary Cards -->
      <section class="summary-grid">
        <div class="summary-card">
          <span class="summary-label">All Transactions</span>
          <strong>{{ transactions.length }}</strong>
          <small>Invoices and subscription records</small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Pending Amount</span>
          <strong>₵{{ pendingAmountFormatted }}</strong>
          <small>{{ pendingTransactions.length }} pending invoices</small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Free Trials</span>
          <strong>{{ freeTrialTransactions.length }}</strong>
          <small>Trial invoice records</small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Outstanding</span>
          <strong>₵{{ outstandingAmountFormatted }}</strong>
          <small>Pending or overdue invoices</small>
        </div>
      </section>

      <!-- Filters -->
      <section class="filter-card">
        <div>
          <h2>Quick Search</h2>
          <p>
            Filter accounts, tenants, and transactions by school, email,
            tenant code, payment reference, status, academic year, or term.
          </p>
        </div>

        <input
          v-model="search"
          class="search-input"
          type="text"
          placeholder="Search by school name, email, tenant code, transaction..."
        />
      </section>

      <!-- Main Grid -->
      <section class="main-grid">
        <!-- Accounts Table -->
        <div class="card table-card wide-card">
          <div class="card-header">
            <div>
              <h2>Accounts</h2>
              <p>Data from <strong>ktor-business.accounts</strong></p>
            </div>

            <span class="pill pill-blue">
              {{ filteredAccounts.length }} shown
            </span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>School</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Tenant Code</th>
                  <th>Email Verified</th>
                  <th>Active</th>
                  <th>Provisioned</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(account, index) in paginatedAccounts" :key="account.id">
                  <td>{{ accountsStartIndex + index + 1 }}</td>

                  <td>
                    <strong>{{ account.schoolName || '-' }}</strong>
                    <small>{{ account.location || 'No location' }}</small>
                  </td>

                  <td>
                    {{ account.fullName || '-' }}
                    <small>{{ account.phoneNumber || '-' }}</small>
                  </td>

                  <td>{{ account.email || '-' }}</td>
                  <td>{{ account.tenantCode || '-' }}</td>

                  <td>
                    <span :class="['status-pill', account.isEmailVerified ? 'success' : 'warning']">
                      {{ account.isEmailVerified ? 'Verified' : 'Pending' }}
                    </span>
                  </td>

                  <td>
                    <span :class="['status-pill', account.isActive ? 'success' : 'danger']">
                      {{ account.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>

                  <td>
                    <span :class="['status-pill', account.tenantProvisioned ? 'success' : 'warning']">
                      {{ account.tenantProvisioned ? 'Yes' : 'No' }}
                    </span>
                  </td>

                  <td>
                    <button
                      class="btn btn-small"
                      :class="account.isActive ? 'btn-danger' : 'btn-success'"
                      type="button"
                      @click="toggleAccount(account)"
                    >
                      {{ account.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredAccounts.length === 0">
                  <td colspan="9" class="empty-cell">
                    No accounts found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Accounts Pagination -->
          <div v-if="filteredAccounts.length > 0" class="pagination-bar">
            <div class="pagination-info">
              Showing
              <strong>{{ accountsShowingFrom }}</strong>
              -
              <strong>{{ accountsShowingTo }}</strong>
              of
              <strong>{{ filteredAccounts.length }}</strong>
              accounts
            </div>

            <div class="pagination-controls">
              <button
                class="page-btn"
                type="button"
                :disabled="accountsPage === 1"
                @click="goToAccountsPage(1)"
              >
                First
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="accountsPage === 1"
                @click="goToAccountsPage(accountsPage - 1)"
              >
                Prev
              </button>

              <button
                v-for="page in accountsVisiblePages"
                :key="`accounts-${page}`"
                type="button"
                :class="['page-number', { active: page === accountsPage }]"
                @click="goToAccountsPage(page)"
              >
                {{ page }}
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="accountsPage === accountsTotalPages"
                @click="goToAccountsPage(accountsPage + 1)"
              >
                Next
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="accountsPage === accountsTotalPages"
                @click="goToAccountsPage(accountsTotalPages)"
              >
                Last
              </button>

              <select v-model.number="accountsPageSize" class="page-size-select">
                <option :value="5">5 / page</option>
                <option :value="10">10 / page</option>
                <option :value="20">20 / page</option>
                <option :value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tenants Table -->
        <div class="card table-card wide-card">
          <div class="card-header">
            <div>
              <h2>Tenants</h2>
              <p>
                Fetched through
                <strong>ktor-business → ktor-tenant internal API</strong>
              </p>
            </div>

            <span class="pill pill-green">
              {{ filteredTenants.length }} shown
            </span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>School</th>
                  <th>Tenant Code</th>
                  <th>Schema</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(tenant, index) in paginatedTenants"
                  :key="tenant.id || tenant.tenantCode"
                >
                  <td>{{ tenantsStartIndex + index + 1 }}</td>

                  <td>
                    <strong>{{ tenant.schoolName || '-' }}</strong>
                    <small>{{ tenant.location || tenant.contactEmail || '-' }}</small>
                  </td>

                  <td>{{ tenant.tenantCode || '-' }}</td>
                  <td>{{ tenant.tenantSchema || tenant.schemaName || '-' }}</td>

                  <td>
                    <span :class="['status-pill', tenantStatusClass(tenant.status)]">
                      {{ tenant.status || 'unknown' }}
                    </span>
                  </td>

                  <td>
                    <select
                      class="status-select"
                      :value="tenant.status"
                      @change="changeTenantStatus(tenant, $event.target.value)"
                    >
                      <option value="provisioning">provisioning</option>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="suspended">suspended</option>
                      <option value="failed">failed</option>
                    </select>
                  </td>
                </tr>

                <tr v-if="filteredTenants.length === 0">
                  <td colspan="6" class="empty-cell">
                    No tenants found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tenants Pagination -->
          <div v-if="filteredTenants.length > 0" class="pagination-bar">
            <div class="pagination-info">
              Showing
              <strong>{{ tenantsShowingFrom }}</strong>
              -
              <strong>{{ tenantsShowingTo }}</strong>
              of
              <strong>{{ filteredTenants.length }}</strong>
              tenants
            </div>

            <div class="pagination-controls">
              <button
                class="page-btn"
                type="button"
                :disabled="tenantsPage === 1"
                @click="goToTenantsPage(1)"
              >
                First
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="tenantsPage === 1"
                @click="goToTenantsPage(tenantsPage - 1)"
              >
                Prev
              </button>

              <button
                v-for="page in tenantsVisiblePages"
                :key="`tenants-${page}`"
                type="button"
                :class="['page-number', { active: page === tenantsPage }]"
                @click="goToTenantsPage(page)"
              >
                {{ page }}
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="tenantsPage === tenantsTotalPages"
                @click="goToTenantsPage(tenantsPage + 1)"
              >
                Next
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="tenantsPage === tenantsTotalPages"
                @click="goToTenantsPage(tenantsTotalPages)"
              >
                Last
              </button>

              <select v-model.number="tenantsPageSize" class="page-size-select">
                <option :value="5">5 / page</option>
                <option :value="10">10 / page</option>
                <option :value="20">20 / page</option>
                <option :value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="card table-card wide-card">
          <div class="card-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>
                Subscription invoice records from
                <strong>ktor-business.subscription_invoices</strong>
              </p>
            </div>

            <span class="pill pill-purple">
              {{ filteredTransactions.length }} shown
            </span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tenant</th>
                  <th>Academic Period</th>
                  <th>Students</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Due</th>
                  <th>Paid At</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(transaction, index) in paginatedTransactions"
                  :key="transaction.id"
                >
                  <td>{{ transactionsStartIndex + index + 1 }}</td>

                  <td>
                    <strong>{{ transaction.tenantCode || '-' }}</strong>
                    <small>Account ID: {{ transaction.accountId || '-' }}</small>
                  </td>

                  <td>
                    <strong>{{ getAcademicPeriod(transaction) }}</strong>
                    <small>
                      Year ID: {{ transaction.academicYearId || '-' }} •
                      Term ID: {{ transaction.academicTermId || '-' }}
                    </small>
                  </td>

                  <td>
                    {{ Number(transaction.studentCount || 0).toLocaleString() }}
                  </td>

                  <td>
                    ₵{{ formatMoney(transaction.amountPerStudentCedis) }}
                  </td>

                  <td>
                    <strong>₵{{ formatMoney(transaction.totalAmountCedis) }}</strong>
                  </td>

                  <td>
                    <span
                      :class="['status-pill', transactionStatusClass(transaction.paymentStatus)]"
                    >
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
                  <td colspan="11" class="empty-cell">
                    No transactions found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Transactions Pagination -->
          <div v-if="filteredTransactions.length > 0" class="pagination-bar">
            <div class="pagination-info">
              Showing
              <strong>{{ transactionsShowingFrom }}</strong>
              -
              <strong>{{ transactionsShowingTo }}</strong>
              of
              <strong>{{ filteredTransactions.length }}</strong>
              transactions
            </div>

            <div class="pagination-controls">
              <button
                class="page-btn"
                type="button"
                :disabled="transactionsPage === 1"
                @click="goToTransactionsPage(1)"
              >
                First
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="transactionsPage === 1"
                @click="goToTransactionsPage(transactionsPage - 1)"
              >
                Prev
              </button>

              <button
                v-for="page in transactionsVisiblePages"
                :key="`transactions-${page}`"
                type="button"
                :class="['page-number', { active: page === transactionsPage }]"
                @click="goToTransactionsPage(page)"
              >
                {{ page }}
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="transactionsPage === transactionsTotalPages"
                @click="goToTransactionsPage(transactionsPage + 1)"
              >
                Next
              </button>

              <button
                class="page-btn"
                type="button"
                :disabled="transactionsPage === transactionsTotalPages"
                @click="goToTransactionsPage(transactionsTotalPages)"
              >
                Last
              </button>

              <select v-model.number="transactionsPageSize" class="page-size-select">
                <option :value="5">5 / page</option>
                <option :value="10">10 / page</option>
                <option :value="20">20 / page</option>
                <option :value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Provisioning Issues -->
        <div class="card table-card wide-card">
          <div class="card-header">
            <div>
              <h2>Provisioning Issues</h2>
              <p>Accounts with failed or incomplete tenant provisioning.</p>
            </div>

            <span class="pill pill-red">
              {{ provisioningIssues.length }} issues
            </span>
          </div>

          <div class="issue-list">
            <div
              v-for="account in provisioningIssues"
              :key="account.id"
              class="issue-item"
            >
              <div>
                <strong>{{ account.schoolName || '-' }}</strong>
                <span>{{ account.tenantCode || '-' }}</span>
                <p>
                  {{ account.tenantProvisionError || 'Tenant not provisioned yet.' }}
                </p>
              </div>

              <button class="btn btn-light btn-small" type="button" @click="viewAccount(account)">
                View
              </button>
            </div>

            <div v-if="provisioningIssues.length === 0" class="empty-box">
              No provisioning issues.
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import {
    getSuperAdminAccounts,
    getSuperAdminTenants,
    getSuperAdminTransactions,
    updateSuperAdminAccountActive,
    updateSuperAdminTenantStatus,
} from '@/adminBox/services/superadminApi.js'

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const search = ref('')

const accounts = ref([])
const tenants = ref([])
const transactions = ref([])

const accountsPage = ref(1)
const accountsPageSize = ref(10)

const tenantsPage = ref(1)
const tenantsPageSize = ref(10)

const transactionsPage = ref(1)
const transactionsPageSize = ref(10)

const stats = reactive({
  totalAccounts: 0,
  activeAccounts: 0,
  inactiveAccounts: 0,

  totalTenants: 0,
  activeTenants: 0,
  suspendedTenants: 0,

  provisionedAccounts: 0,
  failedProvisioning: 0,
})

const normalizedSearch = computed(() => {
  return search.value.trim().toLowerCase()
})

const filteredAccounts = computed(() => {
  if (!normalizedSearch.value) return accounts.value

  return accounts.value.filter((item) => {
    return [
      item.schoolName,
      item.fullName,
      item.email,
      item.phoneNumber,
      item.tenantCode,
      item.tenantStatus,
      item.location,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  })
})

const filteredTenants = computed(() => {
  if (!normalizedSearch.value) return tenants.value

  return tenants.value.filter((item) => {
    return [
      item.schoolName,
      item.tenantCode,
      item.tenantSchema,
      item.schemaName,
      item.defaultDomain,
      item.status,
      item.location,
      item.contactEmail,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  })
})

const filteredTransactions = computed(() => {
  if (!normalizedSearch.value) return transactions.value

  return transactions.value.filter((item) => {
    return [
      item.tenantCode,
      item.paymentStatus,
      item.paystackReference,
      item.academicYearName,
      item.termName,
      item.studentCount,
      item.totalAmountCedis,
      item.accountId,
      item.id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  })
})

function getTotalPages(items, pageSize) {
  const total = Math.ceil(items.length / pageSize)
  return total > 0 ? total : 1
}

function getVisiblePages(currentPage, totalPages) {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1

  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  return pages
}

function clampPage(page, totalPages) {
  if (page < 1) return 1
  if (page > totalPages) return totalPages
  return page
}

/* Accounts pagination */
const accountsTotalPages = computed(() => {
  return getTotalPages(filteredAccounts.value, accountsPageSize.value)
})

const accountsStartIndex = computed(() => {
  return (accountsPage.value - 1) * accountsPageSize.value
})

const paginatedAccounts = computed(() => {
  return filteredAccounts.value.slice(
    accountsStartIndex.value,
    accountsStartIndex.value + accountsPageSize.value
  )
})

const accountsVisiblePages = computed(() => {
  return getVisiblePages(accountsPage.value, accountsTotalPages.value)
})

const accountsShowingFrom = computed(() => {
  if (!filteredAccounts.value.length) return 0
  return accountsStartIndex.value + 1
})

const accountsShowingTo = computed(() => {
  return Math.min(
    accountsPage.value * accountsPageSize.value,
    filteredAccounts.value.length
  )
})

function goToAccountsPage(page) {
  accountsPage.value = clampPage(page, accountsTotalPages.value)
}

/* Tenants pagination */
const tenantsTotalPages = computed(() => {
  return getTotalPages(filteredTenants.value, tenantsPageSize.value)
})

const tenantsStartIndex = computed(() => {
  return (tenantsPage.value - 1) * tenantsPageSize.value
})

const paginatedTenants = computed(() => {
  return filteredTenants.value.slice(
    tenantsStartIndex.value,
    tenantsStartIndex.value + tenantsPageSize.value
  )
})

const tenantsVisiblePages = computed(() => {
  return getVisiblePages(tenantsPage.value, tenantsTotalPages.value)
})

const tenantsShowingFrom = computed(() => {
  if (!filteredTenants.value.length) return 0
  return tenantsStartIndex.value + 1
})

const tenantsShowingTo = computed(() => {
  return Math.min(
    tenantsPage.value * tenantsPageSize.value,
    filteredTenants.value.length
  )
})

function goToTenantsPage(page) {
  tenantsPage.value = clampPage(page, tenantsTotalPages.value)
}

/* Transactions pagination */
const transactionsTotalPages = computed(() => {
  return getTotalPages(filteredTransactions.value, transactionsPageSize.value)
})

const transactionsStartIndex = computed(() => {
  return (transactionsPage.value - 1) * transactionsPageSize.value
})

const paginatedTransactions = computed(() => {
  return filteredTransactions.value.slice(
    transactionsStartIndex.value,
    transactionsStartIndex.value + transactionsPageSize.value
  )
})

const transactionsVisiblePages = computed(() => {
  return getVisiblePages(transactionsPage.value, transactionsTotalPages.value)
})

const transactionsShowingFrom = computed(() => {
  if (!filteredTransactions.value.length) return 0
  return transactionsStartIndex.value + 1
})

const transactionsShowingTo = computed(() => {
  return Math.min(
    transactionsPage.value * transactionsPageSize.value,
    filteredTransactions.value.length
  )
})

function goToTransactionsPage(page) {
  transactionsPage.value = clampPage(page, transactionsTotalPages.value)
}

/* Transaction summaries */
const successfulTransactions = computed(() => {
  return transactions.value.filter((item) => {
    return String(item.paymentStatus || '').toLowerCase() === 'paid' || item.isPaid
  })
})

const pendingTransactions = computed(() => {
  return transactions.value.filter((item) => {
    return String(item.paymentStatus || '').toLowerCase() === 'pending'
  })
})

const overdueTransactions = computed(() => {
  return transactions.value.filter((item) => {
    return String(item.paymentStatus || '').toLowerCase() === 'overdue'
  })
})

const freeTrialTransactions = computed(() => {
  return transactions.value.filter((item) => {
    return String(item.paymentStatus || '').toLowerCase() === 'free_trial'
  })
})

const totalRevenueFormatted = computed(() => {
  const total = successfulTransactions.value.reduce((sum, item) => {
    return sum + Number(item.totalAmountCedis || 0)
  }, 0)

  return formatMoney(total)
})

const pendingAmountFormatted = computed(() => {
  const total = pendingTransactions.value.reduce((sum, item) => {
    return sum + Number(item.totalAmountCedis || 0)
  }, 0)

  return formatMoney(total)
})

const outstandingAmountFormatted = computed(() => {
  const total = [...pendingTransactions.value, ...overdueTransactions.value].reduce(
    (sum, item) => {
      return sum + Number(item.totalAmountCedis || 0)
    },
    0
  )

  return formatMoney(total)
})

const provisioningIssues = computed(() => {
  return accounts.value.filter((account) => {
    return !account.tenantProvisioned || account.tenantProvisionError
  })
})

function calculateStats() {
  stats.totalAccounts = accounts.value.length
  stats.activeAccounts = accounts.value.filter((item) => item.isActive).length
  stats.inactiveAccounts = stats.totalAccounts - stats.activeAccounts

  stats.totalTenants = tenants.value.length
  stats.activeTenants = tenants.value.filter((item) => item.status === 'active').length
  stats.suspendedTenants = tenants.value.filter((item) => item.status === 'suspended').length

  stats.provisionedAccounts = accounts.value.filter((item) => item.tenantProvisioned).length
  stats.failedProvisioning = accounts.value.filter((item) => item.tenantProvisionError).length
}

async function fetchDashboard() {
  loading.value = true
  error.value = ''

  try {
    const [accountsResponse, tenantsResponse, transactionsResponse] = await Promise.all([
      getSuperAdminAccounts(),
      getSuperAdminTenants(),
      getSuperAdminTransactions(),
    ])

    accounts.value = Array.isArray(accountsResponse.data)
      ? accountsResponse.data
      : []

    tenants.value = Array.isArray(tenantsResponse.data)
      ? tenantsResponse.data
      : []

    transactions.value = Array.isArray(transactionsResponse.data)
      ? transactionsResponse.data
      : []

    calculateStats()
  } catch (err) {
    console.error('Superadmin dashboard error:', err)

    error.value =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Failed to load superadmin dashboard data.'
  } finally {
    loading.value = false
  }
}

async function refreshDashboard() {
  await fetchDashboard()
}

async function toggleAccount(account) {
  const nextValue = !account.isActive

  try {
    await updateSuperAdminAccountActive(account.id, nextValue)

    account.isActive = nextValue
    account.tenantStatus = nextValue ? 'active' : 'inactive'

    calculateStats()
  } catch (err) {
    alert(
      err.response?.data?.message ||
        err.message ||
        'Failed to update account status.'
    )
  }
}

async function changeTenantStatus(tenant, status) {
  const oldStatus = tenant.status

  try {
    await updateSuperAdminTenantStatus(tenant.tenantCode, status)

    tenant.status = status

    calculateStats()
  } catch (err) {
    tenant.status = oldStatus

    alert(
      err.response?.data?.message ||
        err.message ||
        'Failed to update tenant status.'
    )
  }
}

function tenantStatusClass(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'active') return 'success'
  if (value === 'suspended') return 'danger'
  if (value === 'inactive') return 'muted'
  if (value === 'failed') return 'danger'
  if (value === 'provisioning') return 'warning'

  return 'warning'
}

function transactionStatusClass(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'paid') return 'success'
  if (value === 'pending') return 'warning'
  if (value === 'overdue') return 'danger'
  if (value === 'failed') return 'danger'
  if (value === 'free_trial') return 'info'
  if (value === 'waived') return 'info'
  if (value === 'cancelled') return 'muted'

  return 'muted'
}

function formatStatus(status) {
  return String(status || 'unknown').replaceAll('_', ' ')
}

function getAcademicPeriod(transaction) {
  const year = transaction.academicYearName || 'Unknown Year'
  const term = transaction.termName

  return term ? `${year} - ${term}` : year
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(epochMillis) {
  if (!epochMillis) return '-'

  return new Date(Number(epochMillis)).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatUrl(domain) {
  if (!domain) return '#'

  return domain.startsWith('http') ? domain : `https://${domain}`
}

function goToAccounts() {
  router.push('/superadmin/accounts')
}

function viewAccount(account) {
  router.push(`/superadmin/accounts/${account.id}`)
}

watch(search, () => {
  accountsPage.value = 1
  tenantsPage.value = 1
  transactionsPage.value = 1
})

watch(accountsPageSize, () => {
  accountsPage.value = 1
})

watch(tenantsPageSize, () => {
  tenantsPage.value = 1
})

watch(transactionsPageSize, () => {
  transactionsPage.value = 1
})

watch(accountsTotalPages, () => {
  if (accountsPage.value > accountsTotalPages.value) {
    accountsPage.value = accountsTotalPages.value
  }
})

watch(tenantsTotalPages, () => {
  if (tenantsPage.value > tenantsTotalPages.value) {
    tenantsPage.value = tenantsTotalPages.value
  }
})

watch(transactionsTotalPages, () => {
  if (transactionsPage.value > transactionsTotalPages.value) {
    transactionsPage.value = transactionsTotalPages.value
  }
})

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.superadmin-page {
  display: grid;
  gap: 24px;
  animation: pageFadeIn 0.45s ease both;
}

.dashboard-state {
  padding: 40px;
  border-radius: 24px;
  background: #ffffff;
  color: #334155;
  font-weight: 900;
  text-align: center;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

.dashboard-error {
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  padding: 34px;
  border-radius: 34px;
  color: #ffffff;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.55), transparent 34%),
    radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.35), transparent 35%),
    linear-gradient(135deg, #020617, #111827 55%, #1e293b);
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.32);
}

.hero-badge {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #bfdbfe;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
}

.hero h1 {
  margin: 0 0 10px;
  font-size: 2.35rem;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.hero p {
  margin: 0;
  max-width: 760px;
  color: #cbd5e1;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.summary-card {
  padding: 22px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 22px 56px rgba(15, 23, 42, 0.08);
}

.summary-label {
  display: block;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.summary-card strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 1.75rem;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.summary-card small {
  color: #64748b;
  font-weight: 700;
}

.filter-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
  padding: 22px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
}

.filter-card h2 {
  margin: 0 0 4px;
  color: #0f172a;
  font-weight: 950;
}

.filter-card p {
  margin: 0;
  color: #64748b;
}

.search-input {
  min-width: min(420px, 100%);
  min-height: 46px;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 0 16px;
  outline: none;
  color: #0f172a;
  font-weight: 800;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.main-grid {
  display: grid;
  gap: 24px;
}

.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 22px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  margin: 0;
  color: #0f172a;
  font-weight: 950;
}

.card-header p {
  margin: 4px 0 0;
  color: #64748b;
}

.pill {
  display: inline-flex;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 950;
  white-space: nowrap;
}

.pill-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.pill-green {
  background: #dcfce7;
  color: #166534;
}

.pill-purple {
  background: #ede9fe;
  color: #5b21b6;
}

.pill-red {
  background: #fee2e2;
  color: #991b1b;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
}

th {
  padding: 15px 16px;
  text-align: left;
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

.empty-cell,
.empty-box {
  padding: 35px;
  text-align: center;
  color: #64748b;
  font-weight: 850;
}

.status-pill {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 950;
  text-transform: capitalize;
}

.status-pill.success {
  background: #dcfce7;
  color: #166534;
}

.status-pill.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-pill.danger {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.info {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-pill.muted {
  background: #f1f5f9;
  color: #475569;
}

.status-select {
  height: 38px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  padding: 0 10px;
  outline: none;
  font-weight: 800;
  color: #334155;
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

.btn {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.18s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-small {
  padding: 7px 11px;
  font-size: 0.82rem;
}

.btn-light {
  background: #ffffff;
  color: #0f172a;
}

.btn-dark {
  background: #0f172a;
  color: #ffffff;
}

.btn-danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn-success {
  background: #dcfce7;
  color: #166534;
}

.issue-list {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.issue-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.issue-item strong {
  display: block;
  color: #0f172a;
}

.issue-item span {
  display: block;
  color: #2563eb;
  font-weight: 900;
  margin-top: 3px;
}

.issue-item p {
  margin: 6px 0 0;
  color: #64748b;
}

.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.05), transparent 30%),
    #ffffff;
}

.pagination-info {
  color: #64748b;
  font-size: 0.9rem;
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
    border-color 0.18s ease,
    box-shadow 0.18s ease;
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

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 26px;
    border-radius: 26px;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .filter-card {
    align-items: stretch;
    flex-direction: column;
  }

  .search-input {
    min-width: 100%;
  }

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

@keyframes pageFadeIn {
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






<style scoped>
* {
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

.superadmin-page {
  max-width: 1480px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
  color: #0f172a;
}

.dashboard-state {
  padding: 24px;
  border-radius: 18px;
  background: #ffffff;
  color: #111827;
  font-weight: 800;
  border: 1px solid #e2e8f0;
}

.dashboard-error {
  color: #991b1b;
  background: #fee2e2;
  border-color: #fecaca;
}

/* Hero */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
  color: #ffffff;
  border-radius: 26px;
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: 0 16px 35px rgba(15, 23, 42, 0.16);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 12px;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.hero p {
  margin: 0;
  color: #dbeafe;
  line-height: 1.6;
  max-width: 800px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Summary */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);
}

.summary-label {
  display: block;
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 700;
}

.summary-card strong {
  display: block;
  font-size: 1.55rem;
  font-weight: 900;
  margin-bottom: 6px;
  color: #0f172a;
}

.summary-card small {
  color: #64748b;
  font-size: 0.84rem;
}

/* Filter */
.filter-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  padding: 18px;
  margin-bottom: 20px;
}

.filter-card h2 {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 900;
}

.filter-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.search-input {
  width: min(460px, 100%);
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 12px 14px;
  outline: none;
  font-weight: 700;
  color: #0f172a;
}

.search-input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
}

/* Layout */
.main-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.wide-card {
  grid-column: span 2;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.card-header h2 {
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 900;
}

.card-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

/* Pills */
.pill {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.pill-blue {
  background: #e0ecff;
  color: #1d4ed8;
}

.pill-green {
  background: #dcfce7;
  color: #166534;
}

.pill-purple {
  background: #f3e8ff;
  color: #7e22ce;
}

.pill-red {
  background: #fee2e2;
  color: #991b1b;
}

/* Tables */
.table-wrap {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

th {
  text-align: left;
  font-size: 0.78rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 13px 12px;
  border-bottom: 1px solid #eef2f7;
  vertical-align: top;
  font-size: 0.9rem;
}

td strong {
  display: block;
  color: #0f172a;
  font-weight: 900;
  margin-bottom: 4px;
}

td small {
  display: block;
  color: #64748b;
  font-size: 0.78rem;
}

td a {
  color: #1d4ed8;
  font-weight: 800;
  text-decoration: none;
}

td a:hover {
  text-decoration: underline;
}

.empty-cell {
  text-align: center;
  color: #64748b;
  font-weight: 700;
  padding: 28px;
}

/* Status */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: capitalize;
}

.status-pill.success {
  background: #dcfce7;
  color: #166534;
}

.status-pill.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-pill.danger {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.muted {
  background: #f1f5f9;
  color: #475569;
}

.status-select {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 9px 10px;
  background: #ffffff;
  font-weight: 800;
  color: #0f172a;
}

/* Issues */
.issue-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
}

.issue-item strong {
  display: block;
  font-weight: 900;
  margin-bottom: 4px;
}

.issue-item span {
  display: block;
  color: #64748b;
  font-size: 0.82rem;
  margin-bottom: 6px;
}

.issue-item p {
  margin: 0;
  color: #991b1b;
  font-size: 0.86rem;
  line-height: 1.4;
}

.empty-box {
  padding: 20px;
  text-align: center;
  border-radius: 16px;
  background: #f8fafc;
  color: #64748b;
  font-weight: 800;
}

/* Buttons */
.btn {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-dark {
  background: #ffffff;
  color: #0f172a;
}

.btn-dark:hover {
  transform: translateY(-1px);
  background: #f8fafc;
}

.btn-light {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.filter-card .btn-light,
.issue-item .btn-light {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

.btn-success {
  background: #16a34a;
  color: #ffffff;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-small {
  padding: 9px 12px;
  font-size: 0.82rem;
}

/* Responsive */
@media (max-width: 1180px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-grid {
    grid-template-columns: 1fr;
  }

  .wide-card {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .superadmin-page {
    padding: 16px;
  }

  .hero,
  .filter-card {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .btn {
    width: 100%;
  }

  .card-header {
    flex-direction: column;
  }
}
</style>
