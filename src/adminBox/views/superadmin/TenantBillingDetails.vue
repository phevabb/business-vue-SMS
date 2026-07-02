<template>
  <div class="tenant-billing-page">

    <!-- Premium Hero -->
    <section class="billing-hero">
      <div class="hero-left">
        <button class="back-chip" type="button" @click="goBack">
          <i class="pi pi-arrow-left"></i>
          Back to Schools
        </button>

        <div class="hero-eyebrow">Tenant Billing Profile</div>

        <h1 style="color: bisque;" class="hero-title">
          {{ schoolInformation.schoolName }}
        </h1>

        <p class="hero-subtitle">
          Review current term billing, invoice history, student count, and generate manual invoices.
        </p>

        <div class="hero-meta">
          <span class="tenant-pill">
            <i class="pi pi-building"></i>
            {{ schoolInformation.tenantCode }}
          </span>

          <Tag
            :value="schoolInformation.status"
            :severity="getSchoolStatusSeverity(schoolInformation.status)"
            rounded
            class="hero-status"
          />

          <span class="term-pill-dark">
            <i class="pi pi-calendar"></i>
            {{ schoolInformation.currentTerm }}
          </span>
        </div>
      </div>

      <div class="hero-right">
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          class="premium-light-button"
          :loading="refreshing"
          @click="refreshSchoolInformation"
        />

        <Button
          label="Generate Invoice"
          icon="pi pi-bolt"
          class="premium-primary-button"
          @click="openGenerateInvoiceDialog"
        />
      </div>
    </section>

    <div v-if="errorMessage" class="billing-error">
  <i class="pi pi-exclamation-triangle"></i>
  <span>{{ errorMessage }}</span>
</div>

    <!-- KPI Cards -->
    <section class="kpi-grid">
      <div class="kpi-card kpi-blue">
        <div class="kpi-icon">
          <i class="pi pi-users"></i>
        </div>

        <div class="kpi-content">
          <p>Total Students</p>
          <h3>{{ schoolInformation.studentCount.toLocaleString() }}</h3>
          <span>Current billable students</span>
        </div>
      </div>

      <div class="kpi-card kpi-green">
        <div class="kpi-icon">
          <i class="pi pi-wallet"></i>
        </div>

        <div class="kpi-content">
          <p>Estimated Bill</p>
          <h3>GH₵{{ formatMoney(estimatedCurrentBill) }}</h3>
          <span>For current term</span>
        </div>
      </div>

      <div class="kpi-card kpi-purple">
        <div class="kpi-icon">
          <i class="pi pi-file"></i>
        </div>

        <div class="kpi-content">
          <p>Total Invoices</p>
          <h3>{{ billingHistory.length }}</h3>
          <span>Generated invoices</span>
        </div>
      </div>

      <div class="kpi-card kpi-orange">
        <div class="kpi-icon">
          <i class="pi pi-exclamation-circle"></i>
        </div>

        <div class="kpi-content">
          <p>Outstanding</p>
          <h3>GH₵{{ formatMoney(outstandingAmount) }}</h3>
          <span>Pending or overdue</span>
        </div>
      </div>
    </section>

    <!-- Billing Summary Strip -->
    <section class="summary-strip">
      <div class="summary-item">
        <span>Billing Rate</span>
        <strong>GH₵{{ schoolInformation.billingRatePerStudent }} / student</strong>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-item">
        <span>Last Invoice</span>
        <strong>{{ latestInvoiceDate }}</strong>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-item">
        <span>Paid Invoices</span>
        <strong>{{ paidInvoicesCount }}</strong>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-item">
        <span>Pending/Overdue</span>
        <strong>{{ unpaidInvoicesCount }}</strong>
      </div>
    </section>

    <!-- Main Grid -->
   <!-- Main Grid -->
