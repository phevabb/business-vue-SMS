<template>
  <div class="wallet-page">

    <!-- HERO -->
    <section class="wallet-hero">
      <div>
        <span class="wallet-badge">
          Super Admin SMS Wallets
        </span>

        <h1>SMS Wallet Dashboard</h1>

        <p>
          Monitor school wallet balances, cash top-ups, SMS credit activity,
          and wallet transaction history across all tenants.
        </p>
      </div>

      <div class="hero-balance-card">
        <span>Total Cash Balance</span>

        <strong>
          GHS {{ totalCashBalance.toFixed(2) }}
        </strong>

        <small>
          Across all active school wallets
        </small>
      </div>
    </section>

    <!-- SUMMARY CARDS -->
    <section class="summary-grid">

      <div class="summary-card">
        <span>Total Wallets</span>

        <strong>
          {{ wallets.length }}
        </strong>

        <small>
          Schools with wallets
        </small>
      </div>

      <div class="summary-card">
        <span>Total Cash Loaded</span>

        <strong>
          GHS {{ totalCashLoaded.toFixed(2) }}
        </strong>

        <small>
          All wallet top-ups
        </small>
      </div>

      <div class="summary-card">
        <span>SMS Remaining</span>

        <strong>
          {{ totalSmsBalance.toLocaleString() }}
        </strong>

        <small>
          SMS credits available
        </small>
      </div>

      <div class="summary-card">
        <span>SMS Used</span>

        <strong>
          {{ totalSmsUsed.toLocaleString() }}
        </strong>

        <small>
          Total consumed credits
        </small>
      </div>

    </section>

    <!-- FILTERS -->
    <section class="wallet-card">
      <div class="toolbar">

        <div class="search-box">
          <i class="pi pi-search"></i>

          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search school name or tenant code..."
          >
        </div>

        <select v-model="walletStatusFilter">
          <option value="all">
            All Wallets
          </option>

          <option value="active">
            Active
          </option>

          <option value="suspended">
            Suspended
          </option>
        </select>

        <button
          class="refresh-btn"
          type="button"
          :disabled="loading || transactionsLoading"
          @click="loadDashboardData"
        >
          {{
            loading || transactionsLoading
              ? 'Loading...'
              : 'Refresh'
          }}
        </button>

      </div>
    </section>

    <!-- WALLET TABLE -->
    <section class="wallet-card">

      <div class="card-header">
        <div>
          <h2>School Wallets</h2>

          <p>
            View each school’s cash wallet, SMS balance, total loaded cash
            and SMS usage summary.
          </p>
        </div>
      </div>

      <div
        v-if="loading"
        class="empty-state"
      >
        Loading wallet data...
      </div>

      <div
        v-else-if="filteredWallets.length === 0"
        class="empty-state"
      >
        No wallets found.
      </div>

      <div
        v-else
        class="table-wrapper"
      >

        <div class="wallet-table wallet-table-head">
          <span>School</span>
          <span>Tenant Code</span>
          <span>Cash Balance</span>
          <span>SMS Balance</span>
          <span>Total Loaded</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div
          v-for="wallet in filteredWallets"
          :key="wallet.id"
          class="wallet-table wallet-table-row"
          :class="{
            selected: selectedTenantCode === wallet.tenantCode
          }"
        >
          <div>
            <strong>
              {{ wallet.schoolName }}
            </strong>

            <small>
              Created {{ formatDate(wallet.createdAt) }}
            </small>
          </div>

          <span>
            {{ wallet.tenantCode }}
          </span>

          <strong>
            GHS {{ money(wallet.cashBalance) }}
          </strong>

          <strong>
            {{ Number(wallet.smsBalance || 0).toLocaleString() }}
          </strong>

          <strong>
            GHS {{ money(wallet.totalCashLoaded) }}
          </strong>

          <span
            class="status-pill"
            :class="normalizeStatus(wallet.status)"
          >
            {{ wallet.status }}
          </span>

          <button
            class="view-btn"
            type="button"
            @click="selectWallet(wallet)"
          >
            View History
          </button>
        </div>

      </div>

    </section>

    <!-- TRANSACTIONS -->
    <section class="wallet-card">

      <div class="card-header transaction-header">
        <div>
          <h2>
            Wallet Transactions
          </h2>

          <p>
            {{
              selectedTenantCode
                ? `Showing transactions for ${selectedTenantCode}`
                : 'Showing all wallet transactions'
            }}
          </p>
        </div>

        <button
          v-if="selectedTenantCode"
          class="clear-btn"
          type="button"
          @click="clearSelectedWallet"
        >
          Show All
        </button>
      </div>

      <div class="transaction-toolbar">

        <div class="search-box">
          <i class="pi pi-search"></i>

          <input
            v-model="transactionSearchTerm"
            type="text"
            placeholder="Search reference, tenant code or description..."
          >
        </div>

        <select v-model="transactionTypeFilter">
          <option value="all">
            All Types
          </option>

          <option value="cash_credit">
            Cash Credit
          </option>

          <option value="cash_debit">
            Cash Debit
          </option>

          <option value="sms_credit">
            SMS Credit
          </option>

          <option value="sms_debit">
            SMS Debit
          </option>

          <option value="refund">
            Refund
          </option>

          <option value="adjustment">
            Adjustment
          </option>
        </select>

      </div>

      <div
        v-if="transactionsLoading"
        class="empty-state"
      >
        Loading wallet transactions...
      </div>

      <div
        v-else-if="filteredTransactions.length === 0"
        class="empty-state"
      >
        No wallet transactions found.
      </div>

      <div
        v-else
        class="transaction-list"
      >

        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="transaction-card"
        >
          <div class="transaction-top">

            <div>
              <span
                class="type-pill"
                :class="normalizeStatus(transaction.type)"
              >
                {{ formatTransactionType(transaction.type) }}
              </span>

              <h3>
                {{ transaction.description }}
              </h3>

              <small>
                {{ transaction.tenantCode }}
                •
                {{ formatDateTime(transaction.createdAt) }}
              </small>
            </div>

            <div class="transaction-amount">
              <strong v-if="transaction.amountCash">
                GHS {{ money(transaction.amountCash) }}
              </strong>

              <strong v-else-if="transaction.amountSms">
                {{ Number(transaction.amountSms).toLocaleString() }} SMS
              </strong>

              <strong v-else>
                -
              </strong>
            </div>

          </div>

          <div class="transaction-grid">

            <div>
              <span>Cash Before</span>

              <strong>
                GHS {{ money(transaction.cashBalanceBefore) }}
              </strong>
            </div>

            <div>
              <span>Cash After</span>

              <strong>
                GHS {{ money(transaction.cashBalanceAfter) }}
              </strong>
            </div>

            <div>
              <span>SMS Before</span>

              <strong>
                {{ Number(transaction.smsBalanceBefore || 0).toLocaleString() }}
              </strong>
            </div>

            <div>
              <span>SMS After</span>

              <strong>
                {{ Number(transaction.smsBalanceAfter || 0).toLocaleString() }}
              </strong>
            </div>

          </div>

          <div
            v-if="transaction.reference"
            class="reference-box"
          >
            <span>Reference</span>

            <strong>
              {{ transaction.reference }}
            </strong>
          </div>

        </div>

      </div>

    </section>

  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'

