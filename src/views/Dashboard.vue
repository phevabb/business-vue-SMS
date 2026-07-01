<template>
    <div class="workspace-page">
        <div v-if="loading" class="dashboard-state">
            Loading workspace...
        </div>

        <div v-else-if="error" class="dashboard-state dashboard-error">
            {{ error }}
        </div>

        <template v-else>
            <!-- Header -->
            <section class="hero">
                <div class="hero-content">
                    <span class="hero-badge">
                        Workspace
                    </span>

                    <h1>{{ tenant.schoolName }}</h1>

                    <p>
                        A premium overview of your school workspace, access credentials,
                        and live system details.
                    </p>
                </div>

                <div class="hero-actions">
                    <button class="btn btn-dark" @click="openSchoolSystem">
                        Open System
                    </button>
                </div>
            </section>

            <!-- Summary Cards -->
            <section class="summary-grid">
                <!--
                <div class="summary-card">
                    <span class="summary-label">Students</span>
                    <strong>{{ tenant.activeStudents }}</strong>
                    <small>{{ tenant.classCount }} classes • {{ tenant.staffCount }} staff</small>
                </div>
                -->

                <div class="summary-card premium-summary-card">
                    <div class="summary-icon">
                        ✦
                    </div>

                    <span class="summary-label">
                        Current Plan
                    </span>

                    <strong>{{ tenant.planName }}</strong>

                    <small>
                        {{ tenant.billingCycle }} • {{ tenant.billingStatus }}
                    </small>
                </div>

                <!--
                <div class="summary-card">
                    <span class="summary-label">Next Invoice</span>
                    <strong>₵{{ nextInvoiceAmount }}</strong>
                    <small>{{ tenant.nextInvoiceDate }}</small>
                </div>
                -->

                <!--
                <div class="summary-card">
                    <span class="summary-label">SMS Credits</span>
                    <strong>{{ smsCreditsLeftFormatted }}</strong>
                    <small>{{ tenant.smsCreditsUsed }} used of {{ tenant.smsCreditsTotal }}</small>
                </div>
                -->
            </section>

            <!-- Main Overview -->
            <section class="main-grid">
                <!-- Overview -->
                <div class="card overview-card">
                    <div class="card-header">
                        <div>
                            <h2>Workspace Overview</h2>
                            <p>Core school and account access information.</p>
                        </div>

                        <span class="pill pill-blue">
                            {{ tenant.billingStatus }}
                        </span>
                    </div>

                    <div class="school-box">
                        <div class="school-logo">
                            {{ schoolInitials }}
                        </div>

                        <div>
                            <div class="school-name">
                                {{ tenant.schoolName }}
                            </div>

                            <div class="school-meta">
                                {{ tenant.schoolType }}
                            </div>

                            <div class="school-meta">
                                {{ tenant.location }}
                            </div>
                        </div>
                    </div>

                    <!-- Premium Credential Section -->
                    <div class="credential-section">
                        <div class="credential-card principal-card">
                            <div class="credential-glow"></div>

                            <div class="credential-top">
                                <div class="credential-icon">
                                    👨‍🏫
                                </div>

                                <div class="credential-badge">
                                    PRINCIPAL ACCESS
                                </div>
                            </div>

                            <div class="credential-label">
                                Principal ID
                            </div>

                            <div class="credential-id">
                                {{ tenant.principalLoginUserId }}
                            </div>

                            <div class="credential-pin-box">
                                <span>Principal PIN</span>
                                <strong>{{ tenant.principalPin }}</strong>
                            </div>
                        </div>

                        <div class="credential-card admin-card">
                            <div class="credential-glow"></div>

                            <div class="credential-top">
                                <div class="credential-icon">
                                    🛡️
                                </div>

                                <div class="credential-badge">
                                    ADMIN ACCESS
                                </div>
                            </div>

                            <div class="credential-label">
                                Administrator ID
                            </div>

                            <div class="credential-id">
                                {{ tenant.adminLoginUserId }}
                            </div>

                            <div class="credential-pin-box">
                                <span>Admin PIN</span>
                                <strong>{{ tenant.adminPin }}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Minimal Premium Domain -->
                <div class="card domain-card">
                    <div class="card-header">
                        <div>
                            <h2>School Domain</h2>
                            <p>Live access details.</p>
                        </div>

                        <span class="pill pill-green">
                            {{ tenant.sslStatus }}
                        </span>
                    </div>

                    <div class="domain-panel">
                        <span class="domain-label">
                            Live URL
                        </span>

                        <a
                            class="domain-link"
                            :href="tenant.domain.startsWith('http') ? tenant.domain : `https://${tenant.domain}`"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{ tenant.domain }}
                        </a>

                        <!-- comment local url starts here -->

                        <!--
                        <div class="domain-info">
                            <div class="domain-row">
                                <span>Environment</span>
                                <strong>{{ tenant.environment }}</strong>
                            </div>

                            <div class="domain-row">
                                <span>Tenant Subdomain</span>

                                <a
                                    class="domain-link"
                                    :href="tenant.defaultLocalDomain.startsWith('http') ? tenant.defaultLocalDomain : `https://${tenant.defaultLocalDomain}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ tenant.defaultLocalDomain }}
                                </a>
                            </div>
                        </div>
                        -->

                        <!-- comment local url ends here -->
                    </div>

                    <div class="domain-actions">
                        <button class="btn btn-dark btn-small" @click="openSchoolSystem">
                            Open
                        </button>

                        <button class="btn btn-light btn-small" @click="copyDomain">
                            Copy URL
                        </button>
                    </div>
                </div>
            </section>
        </template>
    </div>
