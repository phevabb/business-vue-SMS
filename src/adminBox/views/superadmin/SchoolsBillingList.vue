<template>
  <div class="billing-page">
    <!-- Premium Hero -->
    <section class="billing-hero">
      <div class="hero-content">
        <div class="hero-eyebrow">SuperAdmin Billing</div>

        <h1 style="color: bisque;" class="hero-title">
          Manual Billing Center
        </h1>

        <p class="hero-subtitle">
          Select a school, review its billing profile, view invoice history, and generate manual invoices for the current term.
        </p>
      </div>

      <div class="hero-actions">
        <Button
  label="Refresh"
  icon="pi pi-refresh"
  class="premium-light-button"
  :loading="loading"
  @click="refreshSchools"
/>

        <Button
          label="Export Report"
          icon="pi pi-download"
          class="premium-primary-button"
          @click="exportReport"
        />
      </div>
    </section>

    <div v-if="errorMessage" class="billing-error">
  <i class="pi pi-exclamation-triangle"></i>
  <span>{{ errorMessage }}</span>
</div>

    <!-- Metric Cards -->
    <section class="metrics-grid">
      <div class="metric-card metric-blue">
        <div class="metric-icon">
          <i class="pi pi-building"></i>
        </div>

        <div>
          <p>Total Schools</p>
          <h3>{{ summary.totalSchools }}</h3>
          <span>Registered tenants</span>
        </div>
      </div>

      <div class="metric-card metric-green">
        <div class="metric-icon">
          <i class="pi pi-check-circle"></i>
        </div>

        <div>
          <p>Active Schools</p>
          <h3>{{ activeSchoolsCount }}</h3>
          <span>Currently billable</span>
        </div>
      </div>

      <div class="metric-card metric-purple">
        <div class="metric-icon">
          <i class="pi pi-users"></i>
        </div>

        <div>
          <p>Total Students</p>
          <h3>{{ totalStudents.toLocaleString() }}</h3>
          <span>Across all schools</span>
        </div>
      </div>

      <div class="metric-card metric-orange">
        <div class="metric-icon">
          <i class="pi pi-wallet"></i>
        </div>

        <div>
          <p>Estimated Billing</p>
          <h3>GH₵{{ formatMoney(estimatedBilling) }}</h3>
          <span>Current term estimate</span>
        </div>
      </div>
    </section>

    <!-- Main Schools Card -->
    <section class="schools-card">
      <div class="schools-card-header">
        <div>
          <h2>Schools</h2>
          <p>All tenant schools available for manual billing.</p>
        </div>

        <Tag
          :value="`${filteredSchools.length} shown`"
          severity="info"
          rounded
          class="premium-count-tag"
        />
      </div>

      <!-- Filters -->
      <div class="filters-row">
        <div class="search-wrapper">
          <i class="pi pi-search"></i>

          <InputText
            v-model="searchQuery"
            placeholder="Search school name, tenant code, or region..."
            class="premium-search"
          />
        </div>

        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Statuses"
          showClear
          class="premium-dropdown"
        />

        <Dropdown
          v-model="selectedRegion"
          :options="regionOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Regions"
          showClear
          class="premium-dropdown"
        />
      </div>

      <!-- PrimeVue DataTable -->
      <DataTable
  :value="filteredSchools"
  :loading="loading"
        dataKey="tenantCode"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20]"
        responsiveLayout="scroll"
        class="premium-table"
        emptyMessage="No schools found"
      >
        <Column header="School">
          <template #body="{ data }">
            <div class="school-cell">
              <div class="school-avatar">
                {{ getSchoolInitials(data.schoolName) }}
              </div>

              <div>
                <div class="school-name">{{ data.schoolName }}</div>
                <div class="school-region">{{ data.region }}</div>
              </div>
            </div>
          </template>
        </Column>

        <Column header="Tenant Code">
          <template #body="{ data }">
            <span class="tenant-code">
              {{ data.tenantCode }}
            </span>
          </template>
        </Column>

        <Column header="Students">
          <template #body="{ data }">
            <div class="student-count">
              {{ data.studentCount.toLocaleString() }}
            </div>
            <small class="muted-text">students</small>
          </template>
        </Column>

        <Column header="Current Term">
          <template #body="{ data }">
            <span class="term-pill">
              {{ data.currentTerm }}
            </span>
          </template>
        </Column>

        <Column header="Last Billing">
          <template #body="{ data }">
            <div v-if="data.lastBillingDate">
              <div class="last-billing-date">
                {{ formatDate(data.lastBillingDate) }}
              </div>
              <small class="muted-text">Last invoice generated</small>
            </div>

            <div v-else>
              <div class="not-billed">Not billed</div>
              <small class="muted-text">No invoice yet</small>
            </div>
          </template>
        </Column>

        <Column header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
              rounded
              class="status-tag"
            />
          </template>
        </Column>

        <Column header="Action">
          <template #body="{ data }">
            <div class="action-cell">
              <Button
                label="View Billing"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="view-billing-button"
                @click="viewBilling(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>


    </section>
  </div>