import {
    getSmsWallets,
    getSmsWalletTransactions,
    getSmsWalletTransactionsByTenantCode,
} from '@/adminBox/services/superadminApi.js'

const toast = useToast()

const loading = ref(false)

const transactionsLoading = ref(false)

const wallets = ref([])

const transactions = ref([])

const searchTerm = ref('')

const transactionSearchTerm = ref('')

const walletStatusFilter = ref('all')

const transactionTypeFilter = ref('all')

const selectedTenantCode = ref('')

const totalCashBalance = computed(() => {

  return wallets.value.reduce(
    (sum, wallet) => {
      return sum + Number(wallet.cashBalance || 0)
    },
    0
  )
})

const totalCashLoaded = computed(() => {

  return wallets.value.reduce(
    (sum, wallet) => {
      return sum + Number(wallet.totalCashLoaded || 0)
    },
    0
  )
})

const totalSmsBalance = computed(() => {

  return wallets.value.reduce(
    (sum, wallet) => {
      return sum + Number(wallet.smsBalance || 0)
    },
    0
  )
})

const totalSmsUsed = computed(() => {

  return wallets.value.reduce(
    (sum, wallet) => {
      return sum + Number(wallet.totalSmsUsed || 0)
    },
    0
  )
})

const filteredWallets = computed(() => {

  const search =
    searchTerm.value
      .trim()
      .toLowerCase()

  return wallets.value.filter((wallet) => {

    const matchesSearch =
      !search ||
      wallet.schoolName
        ?.toLowerCase()
        .includes(search) ||
      wallet.tenantCode
        ?.toLowerCase()
        .includes(search)

    const matchesStatus =
      walletStatusFilter.value === 'all' ||
      wallet.status === walletStatusFilter.value

    return matchesSearch && matchesStatus
  })
})

