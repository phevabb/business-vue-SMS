<script setup>
import { computed } from 'vue'

const props = defineProps({
    creditsLeft: {
        type: Number,
        default: 2480
    },
    creditsUsed: {
        type: Number,
        default: 2520
    },
    totalCredits: {
        type: Number,
        default: 5000
    },
    senderName: {
        type: String,
        default: 'PHENADEMO'
    },
    defaultSmsType: {
        type: String,
        default: 'Fee Reminders'
    },
    lowBalanceAlert: {
        type: Number,
        default: 500
    },
    lastTopUp: {
        type: String,
        default: '12 Apr 2026'
    }
})

const usagePercent = computed(() => {
    if (!props.totalCredits) return 0
    return Math.min((props.creditsUsed / props.totalCredits) * 100, 100)
})

const remainingPercent = computed(() => {
    if (!props.totalCredits) return 0
    return Math.min((props.creditsLeft / props.totalCredits) * 100, 100)
})

const formattedCreditsLeft = computed(() =>
    new Intl.NumberFormat('en-GH').format(props.creditsLeft)
)

const formattedCreditsUsed = computed(() =>
    new Intl.NumberFormat('en-GH').format(props.creditsUsed)
)

const formattedTotalCredits = computed(() =>
    new Intl.NumberFormat('en-GH').format(props.totalCredits)
)

const formattedLowBalance = computed(() =>
    new Intl.NumberFormat('en-GH').format(props.lowBalanceAlert)
)

const balanceState = computed(() => {
    if (props.creditsLeft <= props.lowBalanceAlert) return 'low'
    if (props.creditsLeft <= props.totalCredits * 0.35) return 'warning'
    return 'healthy'
})

const balanceBadgeClass = computed(() => {
    switch (balanceState.value) {
        case 'low':
            return 'bg-red-50 text-red-700 border border-red-200'
        case 'warning':
            return 'bg-amber-50 text-amber-700 border border-amber-200'
        default:
            return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    }
})

const balanceLabel = computed(() => {
    switch (balanceState.value) {
        case 'low':
            return 'Low Balance'
        case 'warning':
            return 'Monitor Balance'
        default:
            return 'Healthy Balance'
    }
})
</script>

