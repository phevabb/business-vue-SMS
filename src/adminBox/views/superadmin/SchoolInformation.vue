<template>
  <CCard class="mb-4 shadow-sm border-0">
    <CCardHeader class="bg-white d-flex justify-content-between align-items-center">
      <div>
        <h5 class="mb-0 fw-semibold">School Information</h5>
        <small class="text-muted">Current school and billing summary</small>
      </div>

      <CBadge :color="school.status === 'ACTIVE' ? 'success' : 'secondary'" shape="rounded-pill">
        {{ school.status }}
      </CBadge>
    </CCardHeader>

    <CCardBody>
      <CRow class="g-3">
        <CCol xs="12" md="6" lg="4">
          <div class="info-box">
            <small class="text-muted">School Name</small>
            <div class="fw-semibold">{{ school.schoolName }}</div>
          </div>
        </CCol>

        <CCol xs="12" md="6" lg="4">
          <div class="info-box">
            <small class="text-muted">Tenant Code</small>
            <div class="fw-semibold text-primary">{{ school.tenantCode }}</div>
          </div>
        </CCol>

        <CCol xs="12" md="6" lg="4">
          <div class="info-box">
            <small class="text-muted">Current Term</small>
            <div class="fw-semibold">{{ school.currentTerm }}</div>
          </div>
        </CCol>

        <CCol xs="12" md="6" lg="4">
          <div class="info-box">
            <small class="text-muted">Total Students</small>
            <div class="fw-semibold">{{ school.studentCount }}</div>
          </div>
        </CCol>

        <CCol xs="12" md="6" lg="4">
          <div class="info-box">
            <small class="text-muted">Billing Rate</small>
            <div class="fw-semibold">
              GH₵{{ school.billingRatePerStudent }} / student
            </div>
          </div>
        </CCol>

        <CCol xs="12" md="6" lg="4">
          <div class="info-box">
            <small class="text-muted">Estimated Current Bill</small>
            <div class="fw-semibold text-success">
              GH₵{{ estimatedBill.toLocaleString() }}
            </div>
          </div>
        </CCol>
      </CRow>

      <hr />

      <div class="d-flex justify-content-end gap-2">
        <CButton color="secondary" variant="outline" @click="refreshGeneratedData">
          Refresh
        </CButton>

        <CButton color="primary" @click="generateManualInvoice">
          Generate Manual Invoice
        </CButton>
      </div>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { computed, ref } from 'vue'

const school = ref({
  schoolName: 'Phena Vision Academy',
  tenantCode: 'PHEVAB-327146',
  currentTerm: '2025/2026 - Term 2',
  studentCount: 119,
  billingRatePerStudent: 5,
  status: 'ACTIVE',
})

const estimatedBill = computed(() => {
  const studentCount = Number(school.value.studentCount || 0)
  const rate = Number(school.value.billingRatePerStudent || 0)

  return studentCount * rate
})

const refreshGeneratedData = () => {
  const generatedStudentCount = Math.floor(Math.random() * 300) + 50

  school.value = {
    ...school.value,
    studentCount: generatedStudentCount,
  }


}

const generateManualInvoice = () => {
  const payload = {
    tenantCode: school.value.tenantCode,
  }




  alert(`Manual invoice generated for ${school.value.schoolName}`)
}
</script>

<style scoped>
/* Main premium card animation */
:deep(.card) {
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow:
    0 20px 45px rgba(15, 23, 42, 0.08),
    0 8px 18px rgba(15, 23, 42, 0.04);
  animation: premiumFadeUp 0.55s ease both;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

:deep(.card:hover) {
  transform: translateY(-3px);
  box-shadow:
    0 28px 65px rgba(15, 23, 42, 0.12),
    0 12px 28px rgba(37, 99, 235, 0.06);
}

/* Premium header */
:deep(.card-header) {
  padding: 22px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 35%),
    linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
}

