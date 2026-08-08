
<template>
  <div class="settings-page">

    <section class="hero-card">
      <h1>School Settings</h1>

      <p>
        Manage your school's branding, administrator profile,
        security PINs and account information.
      </p>
    </section>

    <div class="settings-layout">

      <!-- SCHOOL -->

      <div class="settings-card">

        <h2>School Branding</h2>

        <div class="logo-section">

          <div class="logo-preview">
            <img
              v-if="logoPreview"
              :src="logoPreview"
              alt="School Logo"
            />

            <span
              v-else
              class="logo-initials"
            >
              {{ schoolInitials }}
            </span>
          </div>

          <label class="upload-btn">
            Update Logo

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="handleLogoUpload"
            >
          </label>

        </div>

        <div class="field">
          <label>School Name</label>

          <input
            v-model="schoolForm.schoolName"
            type="text"
          >
        </div>

        <div class="field">
          <label>School Motto</label>

          <input
            v-model="schoolForm.schoolMotto"
            type="text"
          >
        </div>

        <div class="field">
          <label>School Location</label>

          <input
            v-model="schoolForm.location"
            type="text"
          >
        </div>

        <button
  class="save-btn"
  :disabled="loading"
  @click="saveSchool"
>
  {{ loading ? 'Saving...' : 'Save School Changes' }}
</button>

      </div>

      <!-- PROFILE -->

      <!-- <div class="settings-card">

        <h2>My Profile</h2>

        <div class="field">
          <label>Full Name</label>

          <input
            v-model="profileForm.fullName"
            type="text"
          >
        </div>

        <div class="field">
          <label>Phone Number</label>

          <input
            v-model="profileForm.phoneNumber"
            type="text"
          >
        </div>

        <button
          class="save-btn"
          @click="saveProfile"
        >
          Save Profile
        </button>

      </div> -->

      <!-- SECURITY -->

      <div class="settings-card">

        <h2>Security</h2>

        <div class="field">
          <label>Admin PIN</label>

          <div class="password-wrapper">

  <input
    v-model="securityForm.adminPin"
    :type="showAdminPin ? 'text' : 'password'"
  >

  <i
    class="pi"
    :class="
      showAdminPin
        ? 'pi-eye-slash'
        : 'pi-eye'
    "
    @click="showAdminPin = !showAdminPin"
  />

</div>
        </div>

        <div class="field">
          <label>Confirm Admin PIN</label>

         <div class="password-wrapper">

  <input
    v-model="securityForm.confirmAdminPin"
    :type="showConfirmAdminPin ? 'text' : 'password'"
  >

  <i
    class="pi"
    :class="
      showConfirmAdminPin
        ? 'pi-eye-slash'
        : 'pi-eye'
    "
    @click="
      showConfirmAdminPin =
      !showConfirmAdminPin
    "
  />

</div>
        </div>

        <div class="field">
          <label>Principal PIN</label>

          <div class="password-wrapper">

  <input
    v-model="securityForm.principalPin"
    :type="showPrincipalPin ? 'text' : 'password'"
  >

  <i
    class="pi"
    :class="
      showPrincipalPin
        ? 'pi-eye-slash'
        : 'pi-eye'
    "
    @click="showPrincipalPin = !showPrincipalPin"
  />

</div>
        </div>

        <div class="field">
          <label>Confirm Principal PIN</label>

          <div class="password-wrapper">

  <input
    v-model="securityForm.confirmPrincipalPin"
    :type="showConfirmPrincipalPin ? 'text' : 'password'"
  >

  <i
    class="pi"
    :class="
      showConfirmPrincipalPin
        ? 'pi-eye-slash'
        : 'pi-eye'
    "
    @click="
      showConfirmPrincipalPin =
      !showConfirmPrincipalPin
    "
  />