<section class="billing-content-grid">
  <div class="main-column">
    <SchoolInformation
      :school="schoolInformation"
      @refresh="refreshSchoolInformation"
      @generate-invoice="openGenerateInvoiceDialog"
    />
  </div>

  <!-- Right Premium Panel -->
  <aside class="side-panel">
    <div class="side-card">
      <div class="side-card-header">
        <div>
          <h3>Billing Health</h3>
          <p>Generated test insight</p>
        </div>

        <div class="pulse-dot"></div>
      </div>

      <div class="health-score">
        <div class="score-ring">
          <span>{{ billingHealthScore }}%</span>
        </div>

        <div>
          <h4>{{ billingHealthLabel }}</h4>
          <p>
            Based on invoice status, pending balance, and recent billing activity.
          </p>
        </div>
      </div>

      <div class="mini-list">
        <div class="mini-list-item">
          <span>Paid</span>
          <strong class="text-success">{{ paidInvoicesCount }}</strong>
        </div>

        <div class="mini-list-item">
          <span>Pending</span>
          <strong class="text-warning">{{ pendingInvoicesCount }}</strong>
        </div>

        <div class="mini-list-item">
          <span>Overdue</span>
          <strong class="text-danger">{{ overdueInvoicesCount }}</strong>
        </div>
      </div>
    </div>

    <div class="side-card gradient-side-card">
      <h3>Quick Action</h3>
      <p>
        Generate a manual invoice for the active term using the backend-calculated student count.
      </p>

      <Button
        label="Generate Manual Invoice"
        icon="pi pi-send"
        class="side-action-button"
        @click="openGenerateInvoiceDialog"
      />
    </div>
  </aside>
</section>

<!-- Full Width Billing History -->
<section class="full-width-section">
  <BillingHistory
    :invoices="billingHistory"
    @view-invoice="viewInvoice"
  />
</section>

    <!-- Generate Invoice Dialog -->
    <Dialog
      v-model:visible="generateDialogVisible"
      modal
      :draggable="false"
      class="premium-dialog"
      header="Generate Manual Invoice"
      :style="{ width: '460px' }"
    >
      <div class="dialog-content">
        <div class="dialog-icon">
          <i class="pi pi-bolt"></i>
        </div>

        <h3>Generate invoice for current term?</h3>

        <p>
          This will create a new invoice for
          <strong>{{ schoolInformation.schoolName }}</strong>
          using tenant code
          <strong>{{ schoolInformation.tenantCode }}</strong>.
        </p>

        <div class="dialog-summary">
          <div>
            <span>Students</span>
            <strong>{{ schoolInformation.studentCount }}</strong>
          </div>

          <div>
            <span>Rate</span>
            <strong>GH₵{{ schoolInformation.billingRatePerStudent }}</strong>
          </div>

          <div>
            <span>Amount</span>
            <strong>GH₵{{ formatMoney(estimatedCurrentBill) }}</strong>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="dialog-cancel-button"
          @click="generateDialogVisible = false"
        />

        <Button
          label="Generate Invoice"
          icon="pi pi-check"
          class="dialog-generate-button"
          :loading="generating"
          @click="generateManualInvoice(schoolInformation.tenantCode)"
        />
      </template>
    </Dialog>

    <!-- Invoice View Dialog -->
    <Dialog
      v-model:visible="invoiceDialogVisible"
      modal
      :draggable="false"
      class="premium-dialog"
      header="Invoice Details"
      :style="{ width: '520px' }"
    >
      <div v-if="selectedInvoice" class="invoice-dialog-card">
        <div class="invoice-dialog-top">
          <div>
            <span>Invoice Number</span>
            <h3>{{ selectedInvoice.invoiceNumber }}</h3>
          </div>

          <Tag
            :value="selectedInvoice.status"
            :severity="getInvoiceStatusSeverity(selectedInvoice.status)"
            rounded
          />
        </div>

        <div class="invoice-dialog-grid">
          <div>
            <span>Term</span>
            <strong>{{ selectedInvoice.term }}</strong>
          </div>

          <div>
            <span>Students</span>
            <strong>{{ selectedInvoice.studentCount }}</strong>
          </div>

          <div>
            <span>Amount</span>
            <strong>GH₵{{ formatMoney(selectedInvoice.amount) }}</strong>
          </div>

          <div>
            <span>Issued Date</span>
            <strong>{{ formatDate(selectedInvoice.issuedDate) }}</strong>
          </div>

          <div>
            <span>Due Date</span>
            <strong>{{ formatDate(selectedInvoice.dueDate) }}</strong>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          class="dialog-cancel-button"
          @click="invoiceDialogVisible = false"
        />
      </template>
    </Dialog>
  </div>
