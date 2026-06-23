<template>
  <main class="forgot-page">
    <section class="auth-card">
      <div class="brand">
        <div class="brand-logo">P</div>
        <div>
          <h1>{{ isResetMode ? 'Reset Password' : 'Forgot Password' }}</h1>
          <p>
            {{ isResetMode
              ? 'Create a new password for your account.'
              : 'Enter your email and we will send a reset link.' }}
          </p>
        </div>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>

      <form v-if="!isResetMode" @submit.prevent="submitForgotPassword" class="form">
        <div class="form-group">
          <label>Email address</label>
          <input
            v-model.trim="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
          />
        </div>

        <button class="btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <RouterLink class="helper-link" to="/auth/login">
          Back to login
        </RouterLink>
      </form>

      <form v-else @submit.prevent="submitResetPassword" class="form">
        <div class="form-group">
  <label>New password</label>

  <div class="password-wrapper">
    <input
      v-model="newPassword"
      :type="showNewPassword ? 'text' : 'password'"
      placeholder="New password"
      autocomplete="new-password"
    />

    <button
      type="button"
      class="eye-btn"
      @click="showNewPassword = !showNewPassword"
    >
      <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
    </button>
  </div>
</div>

<div class="form-group">
  <label>Confirm password</label>

  <div class="password-wrapper">
    <input
      v-model="confirmPassword"
      :type="showConfirmPassword ? 'text' : 'password'"
      placeholder="Confirm password"
      autocomplete="new-password"
    />

    <button
      type="button"
      class="eye-btn"
      @click="showConfirmPassword = !showConfirmPassword"
    >
      <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
    </button>
  </div>
</div>

        <button class="btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>

        <RouterLink class="helper-link" to="/auth/login">
          Back to login
        </RouterLink>
      </form>
    </section>
  </main>
</template>

<script setup>
import {
    forgotPassword,
    resetPassword,
} from '@/services/auth.js'
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const token = computed(() => {
  return route.query.token || ''
})

const isResetMode = computed(() => {
  return Boolean(token.value)
})

function validateStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

async function submitForgotPassword() {
  error.value = ''
  success.value = ''

  if (!email.value) {
    error.value = 'Email is required.'
    return
  }

  loading.value = true

  try {
    const response = await forgotPassword({
      email: email.value,
    })

    success.value =
      response.data?.message ||
      'If this email exists, a password reset link has been sent.'
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to send reset email.'
  } finally {
    loading.value = false
  }
}

async function submitResetPassword() {
  error.value = ''
  success.value = ''

  if (!token.value) {
    error.value = 'Reset token is missing.'
    return
  }

  if (!validateStrongPassword(newPassword.value)) {
    error.value =
      'Password must contain at least 8 characters, uppercase, lowercase, number, and special character.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    const response = await resetPassword({
      token: token.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    })

    success.value =
      response.data?.message ||
      'Password reset successfully. You can now login.'

    setTimeout(() => {
      router.push('/auth/login')
    }, 1800)
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to reset password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 34%),
    linear-gradient(135deg, #f8fafc, #eef2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.1);
}

.brand {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 22px;
}

.brand-logo {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(135deg, #2563eb, #22c55e);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 950;
  font-size: 1.3rem;
}

.brand h1 {
  margin: 0;
  color: #0f172a;
  font-size: 1.45rem;
  font-weight: 900;
}

.brand p {
  margin: 4px 0 0;
  color: #64748b;
  line-height: 1.45;
}

.alert {
  padding: 13px 14px;
  border-radius: 16px;
  margin-bottom: 16px;
  font-weight: 800;
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

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group label {
  display: block;
  font-weight: 850;
  color: #334155;
  font-size: 0.86rem;
  margin-bottom: 7px;
}

.form-group input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 15px;
  padding: 13px 14px;
  color: #0f172a;
  outline: none;
  font-weight: 750;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.btn-primary {
  border: none;
  border-radius: 15px;
  min-height: 48px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.2);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 48px;
}

.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  color: #64748b;
  font-size: 1rem;
  padding: 0;
}

.eye-btn:hover {
  color: #2563eb;
}

.helper-link {
  color: #2563eb;
  font-weight: 850;
  text-align: center;
  text-decoration: none;
}
</style>
