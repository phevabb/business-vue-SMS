<template>
    <div class="workspace-page">
        <!-- Header -->
        <section class="hero">
            <div>
                <span class="hero-badge">Tenant Workspace</span>
                <h1>{{ tenant.schoolName }}</h1>
                <p>
                    A simple overview of your workspace, subscription, billing status,
                    messaging balance, and school access.
                </p>
            </div>

            <div class="hero-actions">
                <button class="btn btn-light" @click="openSchoolSystem">Open System</button>
                <button class="btn btn-dark" @click="makePayment">Make Payment</button>
            </div>
        </section>

        <!-- Summary Cards -->
        <section class="summary-grid">
            <div class="summary-card">
                <span class="summary-label">Students</span>
                <strong>{{ tenant.activeStudents }}</strong>
                <small>{{ tenant.classCount }} classes • {{ tenant.staffCount }} staff</small>
            </div>

            <div class="summary-card">
                <span class="summary-label">Plan</span>
                <strong>{{ tenant.planName }}</strong>
                <small>{{ tenant.billingCycle }} • {{ tenant.billingStatus }}</small>
            </div>

            <div class="summary-card">
                <span class="summary-label">Next Invoice</span>
                <strong>₵{{ nextInvoiceAmount }}</strong>
                <small>{{ tenant.nextInvoiceDate }}</small>
            </div>

            <div class="summary-card">
                <span class="summary-label">SMS Credits</span>
                <strong>{{ smsCreditsLeftFormatted }}</strong>
                <small>{{ tenant.smsCreditsUsed }} used of {{ tenant.smsCreditsTotal }}</small>
            </div>
        </section>

        <!-- Main Overview -->
        <section class="main-grid">
            <!-- Overview -->
            <div class="card overview-card">
                <div class="card-header">
                    <div>
                        <h2>Workspace Overview</h2>
                        <p>Core school and account information.</p>
                    </div>
                    <span class="pill pill-blue">{{ tenant.billingStatus }}</span>
                </div>

                <div class="school-box">
                    <div class="school-logo">{{ schoolInitials }}</div>
                    <div>
                        <div class="school-name">{{ tenant.schoolName }}</div>
                        <div class="school-meta">{{ tenant.schoolType }}</div>
                        <div class="school-meta">{{ tenant.location }}</div>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <span>School ID</span>
                        <strong>{{ tenant.schoolId }}</strong>
                    </div>
                    <div class="info-item">
                        <span>Academic Year</span>
                        <strong>{{ tenant.academicYear }}</strong>
                    </div>
                    <div class="info-item">
                        <span>Tenant Code</span>
                        <strong>{{ tenant.tenantCode }}</strong>
                    </div>
                    <div class="info-item">
                        <span>Contact Email</span>
                        <strong>{{ tenant.contactEmail }}</strong>
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
                    <span class="pill pill-green">{{ tenant.sslStatus }}</span>
                </div>

                <div class="domain-panel">
                    <span class="domain-label">Live URL</span>
                    <a
                        :href="tenant.domain"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="domain-link"
                    >
                        {{ tenant.domain }}
                    </a>
                    <div class="domain-info">
                        <div class="domain-row">
                            <span>Environment</span>
                            <strong>{{ tenant.environment }}</strong>
                        </div>
                        <div class="domain-row">
                            <span>Tenant Subdomain</span>
                            <strong>{{ tenant.tenantCode }}.phena.app</strong>
                        </div>
                    </div>
                </div>

                <div class="domain-actions">
                    <button class="btn btn-dark btn-small" @click="openSchoolSystem">Open</button>
                    <button class="btn btn-light btn-small" @click="copyDomain">Copy URL</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

