<template>
  <div class="calendar-page">
    <!-- Header -->
    <section class="hero">
      <div>
        <span class="hero-badge">Billing Calendar</span>
        <h1 style="color: bisque;">Academic Year Calendar</h1>
        <p>
          Create and manage academic years, term dates, payment grace periods,
          and the ₵5.00 per student billing rule for every school.
        </p>
      </div>

      <div class="hero-actions">
        <button class="btn btn-light" @click="resetForm">
          New Calendar
        </button>
        <button class="btn btn-dark" @click="submitCalendar" :disabled="saving">
          {{ saving ? 'Saving...' : editingYearId ? 'Update Calendar' : 'Create Calendar' }}
        </button>
      </div>
    </section>

    <!-- Alerts -->
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>

    <!-- Main Grid -->
    <section class="main-grid">
      <!-- Form -->
      <div class="card form-card">
        <div class="card-header">
          <div>
            <h2>{{ editingYearId ? 'Edit Academic Year' : 'Create Academic Year' }}</h2>
            <p>
              Define the academic year and all three terms. Dates are submitted as epoch milliseconds.
            </p>
          </div>

          <span class="pill pill-blue">
            {{ form.name || 'New Year' }}
          </span>
        </div>

        <!-- Academic Year -->
        <div class="section-title">
          <span>01</span>
          <div>
            <h3>Academic Year</h3>
            <p>Example: 2027/2028</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Academic Year Name</label>
            <input
              v-model.trim="form.name"
              type="text"
              placeholder="2027/2028"
            />
          </div>

          <div class="form-group">
            <label>Academic Year Start Date</label>
            <input
              v-model="form.startDate"
              type="date"
            />
          </div>

          <div class="form-group">
            <label>Academic Year End Date</label>
            <input
              v-model="form.endDate"
              type="date"
            />
          </div>
        </div>

        <!-- Terms -->
        <div class="section-title terms-title">
          <span>02</span>
          <div>
            <h3>Terms</h3>
            <p>Each academic year must have First, Second, and Third Term.</p>
          </div>
        </div>

        <div class="term-tabs">
          <button
            v-for="(term, index) in form.terms"
            :key="term.termCode"
            class="term-tab"
            :class="{ active: activeTermIndex === index }"
            @click="activeTermIndex = index"
          >
            {{ term.termName }}
          </button>
        </div>

        <div class="term-panel">
          <div class="term-panel-header">
            <div>
              <h3>{{ activeTerm.termName }}</h3>
              <p>{{ activeTerm.termCode }} • Term {{ activeTerm.termNumber }}</p>
            </div>

            <span class="pill pill-green">
              ₵{{ activeTerm.amountPerStudentCedis }} / student
            </span>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Term Name</label>
              <input
                v-model.trim="activeTerm.termName"
                type="text"
                placeholder="First Term"
              />
            </div>

            <div class="form-group">
              <label>Term Code</label>
              <input
                v-model.trim="activeTerm.termCode"
                type="text"
                disabled
              />
            </div>

            <div class="form-group">
              <label>Amount Per Student Cedis</label>
              <input
                v-model.trim="activeTerm.amountPerStudentCedis"
                type="number"
                min="0"
                step="0.01"
                placeholder="5.00"
              />
            </div>

            <div class="form-group">
              <label>Reopening Date</label>
              <input
                v-model="activeTerm.reopeningDate"
                type="date"
              />
            </div>

            <div class="form-group">
              <label>Closing Date</label>
              <input
                v-model="activeTerm.closingDate"
                type="date"
              />
            </div>

            <div class="form-group">
              <label>Vacation Start Date</label>
              <input
                v-model="activeTerm.vacationStartDate"
                type="date"
              />
            </div>

            <div class="form-group">
              <label>Vacation End Date</label>
              <input
                v-model="activeTerm.vacationEndDate"
                type="date"
              />
            </div>

            <div class="form-group">
              <label>Grace Start Date</label>
              <input
                v-model="activeTerm.graceStartDate"
                type="date"
              />
            </div>

            <div class="form-group">
              <label>Grace End Date</label>
              <input
                v-model="activeTerm.graceEndDate"
                type="date"
              />
            </div>

            <div class="form-group">
              <label>Payment Deadline</label>
              <input
                v-model="activeTerm.paymentDeadline"
                type="date"
              />
            </div>
          </div>

          <div class="term-summary">
            <div>
              <span>Billing Rule</span>
              <strong>Students × ₵{{ activeTerm.amountPerStudentCedis || '5.00' }}</strong>
            </div>

            <div>
              <span>Grace Period</span>
              <strong>{{ activeTerm.graceStartDate || '-' }} → {{ activeTerm.graceEndDate || '-' }}</strong>
            </div>

            <div>
              <span>Deadline</span>
              <strong>{{ activeTerm.paymentDeadline || '-' }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side -->
      <div class="side-stack">
        <!-- Existing Calendars -->
        <div class="card list-card">
          <div class="card-header">
            <div>
              <h2>Academic Years</h2>
              <p>Manage existing billing calendars.</p>
            </div>

            <button class="icon-btn" @click="fetchAcademicYears" :disabled="loadingYears">
              ↻
            </button>
          </div>

          <input
            v-model="search"
            class="search-input"
            type="text"
            placeholder="Search academic year..."
          />

          <div v-if="loadingYears" class="empty-state">
            Loading academic years...
          </div>

          <div v-else-if="filteredYears.length === 0" class="empty-state">
            No academic years found.
          </div>

          <div v-else class="year-list">
            <div
              v-for="year in filteredYears"
              :key="year.id"
              class="year-item"
            >
              <div>
                <strong>{{ year.name }}</strong>
                <span>{{ formatEpoch(year.startDateEpochMillis) }} → {{ formatEpoch(year.endDateEpochMillis) }}</span>
                <small>{{ year.terms?.length || 0 }} terms</small>
              </div>

              <div class="year-actions">
                <button class="mini-btn" @click="editYear(year)">
                  Edit
                </button>
                <button class="mini-btn danger" @click="deleteYear(year)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Payload Preview -->
        <div class="card preview-card">
          <div class="card-header">
            <div>
              <h2>Payload Preview</h2>
              <p>What will be sent to `ktor-business`.</p>
            </div>

            <button class="mini-btn" @click="copyPayload">
              Copy
            </button>
          </div>

          <pre>{{ payloadPreview }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
    createAcademicYearCalendar,
    deleteAcademicYearCalendar,
    getAcademicYearCalendars,
    updateAcademicYearCalendar,
} from '@/adminBox/services/superadminApi.js'

import { computed, onMounted, reactive, ref } from 'vue'

const loadingYears = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')
const search = ref('')
const activeTermIndex = ref(0)
const editingYearId = ref(null)

const academicYears = ref([])

const form = reactive({
  name: '',
  startDate: '',
  endDate: '',
  terms: getDefaultTerms(),
})

const activeTerm = computed(() => form.terms[activeTermIndex.value])

const filteredYears = computed(() => {
  const value = search.value.trim().toLowerCase()

  if (!value) return academicYears.value

  return academicYears.value.filter((year) => {
    return [
      year.name,
      year.status,
      ...(year.terms || []).map((term) => term.termName),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(value)
  })
})

const payloadPreview = computed(() => {
  return JSON.stringify(buildPayload(), null, 2)
})

function getDefaultTerms() {
  return [
    {
      termCode: 'FIRST_TERM',
      termName: 'First Term',
      termNumber: 1,
      reopeningDate: '',
      closingDate: '',
      vacationStartDate: '',
      vacationEndDate: '',
      graceStartDate: '',
      graceEndDate: '',
      paymentDeadline: '',
      amountPerStudentCedis: '5.00',
    },
    {
      termCode: 'SECOND_TERM',
      termName: 'Second Term',
      termNumber: 2,
      reopeningDate: '',
      closingDate: '',
      vacationStartDate: '',
      vacationEndDate: '',
      graceStartDate: '',
      graceEndDate: '',
      paymentDeadline: '',
      amountPerStudentCedis: '5.00',
    },
    {
      termCode: 'THIRD_TERM',
      termName: 'Third Term',
      termNumber: 3,
      reopeningDate: '',
      closingDate: '',
      vacationStartDate: '',
      vacationEndDate: '',
      graceStartDate: '',
      graceEndDate: '',
      paymentDeadline: '',
      amountPerStudentCedis: '5.00',
    },
  ]
}

function dateToEpochMillis(dateValue) {
  if (!dateValue) return null

  const date = new Date(`${dateValue}T00:00:00.000Z`)

  return date.getTime()
}

function epochToDateInput(epochMillis) {
  if (!epochMillis) return ''

  const date = new Date(Number(epochMillis))

  return date.toISOString().slice(0, 10)
}

function formatEpoch(epochMillis) {
  if (!epochMillis) return '-'

  return new Date(Number(epochMillis)).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function buildPayload() {
  return {
    name: form.name,
    startDateEpochMillis: dateToEpochMillis(form.startDate),
    endDateEpochMillis: dateToEpochMillis(form.endDate),
    terms: form.terms.map((term) => ({
      termCode: term.termCode,
      termName: term.termName,
      termNumber: Number(term.termNumber),
      reopeningDateEpochMillis: dateToEpochMillis(term.reopeningDate),
      closingDateEpochMillis: dateToEpochMillis(term.closingDate),
      vacationStartDateEpochMillis: dateToEpochMillis(term.vacationStartDate),
      vacationEndDateEpochMillis: dateToEpochMillis(term.vacationEndDate),
      graceStartDateEpochMillis: dateToEpochMillis(term.graceStartDate),
      graceEndDateEpochMillis: dateToEpochMillis(term.graceEndDate),
      paymentDeadlineEpochMillis: dateToEpochMillis(term.paymentDeadline),
      amountPerStudentCedis: String(term.amountPerStudentCedis || '5.00'),
    })),
  }
}

function validateForm() {
  if (!form.name) {
    return 'Academic year name is required.'
  }

  if (!form.startDate || !form.endDate) {
    return 'Academic year start and end dates are required.'
  }

  if (form.terms.length !== 3) {
    return 'Academic year must have exactly three terms.'
  }

  for (const term of form.terms) {
    if (!term.termCode || !term.termName) {
      return `${term.termName || 'A term'} is missing term name or code.`
    }

    if (!term.reopeningDate || !term.closingDate) {
      return `${term.termName} reopening and closing dates are required.`
    }

    if (!term.graceStartDate || !term.graceEndDate || !term.paymentDeadline) {
      return `${term.termName} grace period and payment deadline are required.`
    }

    if (!term.amountPerStudentCedis || Number(term.amountPerStudentCedis) <= 0) {
      return `${term.termName} amount per student must be greater than zero.`
    }
  }

  return ''
}

async function fetchAcademicYears() {
  loadingYears.value = true
  error.value = ''

  try {
    const response = await getAcademicYearCalendars()
    academicYears.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Failed to load academic years.'
  } finally {
    loadingYears.value = false
  }
}

async function submitCalendar() {
  error.value = ''
  success.value = ''

  const validationError = validateForm()

  if (validationError) {
    error.value = validationError
    return
  }

  saving.value = true

  try {
    const payload = buildPayload()

    if (editingYearId.value) {
      const t = await updateAcademicYearCalendar(editingYearId.value, payload)

      success.value = 'Academic year updated successfully.'
    } else {
      await createAcademicYearCalendar(payload)
      success.value = 'Academic year created successfully.'
    }

    await fetchAcademicYears()
    resetForm()
  } catch (err) {

    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Failed to save academic year.'
  } finally {
    saving.value = false
  }
}

function editYear(year) {
  editingYearId.value = year.id
  activeTermIndex.value = 0

  form.name = year.name || ''
  form.startDate = epochToDateInput(year.startDateEpochMillis)
  form.endDate = epochToDateInput(year.endDateEpochMillis)

  const incomingTerms = year.terms || []

  form.terms = getDefaultTerms().map((defaultTerm) => {
    const found = incomingTerms.find((term) => term.termCode === defaultTerm.termCode)

    if (!found) return defaultTerm

    return {
      termCode: found.termCode,
      termName: found.termName,
      termNumber: found.termNumber,
      reopeningDate: epochToDateInput(found.reopeningDateEpochMillis),
      closingDate: epochToDateInput(found.closingDateEpochMillis),
      vacationStartDate: epochToDateInput(found.vacationStartDateEpochMillis),
      vacationEndDate: epochToDateInput(found.vacationEndDateEpochMillis),
      graceStartDate: epochToDateInput(found.graceStartDateEpochMillis),
      graceEndDate: epochToDateInput(found.graceEndDateEpochMillis),
      paymentDeadline: epochToDateInput(found.paymentDeadlineEpochMillis),
      amountPerStudentCedis: found.amountPerStudentCedis || '5.00',
    }
  })

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

async function deleteYear(year) {
  const confirmed = window.confirm(
    `Delete academic year ${year.name}? This may affect billing invoices linked to this calendar.`
  )

  if (!confirmed) return

  error.value = ''
  success.value = ''

  try {
    await deleteAcademicYearCalendar(year.id)

    success.value = 'Academic year deleted successfully.'

    if (editingYearId.value === year.id) {
      resetForm()
    }

    await fetchAcademicYears()
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Failed to delete academic year.'
  }
}

function resetForm() {
  editingYearId.value = null
  activeTermIndex.value = 0
  form.name = ''
  form.startDate = ''
  form.endDate = ''
  form.terms = getDefaultTerms()
  error.value = ''
}

async function copyPayload() {
  try {
    await navigator.clipboard.writeText(payloadPreview.value)
    success.value = 'Payload copied successfully.'
  } catch (err) {
    error.value = 'Unable to copy payload.'
  }
}

onMounted(() => {
  fetchAcademicYears()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

.calendar-page {
  color: #0f172a;
}

/* Header */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.22), transparent 34%),
    linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
  color: #ffffff;
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.18);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 12px;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.hero p {
  margin: 0;
  color: #dbeafe;
  line-height: 1.6;
  max-width: 760px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Alerts */
.alert {
  padding: 14px 16px;
  border-radius: 16px;
  margin-bottom: 18px;
  font-weight: 850;
  border: 1px solid transparent;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

/* Layout */
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.75fr);
  gap: 20px;
}

.side-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 26px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 950;
}

.card-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Pills */
.pill {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.pill-blue {
  background: #e0ecff;
  color: #1d4ed8;
}

.pill-green {
  background: #dcfce7;
  color: #166534;
}

/* Section */
.section-title {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 22px 0 14px;
}

.section-title:first-of-type {
  margin-top: 0;
}

.section-title span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #0f172a;
  color: #ffffff;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 950;
  font-size: 0.82rem;
}

.section-title h3 {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 950;
}

.section-title p {
  margin: 0;
  color: #64748b;
  font-size: 0.86rem;
}

.terms-title {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.form-group label {
  display: block;
  color: #334155;
  font-size: 0.82rem;
  font-weight: 900;
  margin-bottom: 7px;
}

.form-group input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 15px;
  padding: 12px 13px;
  background: #ffffff;
  color: #0f172a;
  outline: none;
  font-weight: 800;
}

.form-group input:disabled {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

.form-group input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
}

/* Term tabs */
.term-tabs {
  display: flex;
  gap: 10px;
  background: #f8fafc;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  margin-bottom: 16px;
}

.term-tab {
  flex: 1;
  border: none;
  border-radius: 13px;
  padding: 11px;
  background: transparent;
  color: #475569;
  font-weight: 950;
  cursor: pointer;
}

.term-tab.active {
  background: #0f172a;
  color: #ffffff;
}

.term-panel {
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
}

.term-panel-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.term-panel-header h3 {
  margin: 0 0 4px;
  font-size: 1.05rem;
  font-weight: 950;
}

.term-panel-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.86rem;
}

.term-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.term-summary div {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 13px;
}

.term-summary span {
  display: block;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 5px;
}

.term-summary strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 950;
}