</template>









<script setup>
import BillingHistory from '@/adminBox/views/superadmin/BillingHistory.vue'
import SchoolInformation from '@/adminBox/views/superadmin/SchoolInformation.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const refreshing = ref(false)
const loading = ref(false)
const generating = ref(false)
const generateDialogVisible = ref(false)
const invoiceDialogVisible = ref(false)
const selectedInvoice = ref(null)
const errorMessage = ref('')

const API_BASE_URL =
  import.meta.env.VITE_PUBLIC_API_BASE_URL || 'http://127.0.0.1:9000'

const routeTenantCode = computed(() => {
  return String(route.params.tenantCode || '').trim()
})

const schoolInformation = ref({
  tenantId: null,
  schoolName: '',
  tenantCode: routeTenantCode.value,
  region: '',
  currentTerm: '',
  studentCount: 0,
  billingRatePerStudent: 0,
  status: '',
  lastBillingDate: null,
  estimatedAmount: 0,
})

const billingHistory = ref([])

const normalizeInvoice = (invoice) => {
  const invoiceId = invoice.invoiceId || invoice.id

  const academicYearName = invoice.academicYearName || ''
  const termName = invoice.termName || invoice.term || ''
  const term = academicYearName
    ? `${academicYearName} - ${termName}`
    : termName

  const amount = Number(
    invoice.totalAmountCedis ??
      invoice.amount ??
      0
  )

  const status = String(
    invoice.paymentStatus ||
      invoice.status ||
      'pending'
  ).toUpperCase()

  return {
    id: invoiceId,
    invoiceId,
    invoiceNumber: `INV-${String(invoiceId).padStart(6, '0')}`,
    term,
    studentCount: Number(invoice.studentCount || 0),
    amount,
    status,
    issuedDate: invoice.createdAtEpochMillis
      ? new Date(invoice.createdAtEpochMillis).toISOString()
      : invoice.issuedDate,
    dueDate: invoice.dueDateEpochMillis
      ? new Date(invoice.dueDateEpochMillis).toISOString()
      : invoice.dueDate,
    raw: invoice,
  }
}

const fetchTenantBillingProfile = async () => {
  if (!routeTenantCode.value) {
    errorMessage.value = 'Missing tenant code from route.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/billing/tenant/${encodeURIComponent(routeTenantCode.value)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

          /**
           * If your route requires JWT, uncomment and adjust token key.
           */
          // Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Unable to load tenant billing profile')
    }

    const data = await response.json()
    const school = data.school
    const summary = data.summary

    schoolInformation.value = {
      tenantId: school.tenantId,
      schoolName: school.schoolName,
      tenantCode: school.tenantCode,
      region: school.region,
      currentTerm: school.currentTerm,
      studentCount: Number(school.studentCount || 0),
      billingRatePerStudent: Number(summary?.billingRatePerStudent || 0),
      status: school.status,
      lastBillingDate: school.lastBillingDate,
      estimatedAmount: Number(school.estimatedAmount || 0),
    }
  } catch (error) {
    console.error('Tenant billing profile error:', error)
    errorMessage.value = error.message || 'Unable to load tenant billing profile'
  } finally {
    loading.value = false
  }
}