</template>






<script setup>
import getBillingDashboard from '@/adminBox/services/superadminApi.js'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const searchQuery = ref('')
const selectedStatus = ref(null)
const selectedRegion = ref(null)

const loading = ref(false)
const errorMessage = ref('')

const summary = ref({
  totalSchools: 0,
  activeSchools: 0,
  totalStudents: 0,
  billingRatePerStudent: 0,
  estimatedBilling: 0,
  currentAcademicYear: '',
  currentTerm: '',
})

const schools = ref([])



const fetchBillingDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getBillingDashboard()

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Unable to load billing dashboard')
    }

    const data = await response.json()

    summary.value = {
      totalSchools: data.summary?.totalSchools ?? 0,
      activeSchools: data.summary?.activeSchools ?? 0,
      totalStudents: data.summary?.totalStudents ?? 0,
      billingRatePerStudent: data.summary?.billingRatePerStudent ?? 0,
      estimatedBilling: data.summary?.estimatedBilling ?? 0,
      currentAcademicYear: data.summary?.currentAcademicYear ?? '',
      currentTerm: data.summary?.currentTerm ?? '',
    }

    schools.value = Array.isArray(data.schools) ? data.schools : []
  } catch (error) {
    console.error('Billing dashboard error:', error)
    errorMessage.value = error.message || 'Unable to load billing dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBillingDashboard()
})

const statusOptions = [
  {
    label: 'Active',

    value: 'ACTIVE',
  },
  {
    label: 'Suspended',
    value: 'SUSPENDED',
  },
  {
    label: 'Inactive',
    value: 'INACTIVE',
  },
]

const regionOptions = computed(() => {
  return [
    ...new Set(
      schools.value
        .map((school) => school.region)
        .filter(Boolean)
    ),
  ].map((region) => ({
    label: region,
    value: region,
  }))
})

const activeSchoolsCount = computed(() => {
  return summary.value.activeSchools
})

const totalStudents = computed(() => {
  return summary.value.totalStudents
})

const estimatedBilling = computed(() => {
  return summary.value.estimatedBilling
})

const billingRatePerStudent = computed(() => {
  return summary.value.billingRatePerStudent
})

const filteredSchools = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return schools.value.filter((school) => {
    const schoolName = school.schoolName || ''
    const tenantCode = school.tenantCode || ''
    const region = school.region || ''

    const matchesSearch =
      !query ||
      schoolName.toLowerCase().includes(query) ||
      tenantCode.toLowerCase().includes(query) ||
      region.toLowerCase().includes(query)

    const matchesStatus =
      !selectedStatus.value || school.status === selectedStatus.value

    const matchesRegion =
      !selectedRegion.value || region === selectedRegion.value

    return matchesSearch && matchesStatus && matchesRegion
  })
})

const getSchoolInitials = (schoolName) => {
  return (schoolName || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'SUSPENDED':
      return 'warning'
    case 'INACTIVE':
      return 'secondary'
    default:
      return 'info'
  }
}

const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A'

  return new Date(dateValue).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatMoney = (amount) => {
  return Number(amount || 0).toLocaleString('en-GH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

const refreshSchools = () => {
  fetchBillingDashboard()
}

const exportReport = () => {

}

const viewBilling = (school) => {
  router.push({
    name: 'TenantBillingDetails',
    params: {
      tenantCode: school.tenantCode,
    },
  })
}
</script>







<style scoped>
.billing-page {
  padding-bottom: 2rem;
  animation: pageFadeIn 0.45s ease both;
}

/* =========================
   HERO SECTION
========================= */
.billing-hero {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  padding: 34px;
  margin-bottom: 28px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.45), transparent 32%),
    radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.32), transparent 35%),
    linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e293b 100%);
  box-shadow:
    0 32px 75px rgba(15, 23, 42, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  animation: heroSlideUp 0.6s ease both;
}

