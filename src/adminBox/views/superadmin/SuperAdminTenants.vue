<template>
  <div class="tenants-page">
    <!-- Header -->
    <section class="page-head">
      <div>
        <span class="page-badge">ktor-business → ktor-tenant</span>
        <h1 style="color: bisque;">Tenants Management</h1>
        <p>
          View and manage tenant records, schema names, domains, provisioning
          state, and operational status across all schools.
        </p>
      </div>

      <div class="page-actions">
        <button class="btn btn-light" @click="fetchTenants">
          Refresh
        </button>
      </div>
    </section>

    <!-- Loading / Error -->
    <div v-if="loading" class="state-card">
      Loading tenants...
    </div>

    <div v-else-if="error" class="state-card error-card">
      {{ error }}
    </div>

    <template v-else>
      <!-- Summary Cards -->
      <section class="summary-grid">
        <div class="summary-card">
          <span>Total Tenants</span>
          <strong>{{ stats.total }}</strong>
          <small>All provisioned tenant records</small>
        </div>

        <div class="summary-card">
          <span>Active</span>
          <strong>{{ stats.active }}</strong>
          <small>{{ stats.inactive }} inactive tenants</small>
        </div>

        <div class="summary-card">
          <span>Suspended</span>
          <strong>{{ stats.suspended }}</strong>
          <small>Tenants currently blocked</small>
        </div>

        <div class="summary-card">
          <span>Failed / Provisioning</span>
          <strong>{{ stats.failed + stats.provisioning }}</strong>
          <small>{{ stats.failed }} failed • {{ stats.provisioning }} provisioning</small>
        </div>
      </section>

      <!-- Toolbar -->
      <section class="toolbar">
        <input
          v-model="search"
          class="search-input"
          type="text"
          placeholder="Search school, tenant code, schema, domain, email..."
        />

        <select v-model="statusFilter" class="filter-select">
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
          <option value="suspended">Suspended only</option>
          <option value="provisioning">Provisioning only</option>
          <option value="failed">Failed only</option>
        </select>
      </section>

      <!-- Tenants Table -->
      <section class="card table-card">
        <div class="card-header">
          <div>
            <h2>Tenants</h2>
            <p>{{ filteredTenants.length }} tenant(s) shown</p>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Tenant</th>
                <th>Schema</th>
                <th>Domain</th>
                <th>Contact</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="tenant in filteredTenants" :key="tenant.id || tenant.tenantCode">
                <td>
                  <strong>{{ tenant.schoolName || '-' }}</strong>
                  <small>{{ tenant.schoolType || 'School' }}</small>
                  <small>{{ tenant.location || 'No location' }}</small>
                </td>

                <td>
                  <strong>{{ tenant.tenantCode || '-' }}</strong>
                  <small>Slug: {{ tenant.tenantSlug || '-' }}</small>
                  <small>ID: {{ tenant.id || '-' }}</small>
                </td>

                <td>
                  <strong>{{ tenant.tenantSchema || tenant.schemaName || '-' }}</strong>
                  <small>Internal PostgreSQL schema</small>
                </td>

<td>
  <a
    v-if="tenant.defaultDomain"
    :href="formatUrl(tenant.defaultDomain)"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ tenant.defaultDomain }}
  </a>

  <span v-else>-</span>

  <small v-if="tenant.primaryDomain">
    Custom: {{ tenant.primaryDomain }}
  </small>
  <small v-else>No custom domain</small>
</td>
                <td>
                  <strong>{{ tenant.accountOwnerName || '-' }}</strong>
                  <small>{{ tenant.contactEmail || '-' }}</small>
                </td>

                <td>
                  {{ tenant.academicYear || '-' }}
                  <small>Created: {{ formatCreatedAt(tenant.createdAt) }}</small>
                </td>

                <td>
                  <span :class="['status-pill', tenantStatusClass(tenant.status)]">
                    {{ tenant.status || 'unknown' }}
                  </span>
                </td>

                <td>
                  <select
                    class="status-select"
                    :value="tenant.status || 'provisioning'"
                    :disabled="updatingTenantCode === tenant.tenantCode"
                    @change="changeTenantStatus(tenant, $event.target.value)"
                  >
                    <option value="provisioning">provisioning</option>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="suspended">suspended</option>
                    <option value="failed">failed</option>
                  </select>
                </td>

                <td>
                  <div class="actions">
                    <button
                      class="btn btn-light-dark btn-small"
                      @click="viewTenant(tenant)"
                    >
                      Details
                    </button>

                    <button
                      v-if="tenant.defaultDomain"
                      class="btn btn-light-dark btn-small"
                      @click="openDomain(tenant.defaultDomain)"
                    >
                      Open
                    </button>

                    <button
                      class="btn btn-dark btn-small"
                      @click="copyTenantCode(tenant.tenantCode)"
                    >
                      Copy Code
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredTenants.length === 0">
                <td colspan="9" class="empty-cell">
                  No tenants found.
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
    getSuperAdminTenants,
    updateSuperAdminTenantStatus,
} from '@/adminBox/services/superadminApi.js'