const fetchBillingHistory = async () => {
  if (!routeTenantCode.value) return

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/billing/tenant/${encodeURIComponent(routeTenantCode.value)}/invoices`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

          /**
           * If your route requires JWT, uncomment and adjust token key.
           */
          // Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Unable to load invoice history')
    }

    const data = await response.json()

    billingHistory.value = Array.isArray(data)
      ? data.map(normalizeInvoice)
      : []
  } catch (error) {
    console.error('Billing history error:', error)
    billingHistory.value = []
  }
}

const loadPageData = async () => {
  refreshing.value = true

  await fetchTenantBillingProfile()
  await fetchBillingHistory()

  refreshing.value = false
}

onMounted(() => {
  loadPageData()
})

const estimatedCurrentBill = computed(() => {
  return (
    Number(schoolInformation.value.studentCount || 0) *
    Number(schoolInformation.value.billingRatePerStudent || 0)
  )
})

const paidInvoicesCount = computed(() => {
  return billingHistory.value.filter((invoice) => invoice.status === 'PAID').length
})

const pendingInvoicesCount = computed(() => {
  return billingHistory.value.filter((invoice) => invoice.status === 'PENDING').length
})

const overdueInvoicesCount = computed(() => {
  return billingHistory.value.filter((invoice) => invoice.status === 'OVERDUE').length
})

const unpaidInvoicesCount = computed(() => {
  return billingHistory.value.filter((invoice) =>
    ['PENDING', 'OVERDUE'].includes(invoice.status)
  ).length
})

const outstandingAmount = computed(() => {
  return billingHistory.value
    .filter((invoice) => ['PENDING', 'OVERDUE'].includes(invoice.status))
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0)
})

const latestInvoiceDate = computed(() => {
  if (!billingHistory.value.length) return 'No invoice yet'

  const latest = [...billingHistory.value].sort(
    (a, b) => new Date(b.issuedDate) - new Date(a.issuedDate)
  )[0]

  return formatDate(latest.issuedDate)
})

const billingHealthScore = computed(() => {
  const total = billingHistory.value.length
  if (!total) return 0

  const paidScore = paidInvoicesCount.value * 100
  const pendingScore = pendingInvoicesCount.value * 65
  const overdueScore = overdueInvoicesCount.value * 25

  return Math.round((paidScore + pendingScore + overdueScore) / total)
})

const billingHealthLabel = computed(() => {
  if (billingHealthScore.value >= 80) return 'Excellent'
  if (billingHealthScore.value >= 60) return 'Good'
  if (billingHealthScore.value >= 40) return 'Needs Attention'
  return 'Critical'
})

const refreshSchoolInformation = async () => {
  await loadPageData()
}

const openGenerateInvoiceDialog = () => {
  generateDialogVisible.value = true
}

const generateManualInvoice = async (tenantCode) => {
  generating.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/billing/manual-invoice`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          /**
           * If your route requires JWT, uncomment and adjust token key.
           */
          // Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
        body: JSON.stringify({
          tenantCode,
          studentCount: schoolInformation.value.studentCount,
        }),
      }
    )

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Unable to generate manual invoice')
    }

    generateDialogVisible.value = false

    /**
     * Reload profile and invoices after successful invoice creation.
     */
    await loadPageData()
  } catch (error) {
    console.error('Generate manual invoice error:', error)
    errorMessage.value = error.message || 'Unable to generate manual invoice'
  } finally {
    generating.value = false
  }
}

const viewInvoice = (invoice) => {
  selectedInvoice.value = invoice
  invoiceDialogVisible.value = true
}

const goBack = () => {
  router.push({
    name: 'TenantBillingList',
  })
}

const getSchoolStatusSeverity = (status) => {
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

const getInvoiceStatusSeverity = (status) => {
  switch (status) {
    case 'PAID':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'OVERDUE':
      return 'danger'
    case 'CANCELLED':
      return 'secondary'
    case 'FREE_TRIAL':
      return 'info'
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
</script>





<style scoped>
.tenant-billing-page {
  animation: pageFadeIn 0.45s ease both;
}

/* HERO */
.billing-hero {
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  padding: 34px;
  margin-bottom: 28px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 28px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.45), transparent 32%),
    radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.32), transparent 35%),
    linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e293b 100%);
  box-shadow:
    0 34px 80px rgba(15, 23, 42, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.13);
  animation: heroSlideUp 0.6s ease both;
}

.billing-hero::before {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  top: -220px;
  right: -130px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
}

.billing-hero::after {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 33px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  pointer-events: none;
}

.hero-left,
.hero-right {
  position: relative;
  z-index: 2;
}

.back-chip {
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  margin-bottom: 18px;
  background: rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.back-chip:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.18);
}

