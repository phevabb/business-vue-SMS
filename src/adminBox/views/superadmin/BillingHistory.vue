<template>
  <section class="billing-history-card">
    <!-- Header -->
    <div class="billing-history-header">
      <div>
        <div class="section-eyebrow">Invoice Records</div>

        <h2>Billing History</h2>

        <p>
          Previous invoices generated for this school.
        </p>
      </div>

      <Tag
        :value="`${invoices.length} invoice${invoices.length === 1 ? '' : 's'}`"
        severity="info"
        rounded
        class="invoice-count-tag"
      />
    </div>

    <!-- Empty State -->
    <div v-if="invoices.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="pi pi-file"></i>
      </div>

      <h3>No billing history found</h3>

      <p>
        Generated invoices will appear here once manual billing is performed.
      </p>
    </div>

    <!-- Invoice Table -->
    <DataTable
      v-else
      :value="invoices"
      dataKey="id"
      responsiveLayout="scroll"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      class="premium-invoice-table"
    >
      <Column header="#">
        <template #body="{ index }">
          <span class="row-number">
            {{ index + 1 }}
          </span>
        </template>
      </Column>

      <Column header="Invoice No.">
        <template #body="{ data }">
          <div class="invoice-number">
            {{ data.invoiceNumber }}
          </div>
        </template>
      </Column>

      <Column header="Term">
        <template #body="{ data }">
          <span class="term-pill">
            {{ data.term }}
          </span>
        </template>
      </Column>

      <Column header="Students">
        <template #body="{ data }">
          <div class="student-count">
            {{ Number(data.studentCount || 0).toLocaleString() }}
          </div>

          <small class="muted-text">students</small>
        </template>
      </Column>

      <Column header="Amount">
        <template #body="{ data }">
          <div class="amount-text">
            GH₵{{ Number(data.amount || 0).toLocaleString() }}
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

      <Column header="Issued Date">
        <template #body="{ data }">
          <div class="date-text">
            {{ formatDate(data.issuedDate) }}
          </div>
        </template>
      </Column>

      <Column header="Due Date">
        <template #body="{ data }">
          <div class="date-text">
            {{ formatDate(data.dueDate) }}
          </div>
        </template>
      </Column>

      <Column header="Action">
        <template #body="{ data }">
          <div class="action-cell">
            <Button
              label="View"
              icon="pi pi-eye"
              class="view-invoice-button"
              @click="$emit('view-invoice', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<script setup>
defineProps({
  invoices: {
    type: Array,
    required: true,
    default: () => [],
  },
})

defineEmits(['view-invoice'])

const getStatusSeverity = (status) => {
  switch (status) {
    case 'PAID':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'OVERDUE':
      return 'danger'
    case 'CANCELLED':
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
</script>

<style scoped>
.billing-history-card {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  animation: premiumRise 0.55s ease both;
}

.billing-history-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.07), transparent 30%),
    radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.06), transparent 32%);
  pointer-events: none;
}

.billing-history-header {
  position: relative;
  z-index: 2;
  padding: 26px 28px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.section-eyebrow {
  margin-bottom: 7px;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.billing-history-header h2 {
  margin: 0 0 5px;
  color: #0f172a;
  font-size: 1.28rem;
  font-weight: 950;
  letter-spacing: -0.035em;
}

.billing-history-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.55;
}

:deep(.invoice-count-tag) {
  padding: 0.55rem 0.82rem;
  font-weight: 950;
  letter-spacing: 0.02em;
}

/* Empty State */
.empty-state {
  position: relative;
  z-index: 2;
  margin: 24px;
  padding: 72px 24px;
  text-align: center;
  border-radius: 28px;
  border: 1px dashed #cbd5e1;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.07), transparent 34%),
    #f8fafc;
}

.empty-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  border-radius: 28px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.65rem;
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.28);
  animation: softFloat 2.4s ease-in-out infinite;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-weight: 950;
}

.empty-state p {
  margin: 0;
  color: #64748b;
}

/* PrimeVue DataTable */
:deep(.premium-invoice-table) {
  position: relative;
  z-index: 2;
  padding: 24px 28px 28px;
}

:deep(.premium-invoice-table .p-datatable-wrapper) {
  border: 1px solid #eef2f7;
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.04);
}

:deep(.premium-invoice-table .p-datatable-thead > tr > th) {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  padding: 18px;
  border-color: #e2e8f0;
  font-size: 0.73rem;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

:deep(.premium-invoice-table .p-datatable-tbody > tr) {
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.premium-invoice-table .p-datatable-tbody > tr > td) {
  padding: 19px 18px;
  border-color: #f1f5f9;
  vertical-align: middle;
}

:deep(.premium-invoice-table .p-datatable-tbody > tr:hover) {
  background: #f8fbff;
  box-shadow: inset 4px 0 0 #2563eb;
}

:deep(.premium-invoice-table .p-paginator) {
  border: 0;
  padding: 18px 0 0;
  background: transparent;
}

:deep(.premium-invoice-table .p-paginator .p-paginator-page),
:deep(.premium-invoice-table .p-paginator .p-paginator-next),
:deep(.premium-invoice-table .p-paginator .p-paginator-prev),
:deep(.premium-invoice-table .p-paginator .p-paginator-first),
:deep(.premium-invoice-table .p-paginator .p-paginator-last) {
  border-radius: 999px;
}

/* Table Content */
.row-number {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #334155;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.invoice-number {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.84rem;
  font-weight: 950;
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.1);
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

.student-count {
  color: #0f172a;
  font-weight: 950;
}

.amount-text {
  color: #047857;
  font-weight: 950;
  white-space: nowrap;
}

.date-text {
  color: #0f172a;
  font-weight: 850;
  white-space: nowrap;
}

.muted-text {
  color: #64748b;
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

:deep(.view-invoice-button) {
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  font-weight: 950;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 13px 28px rgba(37, 99, 235, 0.24);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.view-invoice-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.34);
}

/* Animations */
@keyframes premiumRise {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes softFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-7px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .billing-history-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 22px;
  }

  :deep(.premium-invoice-table) {
    padding: 18px;
  }

  .empty-state {
    margin: 18px;
    padding: 54px 18px;
  }
}
</style>
