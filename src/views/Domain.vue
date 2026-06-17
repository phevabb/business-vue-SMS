<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    liveDomain: {
        type: String,
        default: 'portal.phenademo.edu.gh'
    },
    sslStatus: {
        type: String,
        default: 'Active' // Active | Pending | Expired
    },
    environment: {
        type: String,
        default: 'Production' // Production | Staging | Development
    },
    tenantSubdomain: {
        type: String,
        default: 'phenademo.phena.app'
    }
})

const copied = ref(false)

const sslBadgeClass = computed(() => {
    switch (props.sslStatus.toLowerCase()) {
        case 'active':
            return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        case 'pending':
            return 'bg-amber-50 text-amber-700 border border-amber-200'
        case 'expired':
            return 'bg-red-50 text-red-700 border border-red-200'
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
})

const environmentBadgeClass = computed(() => {
    switch (props.environment.toLowerCase()) {
        case 'production':
            return 'bg-blue-50 text-blue-700 border border-blue-200'
        case 'staging':
            return 'bg-violet-50 text-violet-700 border border-violet-200'
        case 'development':
            return 'bg-slate-50 text-slate-700 border border-slate-200'
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
})

const openLiveSite = () => {
    const url = props.liveDomain.startsWith('http')
        ? props.liveDomain
        : `https://${props.liveDomain}`

    window.open(url, '_blank')
}

const copyDomain = async () => {
    try {
        await navigator.clipboard.writeText(props.liveDomain)
        copied.value = true

        setTimeout(() => {
            copied.value = false
        }, 1800)
    } catch (err) {
        console.error('Failed to copy domain:', err)
    }
}
</script>

<template>
    <section class="domain-card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <p class="eyebrow">School Domain</p>
                <h2 class="card-title">Live Access</h2>
                <p class="card-subtitle">
                    Manage the live school access domain, SSL status, deployment environment, and tenant subdomain.
                </p>
            </div>

            <div class="header-badges">
                <span class="badge" :class="sslBadgeClass">
                    SSL {{ sslStatus }}
                </span>
                <span class="badge" :class="environmentBadgeClass">
                    {{ environment }}
                </span>
            </div>
        </div>

        <!-- Hero domain panel -->
        <div class="hero-panel">
            <div class="hero-left">
                <p class="hero-label">Primary School Domain</p>
                <div class="hero-domain">
                    {{ liveDomain }}
                </div>
                <p class="hero-note">
                    This is the live web address used by your school to access the system securely.
                </p>
            </div>

            <div class="hero-actions">
                <button class="btn btn-secondary" type="button" @click="copyDomain">
                    {{ copied ? 'Copied' : 'Copy URL' }}
                </button>
                <button class="btn btn-primary" type="button" @click="openLiveSite">
                    Open System
                </button>
            </div>
        </div>

        <!-- Domain details -->
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-icon icon-blue">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a3.75 3.75 0 10-7.5 0v3.75M6 10.5h6a2.25 2.25 0 012.25 2.25v5.25A2.25 2.25 0 0112 20.25H6A2.25 2.25 0 013.75 18v-5.25A2.25 2.25 0 016 10.5z" />
                    </svg>
                </div>
                <div>
                    <p class="detail-label">SSL</p>
                    <p class="detail-value">{{ sslStatus }}</p>
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-icon icon-indigo">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 6.75h18M6.75 3v3.75M17.25 3v3.75M4.5 9.75h15A1.5 1.5 0 0121 11.25v7.5A1.5 1.5 0 0119.5 20.25h-15A1.5 1.5 0 013 18.75v-7.5A1.5 1.5 0 014.5 9.75z" />
                    </svg>
                </div>
                <div>
                    <p class="detail-label">Environment</p>
                    <p class="detail-value">{{ environment }}</p>
                </div>
            </div>

            <div class="detail-item detail-wide">
                <div class="detail-icon icon-sky">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M3 12h18" />
                    </svg>
                </div>
                <div class="w-full min-w-0">
                    <p class="detail-label">Tenant Subdomain</p>
                    <p class="detail-value break-all">{{ tenantSubdomain }}</p>
                </div>
            </div>
        </div>

        <!-- Footer helper -->
        <div class="card-footer">
            <div>
                <p class="footer-title">Domain access overview</p>
                <p class="footer-text">
                    Keep your school access domain active, secure, and correctly mapped to your production environment.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.domain-card {
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
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
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

.hero-panel {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
    border: 1px solid #dbeafe;
    border-radius: 22px;
    padding: 1.2rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
}

.hero-left {
    flex: 1 1 320px;
    min-width: 0;
}

.hero-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.4rem;
}

.hero-domain {
    font-size: 1.55rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
    margin-bottom: 0.35rem;
    word-break: break-word;
}

.hero-note {
    color: #64748b;
    font-size: 0.92rem;
    line-height: 1.5;
}

.hero-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.95rem;
    margin-bottom: 1.1rem;
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
    min-width: 0;
}

.detail-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.detail-wide {
    grid-column: span 2;
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
    border-top: 1px solid #f1f5f9;
    padding-top: 1rem;
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

    .detail-wide {
        grid-column: span 1;
    }

    .hero-domain {
        font-size: 1.25rem;
    }

    .domain-card {
        padding: 1.15rem;
    }

    .hero-actions {
        width: 100%;
    }

    .btn {
        flex: 1;
    }
}
</style>