:deep(.card-header h5) {
  color: #0f172a;
  font-size: 1.08rem;
  font-weight: 850;
  letter-spacing: -0.02em;
}

:deep(.card-header small) {
  color: #64748b !important;
  font-weight: 500;
}

/* Card body */
:deep(.card-body) {
  padding: 24px;
}

/* Premium info box */
.info-box {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.96));
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 18px;
  padding: 16px 18px;
  min-height: 88px;
  box-shadow:
    0 12px 30px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
  animation: premiumScaleIn 0.45s ease both;
}

/* Subtle gradient glow */
.info-box::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 38%),
    radial-gradient(circle at bottom left, rgba(124, 58, 237, 0.1), transparent 35%);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

/* Small premium accent line */
.info-box::after {
  content: "";
  position: absolute;
  left: 0;
  top: 18px;
  width: 4px;
  height: 42px;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(180deg, #2563eb, #7c3aed);
  opacity: 0.85;
  transition:
    height 0.25s ease,
    opacity 0.25s ease;
}

/* Hover effect */
.info-box:hover {
  transform: translateY(-5px);
  border-color: rgba(37, 99, 235, 0.25);
  background:
    linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  box-shadow:
    0 22px 45px rgba(15, 23, 42, 0.09),
    0 8px 18px rgba(37, 99, 235, 0.08);
}

.info-box:hover::before {
  opacity: 1;
}

.info-box:hover::after {
  height: 52px;
  opacity: 1;
}

/* Label text */
.info-box small {
  position: relative;
  z-index: 1;
  display: block;
  color: #64748b !important;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 8px;
}

/* Value text */
.info-box .fw-semibold {
  position: relative;
  z-index: 1;
  color: #0f172a;
  font-size: 1.02rem;
  font-weight: 850 !important;
  letter-spacing: -0.01em;
}

/* Tenant code premium pill feel */
.info-box .text-primary {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  background: #eff6ff;
  color: #1d4ed8 !important;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.92rem;
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.08);
}

/* Estimated bill highlight */
.info-box .text-success {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  background: #ecfdf5;
  color: #047857 !important;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 1rem;
  box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.12);
}

/* Status badge */
:deep(.badge) {
  padding: 8px 13px;
  font-weight: 850;
  letter-spacing: 0.03em;
  box-shadow: 0 8px 18px rgba(22, 163, 74, 0.18);
}

/* Divider */
hr {
  margin: 24px 0;
  border-color: rgba(226, 232, 240, 0.9);
}

/* Premium buttons */
:deep(.btn) {
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

:deep(.btn:hover) {
  transform: translateY(-2px);
}

:deep(.btn-primary) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border: none;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.3);
}

:deep(.btn-primary:hover) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.38);
}

:deep(.btn-outline-secondary) {
  color: #334155;
  border-color: #cbd5e1;
  background: #ffffff;
}

:deep(.btn-outline-secondary:hover) {
  color: #0f172a;
  background: #f8fafc;
  border-color: #94a3b8;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

/* Staggered animation for info boxes */
:deep(.col:nth-child(1)) .info-box {
  animation-delay: 0.04s;
}

:deep(.col:nth-child(2)) .info-box {
  animation-delay: 0.08s;
}

:deep(.col:nth-child(3)) .info-box {
  animation-delay: 0.12s;
}

:deep(.col:nth-child(4)) .info-box {
  animation-delay: 0.16s;
}

:deep(.col:nth-child(5)) .info-box {
  animation-delay: 0.2s;
}

:deep(.col:nth-child(6)) .info-box {
  animation-delay: 0.24s;
}

/* Animations */
@keyframes premiumFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes premiumScaleIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive polish */
@media (max-width: 768px) {
  :deep(.card-header) {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }

  :deep(.card-body) {
    padding: 18px;
  }

  .info-box {
    min-height: 82px;
  }

  :deep(.btn) {
    width: 100%;
  }

  :deep(.card-body > .d-flex) {
    flex-direction: column;
  }
}
</style>