const filteredTransactions = computed(() => {

  const search =
    transactionSearchTerm.value
      .trim()
      .toLowerCase()

  return transactions.value.filter((transaction) => {

    const matchesType =
      transactionTypeFilter.value === 'all' ||
      transaction.type === transactionTypeFilter.value

    const matchesSearch =
      !search ||
      transaction.tenantCode
        ?.toLowerCase()
        .includes(search) ||
      transaction.description
        ?.toLowerCase()
        .includes(search) ||
      transaction.reference
        ?.toLowerCase()
        .includes(search)

    return matchesType && matchesSearch
  })
})

function showToast(
  severity,
  summary,
  detail
) {
  toast.add({
    severity,
    summary,
    detail,
    life: 4000,
  })
}

function money(value) {

  return Number(value || 0)
    .toFixed(2)
}

function normalizeStatus(value) {

  return String(value || '')
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
}

function formatTransactionType(value) {

  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => {
      return letter.toUpperCase()
    })
}

function formatDate(value) {

  if (!value) {
    return '-'
  }

  try {

    return new Date(value)
      .toLocaleDateString()

  } catch (error) {

    return value
  }
}

function formatDateTime(value) {

  if (!value) {
    return '-'
  }

  try {

    return new Date(value)
      .toLocaleString()

  } catch (error) {

    return value
  }
}

const loadWallets = async () => {

  try {

    loading.value = true

    const response =
      await getSmsWallets()

    wallets.value =
      response.data || []

  } catch (error) {



    showToast(
      'error',
      'Error',
      error?.response?.data?.message ||
      'Failed to load SMS wallets.'
    )

  } finally {

    loading.value = false
  }
}

const loadAllTransactions = async () => {

  try {

    transactionsLoading.value = true

    const response =
      await getSmsWalletTransactions()

    transactions.value =
      response.data || []

  } catch (error) {



    showToast(
      'error',
      'Error',
      error?.response?.data?.message ||
      'Failed to load wallet transactions.'
    )

  } finally {

    transactionsLoading.value = false
  }
}

const selectWallet = async (wallet) => {

  selectedTenantCode.value =
    wallet.tenantCode

  try {

    transactionsLoading.value = true

    const response =
      await getSmsWalletTransactionsByTenantCode(
        wallet.tenantCode
      )

    transactions.value =
      response.data || []

  } catch (error) {



    showToast(
      'error',
      'Error',
      error?.response?.data?.message ||
      'Failed to load this wallet history.'
    )

  } finally {

    transactionsLoading.value = false
  }
}

const clearSelectedWallet = async () => {

  selectedTenantCode.value = ''

  await loadAllTransactions()
}

const loadDashboardData = async () => {

  await Promise.all([
    loadWallets(),
    loadAllTransactions(),
  ])
}

onMounted(async () => {

  await loadDashboardData()

})
</script>

<style scoped>
.wallet-page {
  display: grid;
  gap: 24px;
}

/* =========================
   HERO
========================= */

.wallet-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 34px;
  border-radius: 30px;
  color: #ffffff;
  background:
    radial-gradient(
      circle at top left,
      rgba(245, 213, 140, 0.26),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #071926,
      #0f2742
    );
  box-shadow:
    0 24px 70px rgba(15, 23, 42, 0.18);
}

