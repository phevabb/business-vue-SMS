<template>
  <div class="password-page">
    <section class="password-card">
      <span class="badge">Security</span>

      <h1>Change Password</h1>
      <p>Update your account password to keep your workspace secure.</p>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>

      <form class="password-form" @submit.prevent="submitChangePassword">
        <div class="field">
          <label>Current Password</label>

          <div class="password-wrapper">
            <input
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Enter current password"
              autocomplete="current-password"
            />

            <button
              type="button"
              class="eye-btn"
              @click="showCurrentPassword = !showCurrentPassword"
              :aria-label="showCurrentPassword ? 'Hide current password' : 'Show current password'"
            >
              <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="field">
          <label>New Password</label>

          <div class="password-wrapper">
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Enter new password"
              autocomplete="new-password"
            />

            <button
              type="button"
              class="eye-btn"
              @click="showNewPassword = !showNewPassword"
              :aria-label="showNewPassword ? 'Hide new password' : 'Show new password'"
            >
              <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="field">
          <label>Confirm New Password</label>

          <div class="password-wrapper">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm new password"
              autocomplete="new-password"
            />

            <button
              type="button"
              class="eye-btn"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
            >
              <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="password-rules">
          <p>Password must contain:</p>

          <ul>
            <li :class="{ valid: passwordChecks.length }">At least 8 characters</li>
            <li :class="{ valid: passwordChecks.uppercase }">One uppercase letter</li>
            <li :class="{ valid: passwordChecks.lowercase }">One lowercase letter</li>
            <li :class="{ valid: passwordChecks.number }">One number</li>
            <li :class="{ valid: passwordChecks.special }">One special character</li>
            <li :class="{ valid: passwordsMatch && form.confirmPassword.length > 0 }">
              New passwords must match
            </li>
          </ul>
        </div>

        <button
          class="save-btn"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Updating...' : 'Update Password' }}
        </button>
      </form>
    </section>
  </div>
</template>




<script setup>
import { changePassword as changePasswordApi } from '@/services/auth.js'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordChecks = computed(() => {
  const password = form.newPassword

  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
})

const passwordsMatch = computed(() => {
  return form.newPassword === form.confirmPassword
})

function isValidSession() {
  const access =
    localStorage.getItem('access') ||
    localStorage.getItem('token')

  const tenantCode =
    localStorage.getItem('tenantCode') ||
    localStorage.getItem('tenant_code')

  return Boolean(access && tenantCode)
}

function redirectToLogin() {
  localStorage.removeItem('access')
  localStorage.removeItem('token')
  localStorage.removeItem('tenantCode')
  localStorage.removeItem('tenant_code')
  localStorage.removeItem('user')
  localStorage.removeItem('rememberMe')
  localStorage.removeItem('tenantSlug')
  localStorage.removeItem('schoolName')

  router.replace('/auth/login')
}

function validateStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

function resetForm() {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''

  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

async function submitChangePassword() {
  error.value = ''
  success.value = ''

  if (!isValidSession()) {
    redirectToLogin()
    return
  }

  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    error.value = 'Please complete all fields.'
    return
  }

  if (!validateStrongPassword(form.newPassword)) {
    error.value =
      'Password must contain at least 8 characters, uppercase, lowercase, number, and special character.'
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    error.value = 'New passwords do not match.'
    return
  }

  if (form.currentPassword === form.newPassword) {
    error.value = 'New password must be different from current password.'
    return
  }

  loading.value = true

  try {
    const response = await changePasswordApi({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    })

    success.value =
      response.data?.message ||
      'Password changed successfully.'

    resetForm()
  } catch (err) {
    const status = err.response?.status

    if (status === 401 || status === 403) {
      redirectToLogin()
      return
    }

    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to update password.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isValidSession()) {
    redirectToLogin()
  }
})
</script>


<style scoped>
.password-page {
  display: grid;
  place-items: center;
  min-height: 70vh;
}

.password-card {
  width: min(520px, 100%);
  padding: 34px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
}

.badge {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 7px 12px;
  border-radius: 999px;
  color: #071926;
  background: #f5d58c;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #111827;
  font-size: 34px;
  letter-spacing: -0.04em;
}

p {
  margin: 10px 0 0;
  color: #6b7280;
  line-height: 1.7;
}

.alert {
  margin-top: 18px;
  padding: 13px 14px;
  border-radius: 16px;
  font-weight: 800;
  line-height: 1.45;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.password-form {
  display: grid;
  gap: 18px;
  margin-top: 26px;
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

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 100%;
  height: 50px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0 48px 0 14px;
  outline: none;
  color: #111827;
  font-weight: 700;
}

.password-wrapper input:focus {
  border-color: #c99635;
  box-shadow: 0 0 0 4px rgba(201, 150, 53, 0.12);
}

.eye-btn {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  font-size: 1rem;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.eye-btn:hover {
  color: #c99635;
}

.password-rules {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 16px;
  padding: 14px;
}

.password-rules p {
  margin: 0 0 8px;
  color: #92400e;
  font-size: 13px;
  font-weight: 900;
}

.password-rules ul {
  margin: 0;
  padding-left: 18px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.7;
}

.password-rules li.valid {
  color: #059669;
  font-weight: 900;
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
</style>