<template>
    <section class="sms-card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <p class="eyebrow">SMS &amp; Branding</p>
                <h2 class="card-title">Messaging</h2>
                <p class="card-subtitle">
                    Manage SMS credits, sender identity, reminders, and alert thresholds from one place.
                </p>
            </div>

            <div class="header-badges">
                <span class="badge badge-soft-blue">
                    Messaging
                </span>
                <span class="badge" :class="balanceBadgeClass">
                    {{ balanceLabel }}
                </span>
            </div>
        </div>

        <!-- Hero section -->
        <div class="hero-panel">
            <div class="hero-left">
                <p class="hero-label">SMS credits left</p>
                <div class="hero-value">
                    {{ formattedCreditsLeft }}
                </div>
                <p class="hero-note">
                    <strong>{{ formattedCreditsUsed }}</strong> used out of
                    <strong>{{ formattedTotalCredits }}</strong> total credits
                </p>
            </div>

            <div class="hero-right">
                <div class="mini-summary">
                    <span class="mini-label">Low Balance Alert</span>
                    <span class="mini-value">{{ formattedLowBalance }} credits</span>
                </div>
            </div>
        </div>

        <!-- Usage progress -->
        <div class="usage-card">
            <div class="usage-top">
                <span class="usage-label">Credit usage</span>
                <span class="usage-meta">{{ Math.round(usagePercent) }}% used</span>
            </div>

            <div class="progress-track">
                <div class="progress-used" :style="{ width: usagePercent + '%' }"></div>
            </div>

            <div class="usage-legend">
                <div class="legend-item">
                    <span class="legend-dot dot-blue"></span>
                    <span>{{ formattedCreditsUsed }} used</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot dot-emerald"></span>
                    <span>{{ formattedCreditsLeft }} left</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot dot-slate"></span>
                    <span>{{ formattedTotalCredits }} total</span>
                </div>
            </div>
        </div>

        <!-- Details -->
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-icon icon-indigo">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.917l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 012.25 6.993V6.75" />
                    </svg>
                </div>
                <div>
                    <p class="detail-label">Sender Name</p>
                    <p class="detail-value">{{ senderName }}</p>
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-icon icon-blue">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 3.94c.09-.55.57-.94 1.12-.94h1.08c.55 0 1.03.39 1.12.94l.12.77c.06.36.3.66.63.82.21.1.42.2.62.32.31.18.69.2 1.02.04l.7-.34c.5-.24 1.1-.11 1.45.32l.76.92c.35.43.37 1.04.05 1.49l-.45.63c-.21.29-.26.67-.13 1 .08.22.15.45.2.68.08.35.33.64.67.77l.74.28c.53.2.84.73.76 1.28l-.14 1.18c-.07.54-.5.97-1.04 1.03l-.78.09a1.2 1.2 0 00-.87.5c-.14.2-.29.39-.45.57-.23.27-.33.63-.25.98l.16.75c.12.54-.13 1.1-.61 1.37l-1.03.58c-.48.27-1.08.18-1.46-.21l-.53-.56a1.2 1.2 0 00-.95-.37c-.25.02-.5.02-.75 0a1.2 1.2 0 00-.95.37l-.53.56c-.38.39-.98.48-1.46.21l-1.03-.58a1.13 1.13 0 01-.61-1.37l.16-.75c.08-.35-.02-.71-.25-.98-.16-.18-.31-.37-.45-.57a1.2 1.2 0 00-.87-.5l-.78-.09c-.54-.06-.97-.49-1.04-1.03l-.14-1.18c-.08-.55.23-1.08.76-1.28l.74-.28c.34-.13.59-.42.67-.77.05-.23.12-.46.2-.68.13-.33.08-.71-.13-1l-.45-.63a1.13 1.13 0 01.05-1.49l.76-.92c.35-.43.95-.56 1.45-.32l.7.34c.33.16.71.14 1.02-.04.2-.12.41-.22.62-.32.33-.16.57-.46.63-.82l.12-.77z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15.75A3.75 3.75 0 1012 8.25a3.75 3.75 0 000 7.5z" />
                    </svg>
                </div>
                <div>
                    <p class="detail-label">Default SMS Type</p>
                    <p class="detail-value">{{ defaultSmsType }}</p>
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-icon icon-amber">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4.5m0 3.75h.008v.008H12v-.008z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2.25 2.25 0 001.93 3.37h16.5A2.25 2.25 0 0022.18 18L13.71 3.86a2.25 2.25 0 00-3.42 0z" />
                    </svg>
                </div>
                <div>
                    <p class="detail-label">Low Balance Alert</p>
                    <p class="detail-value">{{ formattedLowBalance }} credits</p>
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-icon icon-sky">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <p class="detail-label">Last Top-up</p>
                    <p class="detail-value">{{ lastTopUp }}</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
            <div class="footer-info">
                <p class="footer-title">SMS settings and credit control</p>
                <p class="footer-text">
                    Keep messaging ready for school communication, fee reminders, alerts, and branded sender delivery.
                </p>
            </div>

            <div class="footer-actions">
                <button class="btn btn-secondary" type="button">
                    Save Settings
                </button>
                <button class="btn btn-primary" type="button">
                    Buy SMS
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.sms-card {
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
    min-width: 180px;
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

.usage-card {
    border: 1px solid #e5e7eb;
    background: #ffffff;
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1.1rem;
}

.usage-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
}

.usage-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
}

.usage-meta {
    font-size: 0.82rem;
    font-weight: 700;
    color: #64748b;
}

.progress-track {
    width: 100%;
    height: 12px;
    border-radius: 999px;
    background: #e2e8f0;
    overflow: hidden;
    margin-bottom: 0.85rem;
}

.progress-used {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
    transition: width 0.4s ease;
}

.usage-legend {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: #64748b;
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    display: inline-block;
}

.dot-blue {
    background: #2563eb;
}

.dot-emerald {
    background: #10b981;
}

.dot-slate {
    background: #94a3b8;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.95rem;
    margin-bottom: 1.25rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    border-radius: 20px;
    padding: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.detail-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.detail-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.icon-indigo {
    background: #eef2ff;
    color: #4f46e5;
}

.icon-blue {
    background: #eff6ff;
    color: #2563eb;
}

.icon-amber {
    background: #fffbeb;
    color: #d97706;
}

.icon-sky {
    background: #f0f9ff;
    color: #0284c7;
}

.detail-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 0.2rem;
}

.detail-value {
    font-size: 1.02rem;
    color: #0f172a;
    font-weight: 700;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
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
    .details-grid {
        grid-template-columns: 1fr;
    }

    .hero-value {
        font-size: 1.7rem;
    }

    .sms-card {
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