</template>

<script setup>
import { getWorkspaceDashboard } from '@/services/auth.js'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const loading = ref(false)
const error = ref('')


const tenant = reactive({
  schoolName: '',
  schoolType: 'School',
  schoolId: '',
  adminLoginUserId: '',
  adminPin: '',
  principalLoginUserId: '',
  principalPin: '',
  tenantCode: '',
  location: '',
  contactEmail: '',
  defaultLocalDomain: '',

  planName: 'Standard Plan',
  billingCycle: 'Billed Per Term',
  billingStatus: 'Active',
  pricePerStudent: 0,
  activeStudents: 0,
  staffCount: 0,
  classCount: 0,
  nextInvoiceDate: '',

  domain: '',
  customDomain: '',
  sslStatus: 'Active',
  environment: 'Production',

  smsCreditsLeft: 0,
  smsCreditsUsed: 0,
  smsCreditsTotal: 0,

  academicYear: '',
})

const schoolInitials = computed(() => {
  if (!tenant.schoolName) return 'PH'

  return tenant.schoolName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
})

const nextInvoiceAmount = computed(() => {
  return (tenant.activeStudents * tenant.pricePerStudent).toLocaleString()
})

const smsCreditsLeftFormatted = computed(() => {
  return Number(tenant.smsCreditsLeft || 0).toLocaleString()
})

function applyDashboardData(data) {
  tenant.schoolName = data.schoolName || ''
  tenant.schoolType = data.schoolType || 'School'
  tenant.schoolId = data.schoolId || data.tenantCode || ''
  tenant.tenantCode = data.tenantCode || ''
  tenant.location = data.location || ''
  tenant.contactEmail = data.contactEmail || data.email || ''
  tenant.defaultLocalDomain = data.defaultLocalDomain || ''
  tenant.principalLoginUserId = data.principalLoginUserId || ''
  tenant.principalPin = data.principalPin || ''
  tenant.adminLoginUserId = data.adminLoginUserId || ''
  tenant.adminPin = data.adminPin || ''

  tenant.planName = data.planName || 'Standard Plan'
  tenant.billingCycle = data.billingCycle || 'Billed Per Term'
  tenant.billingStatus = data.billingStatus || data.tenantStatus || 'Active'
  tenant.pricePerStudent = Number(data.pricePerStudent || 0)
  tenant.activeStudents = Number(data.activeStudents || data.estimatedStudents || 0)
  tenant.staffCount = Number(data.staffCount || 0)
  tenant.classCount = Number(data.classCount || 0)
  tenant.nextInvoiceDate = data.nextInvoiceDate || ''

  tenant.domain = data.domain || data.defaultDomain || ''
  tenant.customDomain = data.customDomain || data.defaultDomain || ''
  tenant.sslStatus = data.sslStatus || 'Active'
  tenant.environment = data.environment || 'Production'

  tenant.smsCreditsLeft = Number(data.smsCreditsLeft || 0)
  tenant.smsCreditsUsed = Number(data.smsCreditsUsed || 0)
  tenant.smsCreditsTotal = Number(data.smsCreditsTotal || 0)

  tenant.academicYear = data.academicYear || ''
}

async function fetchDashboard() {
  error.value = ''

  const tenantCode = localStorage.getItem('tenantCode')

  if (!tenantCode) {
    router.replace('/auth/login')
    return
  }

  loading.value = true

  try {
    const response = await getWorkspaceDashboard(tenantCode)

    applyDashboardData(response.data)
  } catch (err) {
    error.value =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Failed to load dashboard data.'
  } finally {
    loading.value = false
  }
}

const openSchoolSystem = () => {
  if (!tenant.domain) return

  const url = tenant.domain.startsWith('http')
    ? tenant.domain
    : `https://${tenant.domain}`

  window.open(url, '_blank')
}

const copyDomain = async () => {
  try {
    await navigator.clipboard.writeText(tenant.domain)
    alert('Domain copied successfully.')
  } catch (error) {
    alert('Unable to copy domain.')
  }
}