.wallet-badge {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #f5d58c;
  color: #071926;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.wallet-hero h1 {
  margin: 0;
  color: papayawhip;
  font-size: 39px;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.wallet-hero p {
  max-width: 700px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
}

.hero-balance-card {
  min-width: 260px;
  align-self: stretch;
  display: grid;
  align-content: center;
  gap: 8px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.hero-balance-card span,
.hero-balance-card small {
  color: rgba(255, 255, 255, 0.76);
}

.hero-balance-card strong {
  color: #f5d58c;
  font-size: 34px;
  font-weight: 950;
}

/* =========================
   SUMMARY
========================= */

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.summary-card {
  padding: 22px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow:
    0 14px 40px rgba(15, 23, 42, 0.07);
}

.summary-card span {
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-card strong {
  display: block;
  margin-top: 8px;
  color: #111827;
  font-size: 25px;
  font-weight: 950;
}

.summary-card small {
  color: #64748b;
}

/* =========================
   CARDS
========================= */

.wallet-card {
  padding: 26px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow:
    0 16px 50px rgba(15, 23, 42, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.card-header h2 {
  margin: 0;
  color: #111827;
  font-size: 21px;
  font-weight: 950;
}

.card-header p {
  margin: 7px 0 0;
  color: #64748b;
  line-height: 1.6;
}

/* =========================
   TOOLBARS
========================= */

.toolbar,
.transaction-toolbar {
  display: grid;
  grid-template-columns: 1fr 220px 150px;
  gap: 14px;
  align-items: center;
}

.transaction-toolbar {
  grid-template-columns: 1fr 220px;
  margin-bottom: 20px;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input,
.toolbar select,
.transaction-toolbar select {
  width: 100%;
  height: 48px;
  border: 1px solid #e5e7eb;
  border-radius: 15px;
  outline: none;
  background: #ffffff;
  color: #111827;
}

.search-box input {
  padding: 0 14px 0 42px;
}

.toolbar select,
.transaction-toolbar select {
  padding: 0 14px;
}

.search-box input:focus,
.toolbar select:focus,
.transaction-toolbar select:focus {
  border-color: #c99635;
  box-shadow:
    0 0 0 4px rgba(201, 150, 53, 0.13);
}

/* =========================
   BUTTONS
========================= */

.refresh-btn,
.clear-btn,
.view-btn {
  border: none;
  cursor: pointer;
  font-weight: 950;
  transition: 0.25s ease;
}

.refresh-btn {
  height: 48px;
  border-radius: 15px;
  color: #071926;
  background:
    linear-gradient(
      135deg,
      #f5d58c,
      #c99635
    );
}

.clear-btn {
  padding: 12px 16px;
  border-radius: 14px;
  color: #071926;
  background: #f5d58c;
}

.view-btn {
  height: 36px;
  border-radius: 12px;
  color: #071926;
  background: #f5d58c;
}

.refresh-btn:hover,
.clear-btn:hover,
.view-btn:hover {
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* =========================
   WALLET TABLE
========================= */

.table-wrapper {
  display: grid;
  gap: 8px;
}

.wallet-table {
  display: grid;
  grid-template-columns:
    1.4fr
    1fr
    0.9fr
    0.85fr
    0.9fr
    0.7fr
    0.8fr;
  gap: 14px;
  align-items: center;
  padding: 15px 16px;
  border-radius: 16px;
}

.wallet-table-head {
  background: #0f2742;
  color: #ffffff;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.wallet-table-row {
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.wallet-table-row.selected {
  border-color: #c99635;
  background: #fff7df;
}

.wallet-table-row strong {
  color: #111827;
}

.wallet-table-row small {
  display: block;
  margin-top: 4px;
  color: #64748b;
}

/* =========================
   STATUS PILLS
========================= */

.status-pill,
.type-pill {
  display: inline-flex;
  justify-content: center;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 950;
  text-transform: capitalize;
}

.active,
.cash-credit {
  color: #065f46;
  background: #d1fae5;
}

.cash-debit,
.sms-debit {
  color: #991b1b;
  background: #fee2e2;
}

.sms-credit {
  color: #1d4ed8;
  background: #dbeafe;
}

.refund {
  color: #92400e;
  background: #fef3c7;
}

.adjustment {
  color: #581c87;
  background: #f3e8ff;
}

.suspended {
  color: #374151;
  background: #e5e7eb;
}

/* =========================
   STATES
========================= */

.empty-state {
  padding: 30px;
  border-radius: 18px;
  color: #64748b;
  background: #f9fafb;
  text-align: center;
  font-weight: 800;
}

/* =========================
   TRANSACTIONS
========================= */

.transaction-header {
  align-items: center;
}

.transaction-list {
  display: grid;
  gap: 14px;
}

.transaction-card {
  padding: 18px;
  border-radius: 20px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.transaction-top {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.transaction-top h3 {
  margin: 10px 0 4px;
  color: #111827;
  font-size: 16px;
  font-weight: 950;
}

.transaction-top small {
  color: #64748b;
}

.transaction-amount strong {
  color: #111827;
  font-size: 20px;
  font-weight: 950;
}

.transaction-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.transaction-grid div {
  padding: 13px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #eef2f7;
}

.transaction-grid span,
.reference-box span {
  display: block;
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.transaction-grid strong,
.reference-box strong {
  display: block;
  margin-top: 6px;
  color: #111827;
  font-weight: 950;
}

.reference-box {
  margin-top: 14px;
  padding: 13px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #eef2f7;
  overflow-wrap: anywhere;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1200px) {
  .wallet-hero {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar,
  .transaction-toolbar {
    grid-template-columns: 1fr;
  }

  .wallet-table {
    grid-template-columns: 1fr;
  }

  .transaction-top {
    flex-direction: column;
  }

  .transaction-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .wallet-hero {
    padding: 24px;
  }

  .wallet-hero h1 {
    font-size: 30px;
  }

  .summary-grid,
  .transaction-grid {
    grid-template-columns: 1fr;
  }

  .wallet-card {
    padding: 22px;
  }
}
</style>
