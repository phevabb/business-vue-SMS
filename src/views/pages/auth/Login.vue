

<script setup>
import { login } from '@/services/auth.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const res = await login({
      email: email.value.trim(),
      password: password.value.trim(),
    })



    const access = res.data?.access
    const user = res.data?.user

    if (!access || !user) {
      throw new Error('Invalid login response')
    }

    // ✅ Store token
    localStorage.setItem('access', access)

    // Optional: also store as token if your route guard expects "token"
    localStorage.setItem('token', access)



    // ✅ Store important tenant/school values individually
    localStorage.setItem('tenantCode', user.tenantCode || '')
    localStorage.setItem('tenantSlug', user.tenantSlug || '')
    // ✅ Remember me
    localStorage.setItem('rememberMe', rememberMe.value ? 'true' : 'false')

    // ✅ Redirect to protected dashboard
    await router.replace('/dashboard')
  } catch (err) {


    error.value =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>





<template>
  <main class="login-page">
    <section class="login-card">
      <!-- LEFT BRAND PANEL -->
      <aside class="brand-panel">
        <div class="logo-badge">
          P
        </div>

        <div class="hero-content">
          <p class="eyebrow">PHENA SCHOOL MANAGEMENT SYSTEM</p>

          <h1>
            Welcome back to your school workspace.
          </h1>

          <p class="subtitle">
            Sign in securely to manage admissions, academics, fees, attendance,
            reports, and daily school operations.
          </p>
        </div>

        <div class="trust-box">
          <span class="shield-icon">✓</span>
          <div>
            <strong>Secure access</strong>
            <p>Your school data is protected with encrypted authentication.</p>
          </div>
        </div>
      </aside>

      <!-- RIGHT LOGIN PANEL -->
      <section class="form-panel">
        <div class="form-header">
          <p class="step-label">Account Access</p>
          <h2 style="color: papayawhip;">Sign In</h2>
          <p>Enter your login details to continue to your dashboard.</p>
        </div>

        <div v-if="error" class="error-box">
          <span>!</span>
          <p>{{ error }}</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="field">
            <label>Email Address</label>
            <input
              v-model.trim="email"
              type="email"
              placeholder="admin@school.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="field">
            <div class="password-label-row">
              <label>Password</label>

              <button
                type="button"
                class="forgot-btn"
                @click="router.push('/auth/forgot-password')"
              >
                Forgot password?
              </button>
            </div>

            <div class="password-wrap">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 3l18 18"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.477 10.485A3 3 0 0012 15a2.99 2.99 0 002.121-.879"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.88 5.09A9.953 9.953 0 0112 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.437 0 .644a10.05 10.05 0 01-4.043 5.127M6.228 6.228A10.012 10.012 0 002.037 11.68c-.07.207-.07.437 0 .644A10.013 10.013 0 006.6 17.728"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-row">
              <input v-model="rememberMe" type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <button class="submit-btn" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="register-link">
          <span>Not registered?</span>

          <button
            type="button"
            @click="router.push('/auth/register')"
          >
            Create an account
          </button>
        </div>

        <hr>
        <div class="home-btn-wrapper">
                <button
                    type="button"
                    class="home-btn"
                    @click="router.push('/')"
                >
                    Home
                </button>
                </div>


        <p class="copyright">
          © 2026 Phena Systems. All rights reserved.
        </p>
      </section>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  color: #ffffff;
  background:
    radial-gradient(circle at top left, rgba(220, 174, 84, 0.22), transparent 32%),
    radial-gradient(circle at bottom right, rgba(22, 139, 118, 0.26), transparent 38%),
    linear-gradient(135deg, #06131f 0%, #0b2137 48%, #071926 100%);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.login-card {
  width: min(1120px, 100%);
  min-height: 690px;
  display: grid;
  grid-template-columns: 0.95fr 1.1fr;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.075);
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(26px);
}

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  padding: 48px;
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.035)),
    radial-gradient(circle at top, rgba(212, 169, 87, 0.26), transparent 42%);
}

.logo-badge {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  color: #071926;
  background: linear-gradient(135deg, #f5d58c, #c99635);
  font-size: 28px;
  font-weight: 900;
  box-shadow: 0 20px 50px rgba(212, 169, 87, 0.28);
}

.hero-content {
  max-width: 700px;
}

.home-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 24px;
}

.home-btn {
  border: none;
  padding: 12px 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f5d58c, #e8b95d);
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 20px rgba(245, 213, 140, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.15);
}

.home-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow:
    0 14px 30px rgba(245, 213, 140, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.2);
}