const makePayment = () => {
  alert('Redirecting to payment flow...')
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

.dashboard-state {
    padding: 28px;
    border-radius: 22px;
    background: #ffffff;
    color: #111827;
    font-weight: 800;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.dashboard-error {
    color: #991b1b;
    background: #fee2e2;
}

.workspace-page {
    max-width: 1320px;
    margin: 0 auto;
    padding: 24px;
    min-height: 100vh;
    color: #0f172a;
    background:
        radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 30%),
        radial-gradient(circle at top right, rgba(251, 191, 36, 0.08), transparent 26%),
        linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
}

/* Hero */
.hero {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    padding: 34px;
    border-radius: 32px;
    color: #ffffff;
    background:
        radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.35), transparent 34%),
        radial-gradient(circle at 20% 10%, rgba(250, 204, 21, 0.16), transparent 28%),
        linear-gradient(135deg, #07111f 0%, #0f172a 48%, #111827 100%);
    box-shadow:
        0 24px 70px rgba(15, 23, 42, 0.22),
        inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

.hero::before {
    content: '';
    position: absolute;
    width: 260px;
    height: 260px;
    top: -120px;
    right: -80px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
}

.hero::after {
    content: '';
    position: absolute;
    width: 160px;
    height: 160px;
    bottom: -90px;
    left: 38%;
    border-radius: 999px;
    background: rgba(96, 165, 250, 0.12);
}

.hero-content,
.hero-actions {
    position: relative;
    z-index: 2;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 8px 14px;
    margin-bottom: 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #ffffff;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.04em;
    backdrop-filter: blur(12px);
}

.hero h1 {
    margin: 0 0 10px;
    color: #ffffff;
    font-size: 2.45rem;
    font-weight: 950;
    letter-spacing: -0.045em;
}

.hero p {
    max-width: 760px;
    margin: 0;
    color: #cbd5e1;
    line-height: 1.7;
    font-size: 0.98rem;
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
    gap: 18px;
    margin-bottom: 24px;
}

.summary-card {
    position: relative;
    overflow: hidden;
    min-height: 132px;
    padding: 22px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(255, 255, 255, 0.86);
    backdrop-filter: blur(16px);
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.07);
}

.premium-summary-card::after {
    content: '';
    position: absolute;
    width: 140px;
    height: 140px;
    right: -70px;
    top: -70px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.09);
}

.summary-icon {
    width: 38px;
    height: 38px;
    margin-bottom: 14px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: #ffffff;
    font-weight: 900;
    box-shadow: 0 12px 25px rgba(37, 99, 235, 0.25);
}

.summary-label {
    display: block;
    margin-bottom: 8px;
    color: #64748b;
    font-size: 0.82rem;
    font-weight: 800;
}

.summary-card strong {
    display: block;
    margin-bottom: 6px;
    color: #0f172a;
    font-size: 1.45rem;
    font-weight: 950;
    letter-spacing: -0.03em;
}

.summary-card small {
    color: #64748b;
    font-size: 0.86rem;
}

/* Main grid */
.main-grid {
    display: grid;
    grid-template-columns: 1.35fr 0.9fr;
    gap: 22px;
}

.card {
    position: relative;
    overflow: hidden;
    padding: 26px;
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(18px);
    box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08);
    transition: transform 0.28s ease, box-shadow 0.28s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 26px 70px rgba(15, 23, 42, 0.11);
}

.card-header {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 22px;
}

.card-header h2 {
    margin: 0 0 6px;
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 950;
    letter-spacing: -0.02em;
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
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
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

/* School box */
.school-box {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding: 18px;
    border-radius: 24px;
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    border: 1px solid #e2e8f0;
}

.school-logo {
    width: 66px;
    height: 66px;
    flex-shrink: 0;
    border-radius: 22px;
    background:
        radial-gradient(circle at top right, rgba(255, 255, 255, 0.28), transparent 38%),
        linear-gradient(135deg, #1d4ed8, #0f172a);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 950;
    font-size: 1.05rem;
    box-shadow: 0 14px 30px rgba(37, 99, 235, 0.3);
}

.school-name {
    margin-bottom: 5px;
    color: #0f172a;
    font-size: 1.03rem;
    font-weight: 950;
}

.school-meta {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
}

/* Premium Credentials */
.credential-section {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.credential-card {
    position: relative;
    overflow: hidden;
    min-height: 245px;
    padding: 24px;
    border-radius: 28px;
    color: #ffffff;
    isolation: isolate;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: floatAttention 4.5s ease-in-out infinite;
}

.credential-card:hover {
    transform: translateY(-6px) scale(1.01);
}

.credential-card::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
}

.credential-card::after {
    content: '';
    position: absolute;
    inset: 1px;
    z-index: -1;
    border-radius: 27px;
    background:
        linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.16),
            rgba(255, 255, 255, 0.03)
        );
    pointer-events: none;
}

