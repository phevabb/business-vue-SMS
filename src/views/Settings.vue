<template>
  <div class="settings-page">
    <section class="settings-hero">
      <div>
        <span class="badge">Workspace Settings</span>
        <h1 style="color: papayawhip;">School Settings</h1>
        <p>
          Update your school profile, logo, contact details, and workspace information.
        </p>
      </div>
    </section>

    <section class="settings-grid">
      <div class="settings-card">
        <div class="card-header">
          <div>
            <h2>School Profile</h2>
            <p>Manage the basic identity of your school.</p>
          </div>
        </div>

        <form class="settings-form" @submit.prevent="saveSettings">
          <div class="logo-section">
            <div class="logo-preview">
              logoPreview
              ?<span v-if="!logoPreview" class="logo-initials">{{ schoolInitials }}</span>
              :<img :src="logoPreview" alt="School Logo" />
            </div>

            <label class="upload-btn">
              Change Logo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                @change="handleLogoUpload"
              />
            </label>
          </div>

          <div class="field">
            <label>School Name</label>
            <input
              v-model="form.schoolName"
              type="text"
              placeholder="Enter school name"
            />
          </div>

          <div class="grid">
            <div class="field">
              <label>Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="school@email.com"
              />
            </div>

            <div class="field">
              <label>Phone Number</label>
              <input
                v-model="form.phoneNumber"
                type="text"
                placeholder="+233..."
              />
            </div>
          </div>

          <div class="field">
            <label>Location</label>
            <input
              v-model="form.location"
              type="text"
              placeholder="City, Region"
            />
          </div>

          <div class="grid">
            <div class="field">
              <label>Academic Year</label>
              <input
                v-model="form.academicYear"
                type="text"
                placeholder="2024/2025"
              />
            </div>

            <div class="field">
              <label>Tenant Code</label>
              <input
                v-model="form.tenantCode"
                type="text"
                disabled
              />
            </div>
          </div>

          <button
            class="save-btn"
            type="submit"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner"
            ></span>
            {{ loading ? 'Saving changes...' : 'Save Changes' }}
          </button>
        </form>
      </div>

      <div class="settings-card side-card">
        <h2>Workspace Info</h2>

        <div class="info-list">
          <div>
            <span>Tenant Slug</span>
            <strong>{{ workspace.tenantSlug || 'Not available' }}</strong>
          </div>

          <div>
            <span>Domain</span>
            <strong>{{ workspace.defaultDomain || 'Not available' }}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{{ workspace.tenantStatus || 'Active' }}</strong>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const loading = ref(false)
const logoPreview = ref('')

const form = reactive({
  schoolName: '',
  email: '',
  phoneNumber: '',
  location: '',
  academicYear: '',
  tenantCode: '',
})

const workspace = reactive({
  tenantSlug: '',
  defaultDomain: '',
  tenantStatus: '',
})

const schoolInitials = computed(() => {
  if (!form.schoolName) return 'PH'

  return form.schoolName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
})

const loadFromStorage = () => {
  const rawUser = localStorage.getItem('user')

  if (!rawUser) return

  try {
    const user = JSON.parse(rawUser)

    form.schoolName = user.schoolName || ''
    form.email = user.email || ''
    form.phoneNumber = user.phoneNumber || ''
    form.location = user.location || ''
    form.academicYear = user.academicYear || ''
    form.tenantCode = user.tenantCode || localStorage.getItem('tenantCode') || ''

    logoPreview.value = user.profilePictureUrl || ''

    workspace.tenantSlug = user.tenantSlug || ''
    workspace.defaultDomain = user.defaultDomain || ''
    workspace.tenantStatus = user.tenantStatus || ''
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error)
  }
}

const handleLogoUpload = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  logoPreview.value = URL.createObjectURL(file)
}

const saveSettings = async () => {
  loading.value = true

  try {
    const rawUser = localStorage.getItem('user')
    const user = rawUser ? JSON.parse(rawUser) : {}

    const updatedUser = {
      ...user,
      schoolName: form.schoolName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      location: form.location,
      academicYear: form.academicYear,
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
    localStorage.setItem('schoolName', form.schoolName)

    alert('Settings updated successfully.')
  } catch (error) {
    console.error(error)
    alert('Unable to update settings.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
.settings-page {
  display: grid;
  gap: 24px;
}

.settings-hero {
  padding: 32px;
  border-radius: 28px;
  color: #ffffff;
  background:
    radial-gradient(circle at top left, rgba(251, 191, 36, 0.25), transparent 30%),
    linear-gradient(135deg, #071926, #0f2742);
}

.badge {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  color: #071926;
  background: #f5d58c;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.settings-hero h1 {
  margin: 0;
  font-size: 38px;
  letter-spacing: -0.04em;
}

.settings-hero p {
  max-width: 620px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.7;
}

.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.6fr);
  gap: 24px;
}

.settings-card {
  padding: 28px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
}

.card-header h2,
.side-card h2 {
  margin: 0;
  color: #111827;
}

.card-header p {
  margin: 8px 0 0;
  color: #6b7280;
}

.settings-form {
  display: grid;
  gap: 18px;
  margin-top: 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-preview {
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 24px;
  color: #071926;
  background: linear-gradient(135deg, #f5d58c, #c99635);
  font-size: 26px;
  font-weight: 950;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  height: 42px;
  padding: 0 16px;
  border-radius: 14px;
  color: #071926;
  background: #f5d58c;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.upload-btn input {
  display: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  color: #374151;
  font-size: 13px;
  font-weight: 800;
}

.field input {
  width: 100%;
  height: 48px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0 14px;
  outline: none;
}

.field input:focus {
  border-color: #c99635;
  box-shadow: 0 0 0 4px rgba(201, 150, 53, 0.12);
}

.field input:disabled {
  color: #6b7280;
  background: #f9fafb;
}

.save-btn {
  height: 52px;
  border: none;
  border-radius: 16px;
  color: #071926;
  background: linear-gradient(135deg, #f5d58c, #c99635);
  font-weight: 950;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 15px;
  height: 15px;
  display: inline-block;
  margin-right: 8px;
  border: 2px solid rgba(7, 25, 38, 0.3);
  border-top-color: #071926;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}

.info-list {
  display: grid;
  gap: 16px;
  margin-top: 22px;
}

.info-list div {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: 18px;
  background: #f9fafb;
}

.info-list span {
  color: #6b7280;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.info-list strong {
  color: #111827;
  word-break: break-all;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
