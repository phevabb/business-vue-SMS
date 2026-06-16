<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentBalance: {
        type: Number,
        default: 0
    },
    nextInvoiceAmount: {
        type: Number,
        default: 3420
    },
    nextInvoiceDate: {
        type: String,
        default: '15 Aug 2026'
    },
    paymentMethod: {
        type: String,
        default: 'MTN MoMo •••• 3821'
    },
    payments: {
        type: Array,
        default: () => [
            {
                title: 'Term subscription payment',
                reference: 'INV-2026-0058',
                date: '25 May 2026',
                amount: 3420,
                status: 'Paid'
            },
            {
                title: 'SMS credit top-up',
                reference: 'SMS-2026-0014',
                date: '12 Apr 2026',
                amount: 850,
                status: 'Paid'
            },
            {
                title: 'School workspace renewal',
                reference: 'INV-2026-0031',
                date: '10 Mar 2026',
                amount: 3420,
                status: 'Paid'
            }
        ]
    }
})

const formatMoney = (value) => {
    return new Intl.NumberFormat('en-GH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value || 0)
}

const invoiceStatus = computed(() => {
    if (props.currentBalance <= 0) return 'Settled'
    return 'Outstanding'
})

const invoiceStatusClass = computed(() => {
    if (props.currentBalance <= 0) {
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    }
    return 'bg-amber-50 text-amber-700 border border-amber-200'
})

const totalPaid = computed(() => {
    return props.payments
        .filter((payment) => payment.status?.toLowerCase() === 'paid')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0)
})

const formattedTotalPaid = computed(() => formatMoney(totalPaid.value))
</script>

<template>
    <section class="billing-card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <p class="eyebrow">Billing Summary</p>
                <h2 class="card-title">Finance</h2>
                <p class="card-subtitle">
                    Review balances, upcoming invoices, payment methods, and recent billing activity from one place.
                </p>
            </div>

            <div class="header-badges">
                <span class="badge badge-soft-blue">Finance</span>
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
                    Next invoice is
                    <strong>₵{{ formatMoney(nextInvoiceAmount) }}</strong>
                    due on
                    <strong>{{ nextInvoiceDate }}</strong>
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
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m0 0l-3-3m3 3l3-3M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Current Balance</p>
                    <p class="stat-value">₵{{ formatMoney(currentBalance) }}</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon icon-blue">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-12V6m0 2v12" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Next Invoice</p>
                    <p class="stat-value">₵{{ formatMoney(nextInvoiceAmount) }}</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon icon-sky">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Next Invoice Date</p>
                    <p class="stat-value">{{ nextInvoiceDate }}</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon icon-indigo">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M3.75 6h16.5A1.5 1.5 0 0121.75 7.5v9A1.5 1.5 0 0120.25 18h-16.5a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 013.75 6z" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Total Paid (Recent)</p>
                    <p class="stat-value">₵{{ formattedTotalPaid }}</p>
                </div>
            </div>
        </div>

        <!-- Recent payments -->
        <div class="payments-section">
            <div class="payments-header">
                <div>
                    <p class="section-title">Recent Payments</p>
                    <p class="section-subtitle">
                        Latest successful billing activity recorded for this workspace.
                    </p>
                </div>
            </div>

            <div class="payments-list">
                <div
                    v-for="payment in payments"
                    :key="`${payment.reference}-${payment.date}`"
                    class="payment-item"
                >
                    <div class="payment-left">
                        <div class="payment-icon">
                            <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-12V6m0 2v12" />
                            </svg>
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
                            :class="payment.status?.toLowerCase() === 'paid'
                                ? 'status-paid'
                                : 'status-pending'"
                        >
                            {{ payment.status }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
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
    font-weight: 700;
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
    font-weight: 700;
    white-space: nowrap;
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
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.4rem;
}

.hero-value {
    font-size: 2rem;
    font-weight: 800;
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
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.06em;
    margin-bottom: 0.3rem;
}

.mini-value {
    font-size: 1rem;
    font-weight: 700;
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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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
    font-weight: 600;
    margin-bottom: 0.2rem;
}

.stat-value {
    font-size: 1.02rem;
    color: #0f172a;
    font-weight: 700;
}

.payments-section {
    border: 1px solid #e5e7eb;
    background: #ffffff;
    border-radius: 22px;
    padding: 1rem;
}

.payments-header {
    margin-bottom: 0.95rem;
}

.section-title {
    font-size: 1rem;
    font-weight: 700;
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
}

.payment-meta {
    min-width: 0;
}

.payment-title {
    font-size: 0.94rem;
    font-weight: 700;
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
    font-weight: 700;
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
    font-weight: 700;
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
}
</style>