</div>
        </div>

        <button
          class="save-btn"
          @click="savePins"
        >
          Update PINs
        </button>

      </div>

      <!-- ACCOUNT INFO -->

      <div class="settings-card side-card">

        <h2>Account Information</h2>

        <div class="info-list">

          <div>
            <span>Tenant Code</span>
            <strong>{{ workspace.tenantCode }}</strong>
          </div>

          <!-- <div>
            <span>School URL</span>
            <strong>{{ workspace.domain }}</strong>
          </div> -->

          <div>
            <span>Subscription</span>
            <strong>{{ workspace.subscription }}</strong>
          </div>

          <!-- <div>
            <span>Students</span>
            <strong>{{ workspace.studentCount }}</strong>
          </div> -->

          <div>
            <span>Status</span>
            <strong>{{ workspace.status }}</strong>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup>
import { getSchoolProfile, updatePins, updateSchoolBranding } from '@/services/auth.js'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, reactive, ref } from 'vue'
const toast = useToast()


const loading = ref(false)

const showAdminPin = ref(false)
const showConfirmAdminPin = ref(false)

const showPrincipalPin = ref(false)
const showConfirmPrincipalPin = ref(false)


const logoPreview = ref('')

const schoolForm = reactive({
  schoolName: '',
  schoolMotto: '',
  location: '',
})

const loadSchoolProfile = async () => {

  try {

    const tenantCode =
      localStorage.getItem('tenantCode')

    if (!tenantCode) {
      return
    }

    const response =
  await getSchoolProfile(
    tenantCode
  )


    const profile = response.data

    schoolForm.schoolName =
      profile.schoolName || ''

    schoolForm.schoolMotto =
      profile.schoolMotto || ''

    schoolForm.location =
      profile.location || ''

    logoPreview.value =
      profile.schoolLogoUrl || ''

  } catch (error) {

    console.error(
      ' print Failed to load school profile:',
      error
    )
  }
}

function showToast(severity, summary, detail) {
  toast.add({
    severity,
    summary,
    detail,
    life: 4000,
  })
}



const profileForm = reactive({
  fullName: '',
  phoneNumber: '',
})

const securityForm = reactive({
  adminPin: '',
  confirmAdminPin: '',

  principalPin: '',
  confirmPrincipalPin: '',
})

const workspace = reactive({
  tenantCode: localStorage.getItem('tenantCode') || '',
  domain: '',
  subscription: 'Active',
  studentCount: 0,
  status: 'Active',
})

const schoolInitials = computed(() => {

  if (!schoolForm.schoolName) {
    return 'PS'
  }

  return schoolForm.schoolName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
})

const loadData = () => {

  const rawUser = localStorage.getItem('user')

  if (!rawUser) return

  const user = JSON.parse(rawUser)


  workspace.domain =
    user.defaultDomain || ''

  workspace.studentCount =
    user.studentCount || 0
}

const handleLogoUpload = (event) => {

  const file = event.target.files?.[0]

  if (!file) return

  logoPreview.value =
    URL.createObjectURL(file)
}

const saveSchool = async () => {

  const tenantCode =
    localStorage.getItem('tenantCode')

  if (!tenantCode) {

    showToast(
      'error',
      'Error',
      'Tenant code not found.'
    )

    return
  }

  if (!schoolForm.schoolName.trim()) {

    showToast(
      'warn',
      'Validation',
      'School name is required.'
    )

    return
  }

  try {

    loading.value = true

    const payload = {
      tenantCode,

      schoolName:
        schoolForm.schoolName.trim(),

      schoolLogoUrl:
        logoPreview.value || null,

      schoolMotto:
        schoolForm.schoolMotto.trim() || null,

      location:
        schoolForm.location.trim() || null,
    }

    await updateSchoolBranding(
      tenantCode,
      payload
    )

    showToast(
      'success',
      'Success',
      'School branding updated successfully.'
    )

    await loadSchoolProfile()

  } catch (error) {

    console.error(
      'Failed to update school branding:',
      error
    )

    showToast(
      'error',
      'Error',
      error?.response?.data?.message ||
      'Failed to update school branding.'
    )

  } finally {

    loading.value = false
  }
}

const saveProfile = async () => {


}