import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const search = ref('')
const statusFilter = ref('all')
const updatingTenantCode = ref(null)

const tenants = ref([])

const stats = reactive({
  total: 0,
  active: 0,
  inactive: 0,
  suspended: 0,
  provisioning: 0,
  failed: 0,
})

const normalizedSearch = computed(() => search.value.trim().toLowerCase())

const filteredTenants = computed(() => {
  let list = [...tenants.value]

  if (statusFilter.value !== 'all') {
    list = list.filter((tenant) => {
      return String(tenant.status || '').toLowerCase() === statusFilter.value
    })
  }

  if (!normalizedSearch.value) {
    return list
  }

  return list.filter((tenant) => {
    return [
      tenant.schoolName,
      tenant.schoolType,
      tenant.tenantCode,
      tenant.tenantSchema,
      tenant.schemaName,
      tenant.tenantSlug,
      tenant.defaultDomain,
      tenant.primaryDomain,
      tenant.location,
      tenant.contactEmail,
      tenant.accountOwnerName,
      tenant.academicYear,
      tenant.status,
      tenant.createdAt,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  })
})

function calculateStats() {
  stats.total = tenants.value.length

  stats.active = tenants.value.filter((tenant) => tenant.status === 'active').length
  stats.inactive = tenants.value.filter((tenant) => tenant.status === 'inactive').length
  stats.suspended = tenants.value.filter((tenant) => tenant.status === 'suspended').length
  stats.provisioning = tenants.value.filter((tenant) => tenant.status === 'provisioning').length
  stats.failed = tenants.value.filter((tenant) => tenant.status === 'failed').length
}

async function fetchTenants() {
  loading.value = true
  error.value = ''

  try {
    const response = await getSuperAdminTenants()
    console.log('Fetched tenants:print', response.data)

    tenants.value = Array.isArray(response.data) ? response.data : []

    calculateStats()
  } catch (err) {
    console.error('Error fetching tenants:print', err)
    error.value =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Failed to load tenants.'
  } finally {
    loading.value = false
  }
}

async function changeTenantStatus(tenant, status) {
  const tenantCode = tenant.tenantCode
  const oldStatus = tenant.status

  if (!tenantCode) {
    alert('Tenant code is missing.')
    return
  }

  updatingTenantCode.value = tenantCode

  try {
    await updateSuperAdminTenantStatus(tenantCode, status)

    tenant.status = status
    calculateStats()
  } catch (err) {
    tenant.status = oldStatus

    alert(
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Failed to update tenant status.'
    )
  } finally {
    updatingTenantCode.value = null
  }
}

function tenantStatusClass(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'active') return 'success'
  if (value === 'inactive') return 'muted'
  if (value === 'suspended') return 'danger'
  if (value === 'failed') return 'danger'
  if (value === 'provisioning') return 'warning'

  return 'muted'
}

function formatUrl(domain) {
  if (!domain) return '#'

  return domain.startsWith('http') ? domain : `https://${domain}`
}

function openDomain(domain) {
  if (!domain) return

  window.open(formatUrl(domain), '_blank')
}

async function copyTenantCode(tenantCode) {
  if (!tenantCode) return

  try {
    await navigator.clipboard.writeText(tenantCode)
    alert('Tenant code copied successfully.')
  } catch (err) {
    alert('Unable to copy tenant code.')
  }
}

function viewTenant(tenant) {
  if (!tenant.tenantCode) return

  router.push(`/superadmin/tenants/${tenant.tenantCode}`)
}

function formatCreatedAt(value) {
  if (!value) return '-'

  const numericValue = Number(value)

  if (!Number.isNaN(numericValue)) {
    return new Date(numericValue).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return value
}

onMounted(() => {
  fetchTenants()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

.tenants-page {
  color: #0f172a;
}

/* Header */
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
  max-width: 780px;
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
.filter-select,
.status-select {
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

.status-select {
  width: 160px;
  padding: 9px 10px;
  font-size: 0.85rem;
}

.search-input:focus,
.filter-select:focus,
.status-select:focus {
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

td a {
  color: #1d4ed8;
  font-weight: 900;
  text-decoration: none;
}

td a:hover {
  text-decoration: underline;
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

.btn-dark {
  background: #0f172a;
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
