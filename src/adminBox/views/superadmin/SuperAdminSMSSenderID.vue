<template>
  <div class="sender-page">

    <!-- HERO -->
    <section class="sender-hero">
      <div>
        <span class="sender-badge">
          Super Admin SMS
        </span>

        <h1>Sender ID Approvals</h1>

        <p>
          Review, approve, reject, or delete SMS sender ID requests submitted by schools.
        </p>
      </div>

      <div class="hero-stat-card">
        <span>Pending Requests</span>

        <strong>
          {{ pendingCount }}
        </strong>

        <small>
          Awaiting approval
        </small>
      </div>
    </section>

    <!-- SUMMARY -->
    <section class="summary-grid">

      <div class="summary-card">
        <span>Total Requests</span>
        <strong>{{ senderIds.length }}</strong>
        <small>All sender IDs</small>
      </div>

      <div class="summary-card">
        <span>Pending</span>
        <strong>{{ pendingCount }}</strong>
        <small>Need action</small>
      </div>

      <div class="summary-card">
        <span>Approved</span>
        <strong>{{ approvedCount }}</strong>
        <small>Ready for SMS</small>
      </div>

      <div class="summary-card">
        <span>Rejected</span>
        <strong>{{ rejectedCount }}</strong>
        <small>Declined requests</small>
      </div>

    </section>

    <!-- FILTERS -->
    <section class="sender-card">

      <div class="toolbar">

        <div class="search-box">
          <i class="pi pi-search"></i>

          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search school, tenant code, or sender ID..."
          >
        </div>

        <select v-model="statusFilter">
          <option value="all">
            All Statuses
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>

          <option value="suspended">
            Suspended
          </option>
        </select>

        <button
          class="refresh-btn"
          type="button"
          :disabled="loading"
          @click="loadSenderIds"
        >
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>

      </div>

    </section>

    <!-- TABLE -->
    <section class="sender-card">

      <div class="card-header">
        <div>
          <h2>Sender ID Requests</h2>

          <p>
            Manage all school SMS sender ID requests from this dashboard.
          </p>
        </div>
      </div>

      <div
        v-if="loading"
        class="empty-state"
      >
        Loading sender ID requests...
      </div>

      <div
        v-else-if="filteredSenderIds.length === 0"
        class="empty-state"
      >
        No sender ID requests found.
      </div>

      <div
        v-else
        class="table-wrapper"
      >

        <div class="sender-table sender-table-head">
          <span>School</span>
          <span>Tenant Code</span>
          <span>Sender ID</span>
          <span>Status</span>
          <span>Requested</span>
          <span>Actions</span>
        </div>

        <div
          v-for="item in filteredSenderIds"
          :key="item.id"
          class="sender-table sender-table-row"
        >
          <div>
            <strong>{{ item.schoolName }}</strong>

            <small>
              {{ item.reason || 'No reason provided' }}
            </small>
          </div>

          <span>
            {{ item.tenantCode }}
          </span>

          <strong class="sender-id-text">
            {{ item.senderId }}
          </strong>

          <span
            class="status-pill"
            :class="normalizeStatus(item.status)"
          >
            {{ item.status }}
          </span>

          <span>
            {{ formatDate(item.requestedAt) }}
          </span>

          <div class="action-buttons">

            <button
              v-if="item.status === 'pending'"
              class="approve-btn"
              type="button"
              @click="openApproveModal(item)"
            >
              Approve
            </button>

            <button
              v-if="item.status === 'pending'"
              class="reject-btn"
              type="button"
              @click="openRejectModal(item)"
            >
              Reject
            </button>

            <button
              class="delete-btn"
              type="button"
              @click="openDeleteModal(item)"
            >
              Delete
            </button>

          </div>
        </div>

      </div>

    </section>

    <!-- APPROVE MODAL -->
    <div
      v-if="approveModal.visible"
      class="modal-backdrop"
    >
      <div class="modal-card">

        <div class="modal-icon approve-icon">
          ✓
        </div>

        <h3>Approve Sender ID?</h3>

        <p>
          This will mark the sender ID as approved. Make sure you have already
          created or approved this sender ID manually on mNotify.
        </p>

        <div class="modal-summary">
          <span>Sender ID</span>
          <strong>{{ approveModal.item?.senderId }}</strong>
        </div>

        <div class="modal-summary">
          <span>School</span>
          <strong>{{ approveModal.item?.schoolName }}</strong>
        </div>

        <div class="modal-actions">
          <button
            class="cancel-btn"
            type="button"
            :disabled="actionLoading"
            @click="closeApproveModal"
          >
            Cancel
          </button>

          <button
            class="confirm-approve-btn"
            type="button"
            :disabled="actionLoading"
            @click="confirmApproveSenderId"
          >
            {{ actionLoading ? 'Approving...' : 'Approve Sender ID' }}
          </button>
        </div>

      </div>
    </div>

    <!-- REJECT MODAL -->
    <div
      v-if="rejectModal.visible"
      class="modal-backdrop"
    >
      <div class="modal-card">

        <div class="modal-icon reject-icon">
          !
        </div>

        <h3>Reject Sender ID?</h3>

        <p>
          Provide a clear reason so the school understands why the sender ID was rejected.
        </p>

        <div class="modal-summary">
          <span>Sender ID</span>
          <strong>{{ rejectModal.item?.senderId }}</strong>
        </div>

        <div class="field">
          <label>Rejection Reason</label>

          <textarea
            v-model="rejectModal.reason"
            rows="4"
            placeholder="Example: Sender ID is too similar to another brand."
          />
        </div>

        <div class="modal-actions">
          <button
            class="cancel-btn"
            type="button"
            :disabled="actionLoading"
            @click="closeRejectModal"
          >
            Cancel
          </button>

          <button
            class="confirm-reject-btn"
            type="button"
            :disabled="actionLoading"
            @click="confirmRejectSenderId"
          >
            {{ actionLoading ? 'Rejecting...' : 'Reject Sender ID' }}
          </button>
        </div>

      </div>
    </div>

    <!-- DELETE MODAL -->
    <div
      v-if="deleteModal.visible"
      class="modal-backdrop"
    >
      <div class="modal-card">

        <div class="modal-icon delete-icon">
          !
        </div>

        <h3>Delete Sender ID Request?</h3>

        <p>
          This action will permanently remove the sender ID request.
        </p>

        <div class="modal-summary">
          <span>Sender ID</span>
          <strong>{{ deleteModal.item?.senderId }}</strong>
        </div>

        <div class="modal-summary">
          <span>School</span>
          <strong>{{ deleteModal.item?.schoolName }}</strong>
        </div>

        <div class="modal-actions">
          <button
            class="cancel-btn"
            type="button"
            :disabled="actionLoading"
            @click="closeDeleteModal"
          >
            Cancel
          </button>

          <button
            class="confirm-delete-btn"
            type="button"
            :disabled="actionLoading"
            @click="confirmDeleteSenderId"
          >
            {{ actionLoading ? 'Deleting...' : 'Yes, Delete' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, reactive, ref } from 'vue'

import {
    approveSenderId,
    deleteSenderId,
    getAllSenderIds,
    rejectSenderId,
} from '@/adminBox/services/superadminApi.js'

const toast = useToast()

const loading = ref(false)
const actionLoading = ref(false)

const searchTerm = ref('')
const statusFilter = ref('all')

const senderIds = ref([])

const approveModal = reactive({
  visible: false,
  item: null,
})

const rejectModal = reactive({
  visible: false,
  item: null,
  reason: '',
})

const deleteModal = reactive({
  visible: false,
  item: null,
})

const pendingCount = computed(() => {
  return senderIds.value.filter((item) => {
    return item.status === 'pending'
  }).length
})

const approvedCount = computed(() => {
  return senderIds.value.filter((item) => {
    return item.status === 'approved'
  }).length
})

const rejectedCount = computed(() => {
  return senderIds.value.filter((item) => {
    return item.status === 'rejected'
  }).length
})

const filteredSenderIds = computed(() => {
  const search =
    searchTerm.value.trim().toLowerCase()

  return senderIds.value.filter((item) => {
    const matchesStatus =
      statusFilter.value === 'all' ||
      item.status === statusFilter.value

    const matchesSearch =
      !search ||
      item.schoolName?.toLowerCase().includes(search) ||
      item.tenantCode?.toLowerCase().includes(search) ||
      item.senderId?.toLowerCase().includes(search)

    return matchesStatus && matchesSearch
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

function normalizeStatus(status) {
  return String(status || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  try {
    return new Date(value).toLocaleDateString()
  } catch (error) {
    return value
  }
}

const loadSenderIds = async () => {

  try {

    loading.value = true

    const response =
      await getAllSenderIds()



    senderIds.value =
      response || []

  } catch (error) {



    showToast(
      'error',
      'Error',
      error?.response?.data?.message ||
      'Failed to load sender ID requests.'
    )

  } finally {

    loading.value = false
  }
}

const openApproveModal = (item) => {
  approveModal.item = item
  approveModal.visible = true
}

const closeApproveModal = () => {
  if (actionLoading.value) {
    return
  }

  approveModal.item = null
  approveModal.visible = false
}

const confirmApproveSenderId = async () => {

  if (!approveModal.item) {
    return
  }

  try {

    actionLoading.value = true

    await approveSenderId(
      approveModal.item.id
    )
    closeApproveModal()

    showToast(
      'success',
      'Approved',
      'Sender ID approved successfully.'
    )



    await loadSenderIds()

  } catch (error) {



    showToast(
      'error',
      'Approval Failed',
      error?.response?.data?.message ||
      'Failed to approve sender ID.'
    )

  } finally {
    approveModal.visible = false
    closeApproveModal()

    actionLoading.value = false
  }
}

const openRejectModal = (item) => {
  rejectModal.item = item
  rejectModal.reason = ''
  rejectModal.visible = true
}

const closeRejectModal = () => {
  if (actionLoading.value) {
    return
  }

  rejectModal.item = null
  rejectModal.reason = ''
  rejectModal.visible = false
}

const confirmRejectSenderId = async () => {

  if (!rejectModal.item) {
    return
  }

  const reason =
    rejectModal.reason.trim()

  if (!reason) {

    showToast(
      'warn',
      'Validation',
      'Please provide a rejection reason.'
    )

    return
  }

  try {

    actionLoading.value = true

    await rejectSenderId(
      rejectModal.item.id,
      {
        rejectionReason: reason,
      }
    )

    showToast(
      'success',
      'Rejected',
      'Sender ID rejected successfully.'
    )

    closeRejectModal()

    await loadSenderIds()

  } catch (error) {



    showToast(
      'error',
      'Reject Failed',
      error?.response?.data?.message ||
      'Failed to reject sender ID.'
    )

  } finally {

    actionLoading.value = false
  }
}

const openDeleteModal = (item) => {
  deleteModal.item = item
  deleteModal.visible = true
}

const closeDeleteModal = () => {
  if (actionLoading.value) {
    return
  }

  deleteModal.item = null
  deleteModal.visible = false
}

const confirmDeleteSenderId = async () => {

  if (!deleteModal.item) {
    return
  }

  try {

    actionLoading.value = true

    await deleteSenderId(
      deleteModal.item.tenantCode,
      deleteModal.item.id
    )

    showToast(
      'success',
      'Deleted',
      'Sender ID request deleted successfully.'
    )

    closeDeleteModal()

    await loadSenderIds()

  } catch (error) {



    showToast(
      'error',
      'Delete Failed',
      error?.response?.data?.message ||
      'Failed to delete sender ID.'
    )

  } finally {

    actionLoading.value = false
  }
}

onMounted(async () => {
  await loadSenderIds()
})
</script>

<style scoped>
.sender-page {
  display: grid;
  gap: 24px;
}

.sender-hero {
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

.sender-badge {
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

.sender-hero h1 {
  margin: 0;
  color: papayawhip;
  font-size: 39px;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.sender-hero p {
  max-width: 680px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
}

.hero-stat-card {
  min-width: 230px;
  align-self: stretch;
  display: grid;
  align-content: center;
  gap: 8px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.hero-stat-card span,
.hero-stat-card small {
  color: rgba(255, 255, 255, 0.76);
}

.hero-stat-card strong {
  color: #f5d58c;
  font-size: 42px;
  font-weight: 950;
}

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
  font-size: 26px;
  font-weight: 950;
}

.summary-card small {
  color: #64748b;
}

.sender-card {
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

.toolbar {
  display: grid;
  grid-template-columns: 1fr 220px 150px;
  gap: 14px;
  align-items: center;
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
.toolbar select {
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

.toolbar select {
  padding: 0 14px;
}

.search-box input:focus,
.toolbar select:focus {
  border-color: #c99635;
  box-shadow:
    0 0 0 4px rgba(201, 150, 53, 0.13);
}

.refresh-btn {
  height: 48px;
  border: none;
  border-radius: 15px;
  color: #071926;
  background:
    linear-gradient(
      135deg,
      #f5d58c,
      #c99635
    );
  font-weight: 950;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.table-wrapper {
  display: grid;
  gap: 8px;
}

.sender-table {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.8fr 0.7fr 0.8fr 1.2fr;
  gap: 14px;
  align-items: center;
  padding: 15px 16px;
  border-radius: 16px;
}

.sender-table-head {
  background: #0f2742;
  color: #ffffff;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sender-table-row {
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.sender-table-row strong {
  color: #111827;
}

.sender-table-row small {
  display: block;
  color: #64748b;
  margin-top: 4px;
  line-height: 1.4;
}

.sender-id-text {
  letter-spacing: 0.03em;
}

.status-pill {
  display: inline-flex;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 950;
}

.pending {
  color: #92400e;
  background: #fef3c7;
}

.approved {
  color: #065f46;
  background: #d1fae5;
}

.rejected {
  color: #991b1b;
  background: #fee2e2;
}

.suspended {
  color: #374151;
  background: #e5e7eb;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.approve-btn,
.reject-btn,
.delete-btn {
  height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 11px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  transition: 0.25s ease;
}

.approve-btn {
  color: #065f46;
  background: #d1fae5;
}

.reject-btn {
  color: #92400e;
  background: #fef3c7;
}

.delete-btn {
  color: #991b1b;
  background: #fee2e2;
}

.approve-btn:hover,
.reject-btn:hover,
.delete-btn:hover {
  transform: translateY(-1px);
}

.empty-state {
  padding: 30px;
  border-radius: 18px;
  color: #64748b;
  background: #f9fafb;
  text-align: center;
  font-weight: 800;
}

.field {
  display: grid;
  gap: 8px;
  margin: 18px 0;
  text-align: left;
}

.field label {
  color: #374151;
  font-size: 13px;
  font-weight: 900;
}

.field textarea {
  width: 100%;
  min-height: 120px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 15px;
  outline: none;
  resize: vertical;
}

.field textarea:focus {
  border-color: #c99635;
  box-shadow:
    0 0 0 4px rgba(201, 150, 53, 0.13);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
}

.modal-card {
  width: min(460px, 100%);
  padding: 28px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow:
    0 30px 90px rgba(15, 23, 42, 0.28);
  text-align: center;
}

.modal-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 24px;
  font-weight: 950;
}

.approve-icon {
  color: #065f46;
  background: #d1fae5;
}

.reject-icon,
.delete-icon {
  color: #991b1b;
  background: #fee2e2;
}

.modal-card h3 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 950;
}

.modal-card p {
  margin: 12px 0 18px;
  color: #64748b;
  line-height: 1.6;
}

.modal-summary {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
  padding: 14px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.modal-summary span {
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.modal-summary strong {
  color: #111827;
  font-size: 17px;
  font-weight: 950;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 22px;
}

.cancel-btn,
.confirm-approve-btn,
.confirm-reject-btn,
.confirm-delete-btn {
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.cancel-btn {
  color: #374151;
  background: #f3f4f6;
}

.confirm-approve-btn {
  color: #ffffff;
  background: #059669;
}

.confirm-reject-btn,
.confirm-delete-btn {
  color: #ffffff;
  background: #dc2626;
}

.cancel-btn:disabled,
.confirm-approve-btn:disabled,
.confirm-reject-btn:disabled,
.confirm-delete-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 1200px) {
  .sender-hero {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar {
    grid-template-columns: 1fr;
  }

  .sender-table {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .sender-hero {
    padding: 24px;
  }

  .sender-hero h1 {
    font-size: 30px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    grid-template-columns: 1fr;
  }
}
</style>