.home-btn:active {
  transform: translateY(-1px) scale(0.98);
}

.home-btn:focus-visible {
  outline: 3px solid rgba(245, 213, 140, 0.4);
  outline-offset: 3px;
}

.eyebrow {
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fbbf24;
  margin-bottom: 1rem;
}

.hero-content h1 {
  font-family: "Plus Jakarta Sans", sans-serif;
  max-width: 560px;
  margin: 0 0 1.5rem;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.05;
  color: white;
  letter-spacing: -0.04em;
}

.subtitle {
  font-family: "Inter", sans-serif;
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  max-width: 650px;
}

.trust-box {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid rgba(245, 213, 140, 0.22);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.07);
}

.shield-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 13px;
  color: #071926;
  background: #f5d58c;
  font-weight: 900;
}

.trust-box strong {
  display: block;
  margin-bottom: 4px;
}

.trust-box p {
  margin: 0;
  color: rgba(237, 245, 255, 0.68);
  line-height: 1.55;
}

.form-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
  background: rgba(4, 18, 30, 0.36);
}

.form-header {
  margin-bottom: 30px;
}

.step-label {
  margin: 0 0 10px;
  color: rgba(245, 213, 140, 0.82);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.form-header h2 {
  margin: 0;
  font-size: clamp(34px, 4vw, 48px);
  letter-spacing: -0.05em;
}

.form-header p {
  margin: 12px 0 0;
  color: rgba(237, 245, 255, 0.68);
  line-height: 1.6;
}

.error-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
  padding: 14px 16px;
  border: 1px solid rgba(239, 68, 68, 0.22);
  border-radius: 16px;
  color: #fecaca;
  background: rgba(239, 68, 68, 0.1);
  animation: fadeUp 0.25s ease both;
}

.error-box span {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 999px;
  color: #071926;
  background: #fca5a5;
  font-size: 13px;
  font-weight: 950;
}

.error-box p {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
}

.login-form {
  display: grid;
  gap: 20px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  color: rgba(237, 245, 255, 0.82);
  font-size: 14px;
  font-weight: 800;
}

.field input {
  width: 100%;
  height: 58px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  outline: none;
  padding: 0 16px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.075);
  font: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.field input::placeholder {
  color: rgba(237, 245, 255, 0.38);
}

.field input:focus {
  border-color: rgba(245, 213, 140, 0.75);
  box-shadow: 0 0 0 4px rgba(245, 213, 140, 0.12);
  background: rgba(255, 255, 255, 0.095);
}

.password-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.forgot-btn {
  border: 0;
  padding: 0;
  color: #f5d58c;
  background: transparent;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.forgot-btn:hover {
  color: #ffffff;
  transform: translateY(-1px);
}

.password-wrap {
  position: relative;
}

.password-wrap input {
  padding-right: 58px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  transform: translateY(-50%);
  border: 0;
  border-radius: 12px;
  color: #f5d58c;
  background: rgba(245, 213, 140, 0.12);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.password-toggle:hover {
  color: #071926;
  background: #f5d58c;
  transform: translateY(-50%) scale(1.03);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(237, 245, 255, 0.72);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.remember-row input {
  width: 17px;
  height: 17px;
  accent-color: #f5d58c;
  cursor: pointer;
}

.submit-btn {
  height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 18px;
  color: #071926;
  background: linear-gradient(135deg, #f5d58c, #c99635);
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 22px 55px rgba(201, 150, 53, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 28px 70px rgba(201, 150, 53, 0.34);
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.72;
  transform: none;
}

.spinner {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(7, 25, 38, 0.35);
  border-top-color: #071926;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;
  color: rgba(237, 245, 255, 0.62);
  font-size: 14px;
}

.register-link button {
  border: 0;
  padding: 0;
  color: #f5d58c;
  background: transparent;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}
.register-link {
    flex-direction: column;
  }

.register-link button:hover {
  color: #ffffff;
  transform: translateY(-1px);
}

.copyright {
  margin: 26px 0 0;
  color: rgba(237, 245, 255, 0.38);
  text-align: center;
  font-size: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .brand-panel,
  .form-panel {
    padding: 34px;
  }
}

@media (max-width: 620px) {
  .login-page {
    padding: 18px;
  }

  .login-card {
    min-height: auto;
    border-radius: 24px;
  }

  .brand-panel,
  .form-panel {
    padding: 24px;
  }

  .hero-content h1 {
    font-size: clamp(2.5rem, 12vw, 3.5rem);
  }

  .subtitle {
    font-size: 1rem;
  }


}
</style>
