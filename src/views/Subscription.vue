<script setup>
import { computed } from 'vue'

const props = defineProps({
    planName: {
        type: String,
        default: 'Growth Plan'
    },
    paymentState: {
        type: String,
        default: 'Paid' // Paid | Pending | Overdue
    },
    billingCycle: {
        type: String,
        default: 'Billed Per Term'
    },
    pricePerStudent: {
        type: Number,
        default: 5
    },
    studentsBilled: {
        type: Number,
        default: 684
    },
    nextRenewal: {
        type: String,
        default: '15 Aug 2026'
    },
    currentStatus: {
        type: String,
        default: 'Active' // Active | Trial | Suspended
    }
})

const paymentBadgeClass = computed(() => {
    switch (props.paymentState.toLowerCase()) {
        case 'paid':
            return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        case 'pending':
            return 'bg-amber-50 text-amber-700 border border-amber-200'
        case 'overdue':
            return 'bg-red-50 text-red-700 border border-red-200'
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
})

const statusBadgeClass = computed(() => {
    switch (props.currentStatus.toLowerCase()) {
        case 'active':
            return 'bg-blue-50 text-blue-700 border border-blue-200'
        case 'trial':
            return 'bg-violet-50 text-violet-700 border border-violet-200'
        case 'suspended':
            return 'bg-red-50 text-red-700 border border-red-200'
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
})

const estimatedAmount = computed(() => {
    return props.pricePerStudent * props.studentsBilled
})

const formattedAmount = computed(() => {
    return new Intl.NumberFormat('en-GH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(estimatedAmount.value)
})

const formattedPrice = computed(() => {
    return new Intl.NumberFormat('en-GH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(props.pricePerStudent)
})
</script>

<template>
    <section class="subscription-card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <p class="eyebrow">Subscription &amp; Plan</p>
                <h2 class="card-title">{{ planName }}</h2>
                <p class="card-subtitle">{{ billingCycle }}</p>
            </div>

            <div class="header-badges">
                <span class="badge" :class="paymentBadgeClass">
                    {{ paymentState }}
                </span>
                <span class="badge" :class="statusBadgeClass">
                    {{ currentStatus }}
                </span>
            </div>
        </div>

        <!-- Hero summary -->
        <div class="hero-panel">
            <div class="hero-left">
                <p class="hero-label">Estimated subscription value</p>
                <div class="hero-amount">
                    ₵{{ formattedAmount }}
                </div>
                <p class="hero-note">
                    Based on <strong>{{ studentsBilled }}</strong> billed students at
                    <strong>₵{{ formattedPrice }}</strong> per student
                </p>
            </div>

            <div class="hero-right">
                <div class="renewal-box">
                    <span class="renewal-label">Next Renewal</span>
                    <span class="renewal-date">{{ nextRenewal }}</span>
                </div>
            </div>
        </div>

        <!-- Metrics -->
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-icon icon-blue">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Price Per Student</p>
                    <p class="stat-value">₵{{ formattedPrice }}</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon icon-indigo">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Students Billed</p>
                    <p class="stat-value">{{ studentsBilled }}</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon icon-sky">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Next Renewal</p>
                    <p class="stat-value">{{ nextRenewal }}</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon icon-emerald">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l2.25 2.25L15 9.75" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7.5 4.5v6c0 5.25-3.75 7.5-7.5 8.5-3.75-1-7.5-3.25-7.5-8.5v-6L12 3z" />
                    </svg>
                </div>
                <div>
                    <p class="stat-label">Current Status</p>
                    <p class="stat-value">{{ currentStatus }}</p>
                </div>
            </div>
        </div>

        <!-- Footer actions -->
        <div class="card-footer">
            <div class="footer-info">
                <p class="footer-title">Manage your plan</p>
                <p class="footer-text">
                    Upgrade your subscription, review current billing terms, or adjust your plan for school growth.
                </p>
            </div>

            <div class="footer-actions">
                <button class="btn btn-secondary" type="button">
                    Manage
                </button>
                <button class="btn btn-primary" type="button">
                    Upgrade Plan
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.subscription-card {
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

.hero-panel {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: stretch;
    background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
    border: 1px solid #dbeafe;
    border-radius: 22px;
    padding: 1.2rem;
    margin-bottom: 1.25rem;
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

.hero-amount {
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

.renewal-box {
    min-width: 170px;
    background: #ffffff;
    border: 1px solid #dbeafe;
    border-radius: 18px;
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.06);
}

.renewal-label {
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.06em;
    margin-bottom: 0.3rem;
}

.renewal-date {
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

.icon-blue {
    background: #eff6ff;
    color: #2563eb;
}

.icon-indigo {
    background: #eef2ff;
    color: #4f46e5;
}

.icon-sky {
    background: #f0f9ff;
    color: #0284c7;
}

.icon-emerald {
    background: #ecfdf5;
    color: #059669;
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

.card-footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding-top: 0.3rem;
    flex-wrap: wrap;
}

.footer-info {
    flex: 1 1 260px;
}

.footer-title {
    font-size: 0.98rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.25rem;
}

.footer-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #64748b;
}

.footer-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.btn {
    min-height: 44px;
    border-radius: 14px;
    padding: 0 1rem;
    font-size: 0.92rem;
    font-weight: 700;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
}

.btn-secondary {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background: #f8fafc;
}

.btn-primary {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .hero-amount {
        font-size: 1.7rem;
    }

    .subscription-card {
        padding: 1.15rem;
    }

    .card-footer {
        align-items: stretch;
    }

    .footer-actions {
        width: 100%;
    }

    .btn {
        flex: 1;
    }
}
</style>