/* Existing years */
.search-input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 15px;
  padding: 12px 13px;
  outline: none;
  font-weight: 850;
  margin-bottom: 14px;
}

.search-input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
}

.empty-state {
  padding: 22px;
  text-align: center;
  color: #64748b;
  font-weight: 850;
  background: #f8fafc;
  border-radius: 16px;
}

.year-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.year-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #f8fafc;
}

.year-item strong {
  display: block;
  font-weight: 950;
  margin-bottom: 4px;
}

.year-item span,
.year-item small {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 2px;
}

.year-actions {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Preview */
.preview-card pre {
  max-height: 460px;
  overflow: auto;
  background: #020617;
  color: #dbeafe;
  border-radius: 18px;
  padding: 16px;
  font-size: 0.78rem;
  line-height: 1.55;
}

/* Buttons */
.btn,
.mini-btn,
.icon-btn {
  border: none;
  cursor: pointer;
  font-weight: 950;
  transition: all 0.2s ease;
}

.btn {
  border-radius: 14px;
  padding: 12px 16px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-dark {
  background: #ffffff;
  color: #0f172a;
}

.btn-dark:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.btn-light {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.mini-btn {
  border-radius: 11px;
  padding: 8px 10px;
  background: #0f172a;
  color: #ffffff;
  font-size: 0.78rem;
}

.mini-btn.danger {
  background: #dc2626;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 13px;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 1.05rem;
}

/* Responsive */
@media (max-width: 1180px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .side-stack {
    display: grid;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 850px) {
  .hero,
  .card-header,
  .term-panel-header,
  .year-item {
    flex-direction: column;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .form-grid,
  .term-summary {
    grid-template-columns: 1fr;
  }

  .term-tabs {
    flex-direction: column;
  }
}
</style>