.hero-eyebrow {
  margin-bottom: 10px;
  color: #93c5fd;
  font-size: 0.74rem;
  font-weight: 950;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0 0 10px;
  font-size: 2.35rem;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.hero-subtitle {
  max-width: 760px;
  margin: 0;
  color: #cbd5e1;
  line-height: 1.75;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.tenant-pill,
.term-pill-dark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 9px 13px;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.11);
  font-weight: 900;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

:deep(.hero-status) {
  padding: 0.55rem 0.8rem;
  font-weight: 950;
}

.hero-right {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* PRIME BUTTONS */
:deep(.premium-primary-button),
:deep(.premium-light-button) {
  border-radius: 999px;
  padding: 0.85rem 1.15rem;
  font-weight: 950;
  border: 0;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

:deep(.premium-primary-button) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 16px 35px rgba(37, 99, 235, 0.4);
}

:deep(.premium-primary-button:hover) {
  transform: translateY(-3px);
  box-shadow: 0 22px 45px rgba(37, 99, 235, 0.5);
}

:deep(.premium-light-button) {
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
  box-shadow: 0 14px 30px rgba(255, 255, 255, 0.14);
}

:deep(.premium-light-button:hover) {
  transform: translateY(-3px);
  background: #ffffff;
}

/* KPI GRID */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.kpi-card {
  position: relative;
  overflow: hidden;
  min-height: 140px;
  padding: 22px;
  border-radius: 30px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow:
    0 22px 56px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  animation: cardRise 0.55s ease both;
}

.kpi-card:nth-child(1) {
  animation-delay: 0.05s;
}

.kpi-card:nth-child(2) {
  animation-delay: 0.1s;
}

.kpi-card:nth-child(3) {
  animation-delay: 0.15s;
}

.kpi-card:nth-child(4) {
  animation-delay: 0.2s;
}

.kpi-card::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.kpi-blue::before {
  background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.16), transparent 40%);
}

.kpi-green::before {
  background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.16), transparent 40%);
}

.kpi-purple::before {
  background: radial-gradient(circle at top right, rgba(126, 34, 206, 0.16), transparent 40%);
}

.kpi-orange::before {
  background: radial-gradient(circle at top right, rgba(249, 115, 22, 0.16), transparent 40%);
}

.kpi-card:hover {
  transform: translateY(-7px);
  border-color: rgba(37, 99, 235, 0.18);
  box-shadow:
    0 32px 76px rgba(15, 23, 42, 0.13),
    0 8px 20px rgba(37, 99, 235, 0.07);
}

.kpi-card:hover::before {
  opacity: 1;
}

.kpi-icon,
.kpi-content {
  position: relative;
  z-index: 2;
}

.kpi-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.15rem;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.16);
}

.kpi-blue .kpi-icon {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
}

.kpi-green .kpi-icon {
  background: linear-gradient(135deg, #16a34a, #4ade80);
}

.kpi-purple .kpi-icon {
  background: linear-gradient(135deg, #7c3aed, #c084fc);
}

.kpi-orange .kpi-icon {
  background: linear-gradient(135deg, #f97316, #fdba74);
}

.kpi-content p {
  margin: 0;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.kpi-content h3 {
  margin: 8px 0 2px;
  color: #0f172a;
  font-size: 1.85rem;
  font-weight: 950;
  letter-spacing: -0.045em;
}

.kpi-content span {
  color: #64748b;
  font-size: 0.87rem;
  font-weight: 750;
}

/* SUMMARY STRIP */
.summary-strip {
  margin-bottom: 24px;
  padding: 20px 24px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.06), transparent 28%),
    #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow: 0 20px 52px rgba(15, 23, 42, 0.07);
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 18px;
  animation: cardRise 0.6s ease both;
}

.summary-item span {
  display: block;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 5px;
}

.summary-item strong {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 950;
}

.summary-divider {
  width: 1px;
  height: 38px;
  background: #e2e8f0;
}

/* CONTENT GRID */
.billing-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}

.main-column {
  min-width: 0;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-card {
  border-radius: 30px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow:
    0 22px 56px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  animation: cardRise 0.65s ease both;
}

.side-card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 22px;
}

.side-card h3 {
  margin: 0 0 4px;
  color: #0f172a;
  font-weight: 950;
  letter-spacing: -0.03em;
}

.side-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.65;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 rgba(34, 197, 94, 0.45);
  animation: pulse 1.8s infinite;
}

