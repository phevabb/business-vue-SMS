<template>
  <div class="accounts-page">
    <div class="page-head">
      <div>
        <span class="page-badge">ktor-business.accounts</span>
        <h1 style="color: bisque;">Accounts Management</h1>
        <p>
          View and manage school business accounts, tenant provisioning status,
          email verification, activation, and account access.
        </p>
      </div>

      <div class="page-actions">
        <button class="btn btn-light" @click="fetchAccounts">
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="state-card">
      Loading accounts...
    </div>

    <div v-else-if="error" class="state-card error-card">
      {{ error }}
    </div>

    <template v-else>
      <!-- Stats -->
      <section class="summary-grid">
        <div class="summary-card">
          <span>Total Accounts</span>
          <strong>{{ stats.total }}</strong>
          <small>All registered business accounts</small>
        </div>

        <div class="summary-card">
          <span>Active</span>
          <strong>{{ stats.active }}</strong>
          <small>{{ stats.inactive }} inactive accounts</small>
        </div>

        <div class="summary-card">
          <span>Email Verified</span>
          <strong>{{ stats.verified }}</strong>
          <small>{{ stats.unverified }} pending verification</small>
        </div>

        <div class="summary-card">
          <span>Provisioned</span>
          <strong>{{ stats.provisioned }}</strong>
          <small>{{ stats.failedProvisioning }} provisioning issues</small>
        </div>
      </section>

      <!-- Toolbar -->
      <section class="toolbar">
        <input
          v-model="search"
          class="search-input"
          type="text"
          placeholder="Search school, owner, email, phone, tenant code..."
        />

        <select v-model="statusFilter" class="filter-select">
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
          <option value="verified">Email verified</option>
          <option value="unverified">Email unverified</option>
          <option value="provisioned">Provisioned</option>
          <option value="not_provisioned">Not provisioned</option>
          <option value="failed_provisioning">Provisioning failed</option>
        </select>
      </section>

      <!-- Accounts Table -->
      <section class="card table-card">
        <div class="card-header">
          <div>
            <h2>Accounts</h2>
            <p>{{ filteredAccounts.length }} account(s) shown</p>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Owner</th>
                <th>Contact</th>
                <th>Tenant</th>
                <th>Subscription</th>
                <th>Email</th>
                <th>Account</th>
                <th>Provisioning</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="account in filteredAccounts" :key="account.id">
                <td>
                  <strong>{{ account.schoolName || '-' }}</strong>
                  <small>{{ account.location || 'No location' }}</small>
                  <small>Academic Year: {{ account.academicYear || '-' }}</small>
                </td>

                <td>
                  <strong>{{ account.fullName || '-' }}</strong>
                  <small>{{ account.isStaff ? 'Staff account' : 'Owner account' }}</small>
                </td>

                <td>
                  <span>{{ account.email || '-' }}</span>
                  <small>{{ account.phoneNumber || '-' }}</small>
                </td>

                <td>
                  <strong>{{ account.tenantCode || '-' }}</strong>
                  <small>Schema: {{ account.tenantSchema || '-' }}</small>
                  <small>Slug: {{ account.tenantSlug || '-' }}</small>
                </td>

                <td>
                  <strong>₵{{ pesewasToCedis(account.subscriptionAmountPerTermPesewas) }}</strong>
                  <small>{{ account.estimatedStudents || 0 }} estimated students</small>
                </td>

                <td>
                  <span :class="['status-pill', account.isEmailVerified ? 'success' : 'warning']">
                    {{ account.isEmailVerified ? 'Verified' : 'Pending' }}
                  </span>
                </td>

                <td>
                  <span :class="['status-pill', account.isActive ? 'success' : 'danger']">
                    {{ account.isActive ? 'Active' : 'Inactive' }}
                  </span>
                  <small>{{ account.tenantStatus || '-' }}</small>
                </td>

                <td>
                  <span :class="['status-pill', account.tenantProvisioned ? 'success' : 'warning']">
                    {{ account.tenantProvisioned ? 'Provisioned' : 'Not provisioned' }}
                  </span>

                  <button
                    v-if="account.tenantProvisionError"
                    class="link-button danger-text"
                    @click="showProvisionError(account)"
                  >
                    View error
                  </button>
                </td>

                <td>
                  <div class="actions">
                    <button
                      class="btn btn-small"
                      :class="account.isActive ? 'btn-danger' : 'btn-success'"
                      :disabled="updatingId === account.id"
                      @click="toggleAccount(account)"
                    >
                      {{ account.isActive ? 'Deactivate' : 'Activate' }}
                    </button>

                    <button
                      class="btn btn-light-dark btn-small"
                      @click="viewAccount(account)"
                    >
                      Details
                    </button>

                    <button
                      v-if="account.defaultDomain"
                      class="btn btn-light-dark btn-small"
                      @click="openDomain(account.defaultDomain)"
                    >
                      Open
                    </button>
                  </div>
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
      </section>
    </template>
  </div>
</template>

<script setup>
import {
    getSuperAdminAccounts,
    updateSuperAdminAccountActive,
} from '@/adminBox/services/superadminApi.js'

import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const search = ref('')
const statusFilter = ref('all')
const updatingId = ref(null)