.billing-hero::before {
  content: "";
  position: absolute;
  width: 380px;
  height: 380px;
  top: -180px;
  right: -120px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
}

.billing-hero::after {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 31px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  pointer-events: none;
}

.hero-content,
.hero-actions {
  position: relative;
  z-index: 2;
}

.hero-eyebrow {
  margin-bottom: 10px;
  color: #93c5fd;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0 0 10px;
  font-size: 2.25rem;
  font-weight: 950;
  letter-spacing: -0.045em;
}

.hero-subtitle {
  max-width: 780px;
  margin: 0;
  color: #cbd5e1;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* =========================
   PRIMEVUE BUTTONS
========================= */
:deep(.premium-primary-button),
:deep(.premium-light-button) {
  border-radius: 999px;
  padding: 0.85rem 1.15rem;
  font-weight: 900;
  border: 0;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

:deep(.premium-primary-button) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 16px 35px rgba(37, 99, 235, 0.38);
}

:deep(.premium-primary-button:hover) {
  transform: translateY(-3px);
  box-shadow: 0 22px 45px rgba(37, 99, 235, 0.48);
}

:deep(.premium-light-button) {
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
  box-shadow: 0 14px 30px rgba(255, 255, 255, 0.13);
}

:deep(.premium-light-button:hover) {
  transform: translateY(-3px);
  background: #ffffff;
}

/* =========================
   METRICS
========================= */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.metric-card {
  position: relative;
  overflow: hidden;
  min-height: 138px;
  padding: 22px;
  border-radius: 28px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow:
    0 20px 52px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  animation: cardRise 0.55s ease both;
}

.metric-card:nth-child(1) {
  animation-delay: 0.05s;
}

.metric-card:nth-child(2) {
  animation-delay: 0.1s;
}

.metric-card:nth-child(3) {
  animation-delay: 0.15s;
}

.metric-card:nth-child(4) {
  animation-delay: 0.2s;
}

.metric-card::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.metric-blue::before {
  background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.15), transparent 40%);
}

.metric-green::before {
  background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.15), transparent 40%);
}

.billing-error {
  margin-bottom: 18px;
  padding: 14px 18px;
  border-radius: 18px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}



.metric-purple::before {
  background: radial-gradient(circle at top right, rgba(126, 34, 206, 0.15), transparent 40%);
}

.metric-orange::before {
  background: radial-gradient(circle at top right, rgba(249, 115, 22, 0.15), transparent 40%);
}

.metric-card:hover {
  transform: translateY(-7px);
  border-color: rgba(37, 99, 235, 0.18);
  box-shadow:
    0 30px 70px rgba(15, 23, 42, 0.13),
    0 8px 18px rgba(37, 99, 235, 0.06);
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card > * {
  position: relative;
  z-index: 2;
}

.metric-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.15rem;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
}

.metric-blue .metric-icon {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
}