.principal-card {
    background:
        radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.34), transparent 26%),
        linear-gradient(135deg, #1d4ed8 0%, #2563eb 46%, #60a5fa 100%);
    box-shadow:
        0 22px 45px rgba(37, 99, 235, 0.32),
        inset 0 1px 1px rgba(255, 255, 255, 0.18);
}

.admin-card {
    animation-delay: 0.6s;
    background:
        radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.16), transparent 26%),
        linear-gradient(135deg, #020617 0%, #0f172a 48%, #334155 100%);
    box-shadow:
        0 22px 45px rgba(15, 23, 42, 0.32),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.credential-glow {
    position: absolute;
    width: 170px;
    height: 170px;
    top: -88px;
    right: -78px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    filter: blur(1px);
}

.credential-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
}

.credential-icon {
    width: 46px;
    height: 46px;
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.45rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
}

.credential-badge {
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-size: 0.68rem;
    font-weight: 950;
    letter-spacing: 0.09em;
    text-align: right;
    backdrop-filter: blur(12px);
}

.credential-label {
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.86rem;
    font-weight: 800;
}

.credential-id {
    min-height: 45px;
    color: #ffffff;
    font-size: 1.6rem;
    line-height: 1.15;
    font-weight: 950;
    letter-spacing: -0.035em;
    word-break: break-word;
}

.credential-pin-box {
    margin-top: 22px;
    padding: 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(14px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
}

.credential-pin-box span {
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.78rem;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.credential-pin-box strong {
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 950;
    letter-spacing: 0.12em;
    word-break: break-word;
}

@keyframes floatAttention {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }

    100% {
        transform: translateY(0);
    }
}

/* Domain */
.domain-card::before {
    content: '';
    position: absolute;
    width: 220px;
    height: 220px;
    top: -120px;
    right: -110px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.08);
}

.domain-panel {
    position: relative;
    overflow: hidden;
    padding: 24px;
    border-radius: 26px;
    background:
        radial-gradient(circle at top right, rgba(59, 130, 246, 0.13), transparent 34%),
        linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    border: 1px solid #dbeafe;
}

.domain-panel::after {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    top: -90px;
    right: -90px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.08);
}

.domain-label {
    position: relative;
    z-index: 2;
    display: block;
    margin-bottom: 10px;
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.domain-link {
    position: relative;
    z-index: 2;
    display: inline-block;
    margin-bottom: 4px;
    color: #1d4ed8;
    font-size: 1.08rem;
    font-weight: 950;
    text-decoration: none;
    word-break: break-word;
}

.domain-link:hover {
    text-decoration: underline;
}

.domain-info {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 14px;
}

.domain-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding-top: 10px;
    border-top: 1px solid rgba(148, 163, 184, 0.22);
    font-size: 0.9rem;
}

.domain-row:first-child {
    border-top: none;
    padding-top: 0;
}

.domain-row span {
    color: #64748b;
}

.domain-row strong {
    color: #0f172a;
    text-align: right;
    word-break: break-word;
}

.domain-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    flex-wrap: wrap;
}

/* Buttons */
.btn {
    border: none;
    border-radius: 15px;
    padding: 13px 18px;
    font-weight: 900;
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.btn-dark {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.31);
}

.btn-dark:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 38px rgba(37, 99, 235, 0.4);
}

.btn-light {
    background: #f8fafc;
    color: #0f172a;
    border: 1px solid #e2e8f0;
}

.btn-light:hover {
    background: #eef4ff;
    transform: translateY(-2px);
}

.btn-small {
    padding: 11px 15px;
    font-size: 0.88rem;
}

/* Responsive */
@media (max-width: 1100px) {
    .summary-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .main-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .workspace-page {
        padding: 16px;
    }

    .hero {
        flex-direction: column;
        align-items: flex-start;
        padding: 26px;
    }

    .hero h1 {
        font-size: 2rem;
    }

    .hero-actions {
        width: 100%;
        flex-direction: column;
    }

    .summary-grid,
    .credential-section {
        grid-template-columns: 1fr;
    }

    .card {
        padding: 20px;
        border-radius: 26px;
    }

    .school-box {
        align-items: flex-start;
    }

    .credential-id {
        font-size: 1.35rem;
    }

    .credential-pin-box {
        flex-direction: column;
        align-items: flex-start;
    }

    .btn {
        width: 100%;
    }

    .domain-actions {
        flex-direction: column;
    }

    .domain-row {
        flex-direction: column;
        align-items: flex-start;
    }

    .domain-row strong {
        text-align: left;
    }
}
</style>