.health-score {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 22px;
}

.score-ring {
  width: 92px;
  height: 92px;
  min-width: 92px;
  border-radius: 999px;
  background:
    radial-gradient(circle, #ffffff 58%, transparent 60%),
    conic-gradient(#2563eb calc(var(--score, 72) * 1%), #e2e8f0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.score-ring span {
  color: #0f172a;
  font-weight: 950;
}

.health-score h4 {
  margin: 0 0 5px;
  color: #0f172a;
  font-weight: 950;
}

.mini-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mini-list-item {
  display: flex;
  justify-content: space-between;
  padding: 13px 14px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

.mini-list-item span {
  color: #64748b;
  font-weight: 850;
}

.mini-list-item strong {
  font-weight: 950;
}

.text-success {
  color: #16a34a;
}

.text-warning {
  color: #d97706;
}

.text-danger {
  color: #dc2626;
}

.gradient-side-card {
  color: #ffffff;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.38), transparent 32%),
    linear-gradient(135deg, #111827, #1e3a8a);
  border: 0;
}

.gradient-side-card h3,
.gradient-side-card p {
  color: #ffffff;
}

.gradient-side-card p {
  color: #dbeafe;
}

:deep(.side-action-button) {
  width: 100%;
  justify-content: center;
  margin-top: 18px;
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  font-weight: 950;
  background: #ffffff;
  color: #1d4ed8;
}

/* DIALOG */
:deep(.premium-dialog .p-dialog) {
  border-radius: 28px;
  overflow: hidden;
}

:deep(.premium-dialog .p-dialog-header) {
  padding: 24px 26px;
  border-bottom: 1px solid #eef2f7;
}

:deep(.premium-dialog .p-dialog-content) {
  padding: 24px 26px;
}

:deep(.premium-dialog .p-dialog-footer) {
  padding: 18px 26px 24px;
  border-top: 1px solid #eef2f7;
}

.dialog-content {
  text-align: center;
}

.dialog-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 16px;
  border-radius: 24px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.28);
}

.dialog-content h3 {
  margin: 0 0 10px;
  color: #0f172a;
  font-weight: 950;
}

.dialog-content p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}

.dialog-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.dialog-summary div,
.invoice-dialog-grid div {
  border-radius: 18px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

.dialog-summary span,
.invoice-dialog-grid span,
.invoice-dialog-top span {
  display: block;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 5px;
}

.dialog-summary strong,
.invoice-dialog-grid strong {
  color: #0f172a;
  font-weight: 950;
}

:deep(.dialog-cancel-button),
:deep(.dialog-generate-button) {
  border-radius: 999px;
  font-weight: 950;
  padding: 0.75rem 1rem;
}

:deep(.dialog-cancel-button) {
  background: #f1f5f9;
  border: 0;
  color: #0f172a;
}

:deep(.dialog-generate-button) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border: 0;
  color: #ffffff;
}

.invoice-dialog-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.invoice-dialog-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.invoice-dialog-top h3 {
  margin: 0;
  color: #0f172a;
  font-weight: 950;
}

.invoice-dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* ANIMATIONS */
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

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45);
  }

  70% {
    box-shadow: 0 0 0 13px rgba(34, 197, 94, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .billing-content-grid {
    grid-template-columns: 1fr;
  }

  .side-panel {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 850px) {
  .billing-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 26px;
    border-radius: 26px;
  }

  .hero-title {
    font-size: 1.7rem;
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

  .hero-right {
    width: 100%;
  }

  :deep(.premium-primary-button),
  :deep(.premium-light-button) {
    width: 100%;
    justify-content: center;
  }

  .summary-strip {
    grid-template-columns: 1fr;
  }

  .summary-divider {
    display: none;
  }

  .side-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .dialog-summary,
  .invoice-dialog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