const savePins = async () => {

  const adminPin =
    securityForm.adminPin.trim()

  const principalPin =
    securityForm.principalPin.trim()

  const hasAdminPin =
    adminPin.length > 0

  const hasPrincipalPin =
    principalPin.length > 0

  if (!hasAdminPin && !hasPrincipalPin) {

    showToast(
      'warn',
      'Validation',
      'Please update at least one PIN.'
    )

    return
  }

  if (
    hasAdminPin &&
    adminPin !== securityForm.confirmAdminPin.trim()
  ) {

    showToast(
      'error',
      'Error',
      'Admin PINs do not match'
    )

    return
  }

  if (
    hasPrincipalPin &&
    principalPin !== securityForm.confirmPrincipalPin.trim()
  ) {

    showToast(
      'error',
      'Error',
      'Principal PINs do not match'
    )

    return
  }

  try {

    const payload = {
      tenantCode:
        localStorage.getItem('tenantCode') || '',
    }

    if (hasAdminPin) {
      payload.adminPin = adminPin
    }

    if (hasPrincipalPin) {
      payload.principalPin = principalPin
    }

    await updatePins(payload)

    securityForm.adminPin = ''
    securityForm.confirmAdminPin = ''

    securityForm.principalPin = ''
    securityForm.confirmPrincipalPin = ''

    showToast(
      'success',
      'Success',
      'PINs updated successfully'
    )

  } catch (error) {

    console.error(error)

    showToast(
      'error',
      'Error',
      'Failed to update PINs'
    )
  }
}

onMounted(async () => {

  loadData()

  await loadSchoolProfile()

})
</script>


<style scoped>
.settings-page {
  display: grid;
  gap: 24px;
}

.hero-card {
  padding: 32px;
  border-radius: 28px;
  color: #fff;
  background:
    radial-gradient(
      circle at top left,
      rgba(251, 191, 36, 0.25),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #071926,
      #0f2742
    );
}

.hero-card h1 {
  margin: 0;
  color: papayawhip;
  font-size: 36px;
}

.hero-card p {
  margin-top: 12px;
  color: rgba(255,255,255,.8);
}

.settings-layout {
  display: grid;
  grid-template-columns:
    minmax(0,1fr)
    minmax(0,1fr)
    320px;
  gap: 24px;
}

.settings-card {
  padding: 24px;
  border-radius: 22px;
  background: white;
  box-shadow:
    0 12px 40px rgba(15,23,42,.08);
}

.settings-card h2 {
  margin: 0 0 20px;
}

.logo-section {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-bottom: 24px;
}

.logo-preview {
  width: 110px;
  height: 110px;
  overflow: hidden;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(
      135deg,
      #f5d58c,
      #c99635
    );
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-initials {
  font-size: 32px;
  font-weight: 900;
  color: #071926;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  background: #f5d58c;
  font-weight: 700;
  cursor: pointer;
}

.upload-btn input {
  display: none;
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.field label {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}

.field input {
  width: 100%;
  height: 50px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  outline: none;
}

.field input:focus {
  border-color: #c99635;
  box-shadow:
    0 0 0 4px rgba(201,150,53,.12);
}

.save-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  color: #071926;
  background:
    linear-gradient(
      135deg,
      #f5d58c,
      #c99635
    );
}

.info-list {
  display: grid;
  gap: 14px;
}

.info-list div {
  padding: 16px;
  border-radius: 14px;
  background: #f9fafb;
}

.info-list span {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 800;
}

.info-list strong {
  color: #111827;
}

.side-card {
  align-self: start;
  position: sticky;
  top: 20px;
}

@media (max-width: 1200px) {

  .settings-layout {
    grid-template-columns: 1fr;
  }

  .side-card {
    position: static;
  }
}

@media (max-width: 768px) {

  .hero-card {
    padding: 24px;
  }

  .hero-card h1 {
    font-size: 28px;
  }

  .password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 46px;
}

.password-wrapper .pi {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b7280;
}

  .logo-section {
    flex-direction: column;
    align-items: flex-start;
  }
}

</style>