const accounts = ref([])

const stats = reactive({
  total: 0,
  active: 0,
  inactive: 0,
  verified: 0,
  unverified: 0,
  provisioned: 0,
  failedProvisioning: 0,
})

const normalizedSearch = computed(() => search.value.trim().toLowerCase())

const filteredAccounts = computed(() => {
  let list = [...accounts.value]

  if (statusFilter.value === 'active') {
    list = list.filter((item) => item.isActive)
  }

  if (statusFilter.value === 'inactive') {
    list = list.filter((item) => !item.isActive)
  }

  if (statusFilter.value === 'verified') {
    list = list.filter((item) => item.isEmailVerified)
  }

  if (statusFilter.value === 'unverified') {
    list = list.filter((item) => !item.isEmailVerified)
  }

  if (statusFilter.value === 'provisioned') {
    list = list.filter((item) => item.tenantProvisioned)
  }

  if (statusFilter.value === 'not_provisioned') {
    list = list.filter((item) => !item.tenantProvisioned)
  }

  if (statusFilter.value === 'failed_provisioning') {
    list = list.filter((item) => !!item.tenantProvisionError)
  }

  if (!normalizedSearch.value) {
    return list
  }

  return list.filter((item) => {
    return [
      item.schoolName,
      item.fullName,
      item.email,
      item.phoneNumber,
      item.location,
      item.tenantCode,
      item.tenantSchema,
      item.tenantSlug,
      item.defaultDomain,
      item.defaultLocalDomain,
      item.tenantStatus,
      item.academicYear,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  })
})

function calculateStats() {
  stats.total = accounts.value.length
  stats.active = accounts.value.filter((item) => item.isActive).length
  stats.inactive = stats.total - stats.active

  stats.verified = accounts.value.filter((item) => item.isEmailVerified).length
  stats.unverified = stats.total - stats.verified

  stats.provisioned = accounts.value.filter((item) => item.tenantProvisioned).length
  stats.failedProvisioning = accounts.value.filter((item) => !!item.tenantProvisionError).length
}

async function fetchAccounts() {
  loading.value = true
  error.value = ''

  try {
    const response = await getSuperAdminAccounts()

    accounts.value = Array.isArray(response.data) ? response.data : []

    calculateStats()
  } catch (err) {
    error.value =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Failed to load accounts.'
  } finally {
    loading.value = false
  }
}

async function toggleAccount(account) {
  const nextValue = !account.isActive
  const oldValue = account.isActive
  const oldTenantStatus = account.tenantStatus

  updatingId.value = account.id

  try {
    await updateSuperAdminAccountActive(account.id, nextValue)

    account.isActive = nextValue
    account.tenantStatus = nextValue ? 'active' : 'inactive'

    calculateStats()
  } catch (err) {
    account.isActive = oldValue
    account.tenantStatus = oldTenantStatus

    alert(
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Failed to update account.'
    )
  } finally {
    updatingId.value = null
  }
}

function showProvisionError(account) {
  alert(account.tenantProvisionError || 'No provisioning error available.')
}

function viewAccount(account) {
  router.push(`/superadmin/accounts/${account.id}`)
}

function openDomain(domain) {
  if (!domain) return

  const url = domain.startsWith('http') ? domain : `https://${domain}`

  window.open(url, '_blank')
}

function pesewasToCedis(value) {
  return (Number(value || 0) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

onMounted(() => {
  fetchAccounts()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

.accounts-page {
  color: #0f172a;
}

.page-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
  color: #ffffff;
  border-radius: 26px;
  padding: 26px;
  margin-bottom: 20px;
  box-shadow: 0 16px 35px rgba(15, 23, 42, 0.14);
}

.page-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 12px;
}

.page-head h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.page-head p {
  margin: 0;
  color: #dbeafe;
  line-height: 1.6;
  max-width: 760px;
}

.page-actions {
  display: flex;
  gap: 10px;
}

/* State */
.state-card {
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  font-weight: 900;
}

.error-card {
  color: #991b1b;
  background: #fee2e2;
  border-color: #fecaca;
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

.summary-card span {
  display: block;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.summary-card strong {
  display: block;
  font-size: 1.55rem;
  font-weight: 900;
  margin-bottom: 6px;
}

.summary-card small {
  color: #64748b;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 14px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  padding: 16px;
  margin-bottom: 20px;
}

.search-input,
.filter-select {
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 12px 14px;
  outline: none;
  font-weight: 800;
  color: #0f172a;
  background: #ffffff;
}

.search-input {
  flex: 1;
  min-width: 260px;
}

.filter-select {
  min-width: 230px;
}

.search-input:focus,
.filter-select:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
}

/* Card/Table */
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
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 1180px;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 0.76rem;
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
  margin-top: 3px;
}

.empty-cell {
  text-align: center;
  color: #64748b;
  font-weight: 800;
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
  margin-bottom: 5px;
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

/* Buttons */
.btn {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-light {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.btn-light-dark {
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

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.link-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.8rem;
}

.danger-text {
  color: #dc2626;
}

/* Responsive */
@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-head {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .page-actions,
  .btn {
    width: 100%;
  }
}
</style>
