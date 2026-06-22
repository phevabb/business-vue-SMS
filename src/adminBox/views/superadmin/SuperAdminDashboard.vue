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
          <h1>Business Administration</h1>
          <p>
            Manage school accounts, tenants, subscriptions, provisioning status,
            transactions, and platform activity from one secure dashboard.
          </p>
        </div>

        <div class="hero-actions">
          <button class="btn btn-light" @click="refreshDashboard">
            Refresh
          </button>
          <button class="btn btn-dark" @click="goToAccounts">
            Manage Accounts
          </button>
        </div>
      </section>

      <!-- Summary Cards -->
      <section class="summary-grid">
        <div class="summary-card">
          <span class="summary-label">Total Accounts</span>
          <strong>{{ stats.totalAccounts }}</strong>
          <small>{{ stats.activeAccounts }} active • {{ stats.inactiveAccounts }} inactive</small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Total Tenants</span>
          <strong>{{ stats.totalTenants }}</strong>
          <small>{{ stats.activeTenants }} active • {{ stats.suspendedTenants }} suspended</small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Provisioned</span>
          <strong>{{ stats.provisionedAccounts }}</strong>
          <small>{{ stats.failedProvisioning }} failed provisioning</small>
        </div>

        <div class="summary-card">
          <span class="summary-label">Revenue</span>
          <strong>₵{{ totalRevenueFormatted }}</strong>
          <small>{{ successfulTransactions.length }} successful transactions</small>
        </div>
      </section>

      <!-- Filters -->
      <section class="filter-card">
        <div>
          <h2>Quick Search</h2>
          <p>Filter accounts, tenants, and transactions by school, email, tenant code, or status.</p>
        </div>

        <input
          v-model="search"
          class="search-input"
          type="text"
          placeholder="Search by school name, email, tenant code..."
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
            <span class="pill pill-blue">{{ filteredAccounts.length }} shown</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
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
                <tr v-for="account in filteredAccounts" :key="account.id">
                  <td>
                    <strong>{{ account.schoolName || '-' }}</strong>
                    <small>{{ account.location || 'No location' }}</small>
                  </td>

                  <td>
                    {{ account.fullName || '-' }}
                    <small>{{ account.phoneNumber || '-' }}</small>
                  </td>

                  <td>{{ account.email }}</td>
                  <td>{{ account.tenantCode }}</td>

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
                      @click="toggleAccount(account)"
                    >
                      {{ account.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredAccounts.length === 0">
                  <td colspan="8" class="empty-cell">No accounts found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tenants Table -->
        <div class="card table-card wide-card">
          <div class="card-header">
            <div>
              <h2>Tenants</h2>
              <p>Fetched through <strong>ktor-business → ktor-tenant internal API</strong></p>
            </div>
            <span class="pill pill-green">{{ filteredTenants.length }} shown</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>School</th>
                  <th>Tenant Code</th>
                  <th>Schema</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="tenant in filteredTenants" :key="tenant.id || tenant.tenantCode">
                  <td>
                    <strong>{{ tenant.schoolName || '-' }}</strong>
                    <small>{{ tenant.location || tenant.contactEmail || '-' }}</small>
                  </td>

                  <td>{{ tenant.tenantCode }}</td>
                  <td>{{ tenant.tenantSchema || tenant.schemaName || '-' }}</td>

                  <td>
  <a
    v-if="tenant.defaultDomain"
    :href="formatUrl(tenant.defaultDomain)"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span :class="['status-pill', tenantStatusClass(tenant.status)]">
      {{ tenant.status || 'unknown' }}
    </span>
  </a>
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
                  <td colspan="6" class="empty-cell">No tenants found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="card table-card">
          <div class="card-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Subscription and payment records from <strong>ktor-business</strong></p>
            </div>
            <span class="pill pill-purple">{{ filteredTransactions.length }} shown</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.id || transaction.internalReference">
                  <td>{{ transaction.tenantCode || '-' }}</td>
                  <td>₵{{ pesewasToCedis(transaction.amountPesewas) }}</td>
                  <td>
                    <span :class="['status-pill', transactionStatusClass(transaction.status)]">
                      {{ transaction.status || 'pending' }}
                    </span>
                  </td>
                  <td>{{ transaction.internalReference || transaction.providerReference || '-' }}</td>
                  <td>{{ formatDate(transaction.createdAtEpochMillis) }}</td>
                </tr>

                <tr v-if="filteredTransactions.length === 0">
                  <td colspan="5" class="empty-cell">No transactions found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Provisioning Issues -->
        <div class="card table-card">
          <div class="card-header">
            <div>
              <h2>Provisioning Issues</h2>
              <p>Accounts with failed or incomplete tenant provisioning.</p>
            </div>
            <span class="pill pill-red">{{ provisioningIssues.length }} issues</span>
          </div>

          <div class="issue-list">
            <div
              v-for="account in provisioningIssues"
              :key="account.id"
              class="issue-item"
            >
              <div>
                <strong>{{ account.schoolName }}</strong>
                <span>{{ account.tenantCode }}</span>
                <p>{{ account.tenantProvisionError || 'Tenant not provisioned yet.' }}</p>
              </div>

              <button class="btn btn-light btn-small" @click="viewAccount(account)">
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

import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const search = ref('')

const accounts = ref([])
const tenants = ref([])
const transactions = ref([])

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

const normalizedSearch = computed(() => search.value.trim().toLowerCase())

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
      item.status,
      item.provider,
      item.providerReference,
      item.internalReference,
      item.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  })
})

const successfulTransactions = computed(() => {
  return transactions.value.filter((item) => {
    const status = String(item.status || '').toLowerCase()
    return status === 'success' || status === 'successful' || status === 'paid'
  })
})

const totalRevenueFormatted = computed(() => {
  const totalPesewas = successfulTransactions.value.reduce((sum, item) => {
    return sum + Number(item.amountPesewas || 0)
  }, 0)

  return pesewasToCedis(totalPesewas)
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

    accounts.value = Array.isArray(accountsResponse.data) ? accountsResponse.data : []
    tenants.value = Array.isArray(tenantsResponse.data) ? tenantsResponse.data : []
    transactions.value = Array.isArray(transactionsResponse.data) ? transactionsResponse.data : []

    calculateStats()
  } catch (err) {
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
  if (status === 'active') return 'success'
  if (status === 'suspended') return 'danger'
  if (status === 'inactive') return 'muted'
  if (status === 'failed') return 'danger'
  return 'warning'
}

function transactionStatusClass(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'success' || value === 'successful' || value === 'paid') return 'success'
  if (value === 'failed') return 'danger'
  if (value === 'pending') return 'warning'

  return 'muted'
}

function pesewasToCedis(value) {
  return (Number(value || 0) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(epochMillis) {
  if (!epochMillis) return '-'

  return new Date(Number(epochMillis)).toLocaleDateString(undefined, {
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

onMounted(() => {
  fetchDashboard()
})
</script>

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