.metric-green .metric-icon {
  background: linear-gradient(135deg, #16a34a, #4ade80);
}

.metric-purple .metric-icon {
  background: linear-gradient(135deg, #7c3aed, #c084fc);
}

.metric-orange .metric-icon {
  background: linear-gradient(135deg, #f97316, #fdba74);
}

.metric-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.metric-card h3 {
  margin: 8px 0 2px;
  color: #0f172a;
  font-size: 1.85rem;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.metric-card span {
  color: #64748b;
  font-size: 0.87rem;
  font-weight: 700;
}

/* =========================
   MAIN SCHOOLS CARD
========================= */
.schools-card {
  overflow: hidden;
  border-radius: 32px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  animation: cardRise 0.6s ease both;
}

.schools-card-header {
  padding: 26px 28px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.06), transparent 30%),
    #ffffff;
}

.schools-card-header h2 {
  margin: 0 0 5px;
  color: #0f172a;
  font-size: 1.3rem;
  font-weight: 950;
  letter-spacing: -0.03em;
}

.schools-card-header p {
  margin: 0;
  color: #64748b;
}

:deep(.premium-count-tag) {
  padding: 0.55rem 0.8rem;
  font-weight: 900;
}

/* =========================
   FILTERS
========================= */
.filters-row {
  padding: 24px 28px 10px;
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 230px 230px;
  gap: 14px;
  align-items: center;
}

.search-wrapper {
  position: relative;
}

.search-wrapper i {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #64748b;
}

:deep(.premium-search) {
  width: 100%;
  min-height: 47px;
  padding-left: 42px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

:deep(.premium-dropdown) {
  width: 100%;
}

:deep(.premium-dropdown .p-dropdown) {
  width: 100%;
}

:deep(.premium-dropdown),
:deep(.premium-dropdown .p-dropdown),
:deep(.p-dropdown) {
  border-radius: 999px;
}

:deep(.premium-dropdown) {
  min-height: 47px;
  border-color: #e2e8f0;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);
}

:deep(.premium-search:focus),
:deep(.premium-dropdown:not(.p-disabled).p-focus) {
  border-color: #2563eb;
  box-shadow:
    0 0 0 4px rgba(37, 99, 235, 0.12),
    0 12px 30px rgba(15, 23, 42, 0.06);
  transform: translateY(-1px);
}

/* =========================
   DATATABLE PREMIUM STYLES
========================= */
:deep(.premium-table) {
  padding: 10px 28px 28px;
}

:deep(.premium-table .p-datatable-wrapper) {
  border: 1px solid #eef2f7;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.04);
}

:deep(.premium-table .p-datatable-thead > tr > th) {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  padding: 18px;
  border-color: #e2e8f0;
  font-size: 0.74rem;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

:deep(.premium-table .p-datatable-tbody > tr) {
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.premium-table .p-datatable-tbody > tr > td) {
  padding: 20px 18px;
  border-color: #f1f5f9;
  vertical-align: middle;
}

:deep(.premium-table .p-datatable-tbody > tr:hover) {
  background: #f8fbff;
  box-shadow: inset 4px 0 0 #2563eb;
}

:deep(.premium-table .p-paginator) {
  border: 0;
  padding: 18px 0 0;
}

:deep(.premium-table .p-paginator .p-paginator-page),
:deep(.premium-table .p-paginator .p-paginator-next),
:deep(.premium-table .p-paginator .p-paginator-prev),
:deep(.premium-table .p-paginator .p-paginator-first),
:deep(.premium-table .p-paginator .p-paginator-last) {
  border-radius: 999px;
}

/* =========================
   TABLE CONTENT
========================= */
.school-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.school-avatar {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 950;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.28), transparent 33%),
    linear-gradient(135deg, #2563eb, #7c3aed);
  box-shadow:
    0 14px 30px rgba(37, 99, 235, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.26);
}

.school-name {
  color: #0f172a;
  font-weight: 950;
  letter-spacing: -0.02em;
}

.school-region {
  margin-top: 3px;
  color: #64748b;
  font-size: 0.85rem;
}

.tenant-code {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.82rem;
  font-weight: 950;
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.1);
}

.student-count {
  color: #0f172a;
  font-weight: 950;
}

.muted-text {
  color: #64748b;
}

.term-pill {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.82rem;
  font-weight: 850;
  white-space: nowrap;
}

.last-billing-date {
  color: #0f172a;
  font-weight: 900;
}

.not-billed {
  color: #d97706;
  font-weight: 950;
}

:deep(.status-tag) {
  padding: 0.45rem 0.75rem;
  font-weight: 950;
  letter-spacing: 0.03em;
}

.action-cell {
  display: flex;
  justify-content: flex-end;
}

:deep(.view-billing-button) {
  border: 0;
  border-radius: 999px;
  padding: 0.72rem 1rem;
  font-weight: 950;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 13px 28px rgba(37, 99, 235, 0.26);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.view-billing-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.34);
}

/* =========================
   ANIMATIONS
========================= */
@keyframes pageFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes heroSlideUp {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cardRise {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filters-row {
    grid-template-columns: 1fr 1fr;
  }

  .search-wrapper {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .billing-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions {
    width: 100%;
  }

  :deep(.premium-primary-button),
  :deep(.premium-light-button) {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 700px) {
  .billing-hero {
    padding: 24px;
    border-radius: 24px;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .schools-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filters-row {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  :deep(.premium-table) {
    padding: 10px 20px 20px;
  }
}
</style>
