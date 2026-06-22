<template>
  <div class="login-page">
    <div class="login-shell">
      <!-- Left / Branding -->
      <section class="brand-panel">
        <div class="brand-top">
          <div class="brand-logo">P</div>
          <div>
            <h1 style="color: bisque;">Phena Systems</h1>
            <p>SuperAdmin Control Center</p>
          </div>
        </div>

        <div class="brand-content">
          <span class="brand-badge">Secure Admin Access</span>

          <h2 style="color: bisque;">Manage schools, tenants, accounts, and subscriptions.</h2>

          <p>
            Sign in to monitor business accounts, tenant provisioning,
            transactions, billing status, and platform operations.
          </p>
        </div>

        <div class="brand-footer">
          <span>ktor-business</span>
          <span>SuperAdmin API</span>
        </div>
      </section>

      <!-- Right / Form -->
      <section class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <span class="form-badge">SuperAdmin Login</span>
            <h2>Welcome back</h2>
            <p>Use your SuperAdmin credentials to continue.</p>
          </div>

          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                placeholder="admin@phena.app"
                autocomplete="email"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>

              <div class="password-wrap">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                  autocomplete="current-password"
                  required
                />

                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <button class="login-button" type="submit" :disabled="loading">
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign In</span>
            </button>
          </form>

          <div class="security-note">
            <strong>Security note:</strong>
            This area is restricted to authorized Phena SuperAdmins only.
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { superAdminLogin } from '@/adminBox/services/superadminApi.js'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
})

async function login() {
  error.value = ''

  if (!form.email || !form.password) {
    error.value = 'Please enter your email and password.'
    return
  }

  loading.value = true

  try {
    const response = await superAdminLogin({
      email: form.email,
      password: form.password,
    })

    const data = response.data || {}

    const token = data.token || data.accessToken || data.access

    if (!token) {
      throw new Error('Login succeeded but no token was returned.')
    }

    localStorage.setItem('superadmin_token', token)

    if (data.admin) {
      localStorage.setItem('superadmin_name', data.admin.fullName || 'Super Admin')
      localStorage.setItem('superadmin_email', data.admin.email || form.email)
    } else {
      localStorage.setItem('superadmin_name', data.fullName || 'Super Admin')
      localStorage.setItem('superadmin_email', data.email || form.email)
    }

    router.push('/superadmin/dashboard')
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unable to sign in. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

.login-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.2), transparent 34%),
    linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #0f172a;
}

.login-shell {
  width: min(1120px, 100%);
  min-height: 680px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  background: #ffffff;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
}

/* Branding */
.brand-panel {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(29, 78, 216, 0.82)),
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.35), transparent 38%);
  color: #ffffff;
  padding: 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(135deg, #2563eb, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.4rem;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.22);
}

.brand-top h1 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 900;
}

.brand-top p {
  margin: 4px 0 0;
  color: #bfdbfe;
  font-size: 0.88rem;
  font-weight: 700;
}

.brand-content {
  max-width: 520px;
}

.brand-badge {
  display: inline-flex;
  padding: 8px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 0.78rem;
  font-weight: 900;
  margin-bottom: 18px;
}

.brand-content h2 {
  margin: 0 0 14px;
  font-size: 2.4rem;
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 950;
}

.brand-content p {
  margin: 0;
  color: #dbeafe;
  line-height: 1.7;
  font-size: 1rem;
  max-width: 460px;
}

.brand-footer {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.brand-footer span {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #dbeafe;
  font-size: 0.78rem;
  font-weight: 800;
}

/* Form */
.form-panel {
  background: #f8fafc;
  padding: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  width: min(430px, 100%);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 26px;
  padding: 30px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.form-header {
  margin-bottom: 24px;
}

.form-badge {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  background: #e0ecff;
  color: #1d4ed8;
  font-size: 0.76rem;
  font-weight: 900;
  margin-bottom: 14px;
}

.form-header h2 {
  margin: 0 0 6px;
  font-size: 1.8rem;
  font-weight: 950;
  letter-spacing: -0.03em;
}

.form-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.alert {
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 18px;
  font-weight: 800;
  font-size: 0.9rem;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.form-group {
  margin-bottom: 17px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 0.86rem;
  font-weight: 900;
}

.form-group input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 15px;
  padding: 13px 14px;
  outline: none;
  color: #0f172a;
  font-weight: 800;
  background: #ffffff;
}

.form-group input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
}

.password-wrap {
  position: relative;
}

.password-wrap input {
  padding-right: 76px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 9px;
  transform: translateY(-50%);
  border: none;
  border-radius: 11px;
  padding: 8px 10px;
  background: #f1f5f9;
  color: #0f172a;
  font-weight: 900;
  cursor: pointer;
}

.login-button {
  width: 100%;
  border: none;
  border-radius: 15px;
  padding: 14px 16px;
  margin-top: 6px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 950;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-button:hover {
  background: #111827;
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.security-note {
  margin-top: 20px;
  padding: 13px;
  border-radius: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  line-height: 1.5;
  font-size: 0.84rem;
}

.security-note strong {
  color: #0f172a;
}

/* Responsive */
@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    min-height: 420px;
  }

  .brand-content h2 {
    font-size: 2rem;
  }
}

@media (max-width: 560px) {
  .login-page {
    padding: 14px;
  }

  .brand-panel,
  .form-panel {
    padding: 22px;
  }

  .form-card {
    padding: 22px;
  }

  .brand-content h2 {
    font-size: 1.7rem;
  }
}
</style>