const tenant = reactive({
    schoolName: 'Phena Demonstration Academy',
    schoolType: 'Basic & Secondary School',
    schoolId: 'SCH-000128',
    tenantCode: 'phenademo',
    location: 'Accra, Ghana',
    contactEmail: 'admin@phenademo.edu.gh',

    planName: 'Growth Plan',
    billingCycle: 'Billed Per Term',
    billingStatus: 'Active',
    pricePerStudent: 5,
    activeStudents: 684,
    staffCount: 72,
    classCount: 28,
    nextInvoiceDate: '15 Aug 2026',

    domain: 'https://portal.phenademo.edu.gh',
    customDomain: 'portal.phenademo.edu.gh',
    sslStatus: 'Active',
    environment: 'Production',

    smsCreditsLeft: 2480,
    smsCreditsUsed: 2520,
    smsCreditsTotal: 5000,

    academicYear: '2026/2027'
})

const schoolInitials = computed(() => {
    return tenant.schoolName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
})

const nextInvoiceAmount = computed(() => {
    return (tenant.activeStudents * tenant.pricePerStudent).toLocaleString()
})

const smsCreditsLeftFormatted = computed(() => {
    return tenant.smsCreditsLeft.toLocaleString()
})

const openSchoolSystem = () => {
    window.open(tenant.domain, '_blank')
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
</script>

<style scoped>
* {
    box-sizing: border-box;
    font-family: Inter, sans-serif;
}

.workspace-page {
    max-width: 1320px;
    margin: 0 auto;
    padding: 24px;
    background: #f8fafc;
    min-height: 100vh;
    color: #0f172a;
}

/* Hero */
.hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: #e0ecff;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 12px;
}

.hero h1 {
    margin: 0 0 8px;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.hero p {
    margin: 0;
    color: #64748b;
    line-height: 1.6;
    max-width: 720px;
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
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.03);
}

.summary-label {
    display: block;
    font-size: 0.82rem;
    color: #64748b;
    margin-bottom: 8px;
    font-weight: 600;
}

.summary-card strong {
    display: block;
    font-size: 1.45rem;
    font-weight: 800;
    margin-bottom: 6px;
    color: #0f172a;
}

.summary-card small {
    color: #64748b;
    font-size: 0.84rem;
}

/* Main grid */
.main-grid {
    display: grid;
    grid-template-columns: 1.3fr 0.9fr;
    gap: 20px;
}

.card {
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
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
    font-weight: 800;
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
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
}

.pill-blue {
    background: #e0ecff;
    color: #1d4ed8;
}

.pill-green {
    background: #dcfce7;
    color: #166534;
}

/* School box */
.school-box {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
}

.school-logo {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: linear-gradient(135deg, #1d4ed8, #0f172a);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1rem;
}

.school-name {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 4px;
}

.school-meta {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
}

/* Info grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.info-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 14px;
}

.info-item span {
    display: block;
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 6px;
}

.info-item strong {
    color: #0f172a;
    font-size: 0.95rem;
    word-break: break-word;
}

/* Domain minimal */
.domain-panel {
    background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
    border: 1px solid #dbeafe;
    border-radius: 18px;
    padding: 18px;
}

.domain-label {
    display: block;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 8px;
    font-weight: 700;
}

.domain-link {
    display: inline-block;
    color: #1d4ed8;
    font-size: 1.05rem;
    font-weight: 800;
    text-decoration: none;
    margin-bottom: 14px;
    word-break: break-word;
}

.domain-link:hover {
    text-decoration: underline;
}

.domain-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.domain-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.9rem;
    padding-top: 10px;
    border-top: 1px solid rgba(148, 163, 184, 0.18);
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
    margin-top: 16px;
    flex-wrap: wrap;
}

/* Buttons */
.btn {
    border: none;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-dark {
    background: #0f172a;
    color: #ffffff;
}

.btn-dark:hover {
    background: #111827;
    transform: translateY(-1px);
}

.btn-light {
    background: #f1f5f9;
    color: #0f172a;
    border: 1px solid #e2e8f0;
}

.btn-light:hover {
    background: #eaf1f8;
}

.btn-small {
    padding: 10px 14px;
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
    }

    .hero-actions {
        width: 100%;
        flex-direction: column;
    }

    .summary-grid,
    .info-grid {
        grid-template-columns: 1fr;
    }

    .btn {
        width: 100%;
    }

    .domain-row {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
