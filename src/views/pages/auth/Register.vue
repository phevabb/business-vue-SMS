

<template>
     <Toast />
  <main class="register-page">
    <section class="register-card">
      <!-- LEFT BRAND PANEL -->
      <aside class="brand-panel">
        <div class="logo-badge">
          P
        </div>

        <div class="hero-content">
          <p class="eyebrow">PHENA SCHOOL MANAGEMENT SYSTEM</p>

          <h1 style="color: papayawhip">
            Register your school in minutes.
          </h1>

          <p class="subtitle">
            Create a secure digital workspace for admissions, academics,
            finance, attendance, reports, and school administration.
          </p>
        </div>

        <div class="trust-box">
          <span class="shield-icon">✓</span>
          <div>
            <strong>Secure onboarding</strong>
            <p>Your school profile is protected and ready for cloud setup.</p>
          </div>
        </div>
      </aside>

      <!-- RIGHT FORM PANEL -->
      <section class="form-panel">
        <div class="form-header">
          <!-- <p class="step-label">Step 1 of 3</p> -->



          <h2 style="color: papayawhip;">School Registration</h2>
          <p>Tell us about your school to begin your setup.</p>
        </div>

        <form @submit.prevent="submitForm" class="school-form">
          <!-- LOGO UPLOAD -->
          <label class="upload-box">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              @change="handleLogoUpload"
            />

            <div class="upload-preview">
              <img :src="logoPreview" alt="Logo Preview" v-if="logoPreview"/>
            </div>

            <div>
              <strong>Upload school logo</strong>
              <small>PNG, JPG, WEBP or SVG. Max 2MB.</small>
            </div>
          </label>

          <div class="field">
            <label>School Name *</label>
            <input
              v-model="form.schoolName"
              type="text"
              placeholder="e.g. King Of Glory International School"
            />
            <small v-if="errors.schoolName" class="error">
              {{ errors.schoolName }}
            </small>
          </div>

          <div class="grid">
            <div class="field">
              <label>Phone Number *</label>
              <input
                v-model="form.phoneNumber"
                type="tel"
                placeholder="+233 24 000 0000"
              />
              <small v-if="errors.phoneNumber" class="error">
                {{ errors.phoneNumber }}
              </small>
            </div>

            <div class="field">
              <label>Email Address *</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="school@email.com"
              />
              <small v-if="errors.email" class="error">
                {{ errors.email }}
              </small>
            </div>
          </div>

          <div class="grid">
            <div class="field">
              <label>Estimated Students *</label>
              <input
                v-model.number="form.estimatedStudents"
                type="number"
                min="1"
                placeholder="e.g. 850"
              />
              <small v-if="errors.estimatedStudents" class="error">
                {{ errors.estimatedStudents }}
              </small>
            </div>

            <div class="field">
              <label>Academic Year *</label>
              <input
                v-model="form.academicYear"
                type="text"
                placeholder="e.g. 2025/2026"
              />
              <small v-if="errors.academicYear" class="error">
                {{ errors.academicYear }}
              </small>
            </div>
          </div>

          <div class="field">
            <label>School Location</label>
            <input
              v-model="form.location"
              type="text"
              placeholder="City, Region, Country"
            />
          </div>

          <div class="field">
            <label>Full Name *</label>
            <input
              v-model="form.fullName"
              type="text"
              placeholder="e.g. Kwame Aidoo"
            />
            <small v-if="errors.fullName" class="error">
              {{ errors.fullName }}
            </small>
          </div>

         <div class="grid">
            <div class="field">
                <label>Password *</label>

            <div class="password-input-wrap">
            <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create password"
            />



            <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
            >
                {{ showPassword ? 'Hide' : 'Show' }}
            </button>
    </div>

    <div
      v-if="form.password"
      class="password-strength"
      :class="passwordStrengthClass"
    >
      <div class="strength-track">
        <span class="strength-bar"></span>
      </div>

      <div class="strength-meta">
        <small>Password strength</small>
        <strong>{{ passwordStrengthLabel }}</strong>
      </div>
    </div>

    <div v-if="form.password" class="password-rules">
      <p :class="{ passed: passwordRules.minLength }">
        <span>{{ passwordRules.minLength ? '✓' : '•' }}</span>
        At least 8 characters
      </p>

      <p :class="{ passed: passwordRules.uppercase }">
        <span>{{ passwordRules.uppercase ? '✓' : '•' }}</span>
        One uppercase letter
      </p>

      <p :class="{ passed: passwordRules.lowercase }">
        <span>{{ passwordRules.lowercase ? '✓' : '•' }}</span>
        One lowercase letter
      </p>

      <p :class="{ passed: passwordRules.number }">
        <span>{{ passwordRules.number ? '✓' : '•' }}</span>
        One number
      </p>

      <p :class="{ passed: passwordRules.special }">
        <span>{{ passwordRules.special ? '✓' : '•' }}</span>
        One special character
      </p>
    </div>

    <small v-if="errors.password" class="error">
      {{ errors.password }}
    </small>
  </div>

  <div class="field">
    <label>Confirm Password *</label>

    <div class="password-input-wrap">
      <input
        v-model="form.confirmPassword"
        :type="showConfirmPassword ? 'text' : 'password'"
        placeholder="Confirm password"
      />

      <button
        type="button"
        class="password-toggle"
        @click="showConfirmPassword = !showConfirmPassword"
      >
        {{ showConfirmPassword ? 'Hide' : 'Show' }}
      </button>
    </div>

    <transition name="fade-slide">
      <div
        v-if="form.confirmPassword"
        class="match-status"
        :class="{ matched: passwordsMatch, unmatched: !passwordsMatch }"
      >
        <span>{{ passwordsMatch ? '✓' : '!' }}</span>
        <small>
          {{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}
        </small>
      </div>
    </transition>

    <small v-if="errors.confirmPassword" class="error">
      {{ errors.confirmPassword }}
    </small>
  </div>
</div>

          <button class="submit-btn" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Creating school profile...' : 'Continue Setup' }}
          </button>
        </form>


        <div class="register-link">
                  <span style="color: papayawhip">registered?</span>

                  <button
                    type="button"
                    @click="router.push('/auth/login')"
                  >
                    Login
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

<script setup>
import { registerSchool } from '@/services/auth'
import { useToast } from 'primevue/usetoast'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const logoFile = ref(null)
const logoPreview = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  schoolName: '',
  phoneNumber: '',
  email: '',
  estimatedStudents: null,
  academicYear: '',
  location: '',
  fullName: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  schoolName: '',
  phoneNumber: '',
  email: '',
  estimatedStudents: '',
  academicYear: '',
  fullName: '',
  password: '',
  confirmPassword: '',
})

const passwordRules = computed(() => {
  return {
    minLength: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  }
})

const passwordScore = computed(() => {
  return Object.values(passwordRules.value).filter(Boolean).length
})

const passwordStrengthLabel = computed(() => {
  if (!form.password) return ''

  if (passwordScore.value <= 2) {
    return 'Weak'
  }

  if (passwordScore.value <= 4) {
    return 'Good'
  }

  return 'Strong'
})

const passwordStrengthClass = computed(() => {
  if (passwordScore.value <= 2) {
    return 'weak'
  }

  if (passwordScore.value <= 4) {
    return 'good'
  }

  return 'strong'
})

const isStrongPassword = computed(() => {
  return passwordScore.value === 5
})

const passwordsMatch = computed(() => {
  return (
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword
  )
})

function showToast(severity, summary, detail) {
  toast.add({
    severity,
    summary,
    detail,
    life: 4000,
  })
}

function handleLogoUpload(event) {
  const file = event.target.files?.[0]

  if (!file) return

  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
  ]

  const maxSize = 2 * 1024 * 1024

  if (!allowedTypes.includes(file.type)) {
    showToast(
      'error',
      'Invalid logo',
      'Please upload PNG, JPG, WEBP or SVG only.',
    )
    return
  }

  if (file.size > maxSize) {
    showToast(
      'error',
      'Logo too large',
      'Logo must not be more than 2MB.',
    )
    return
  }

  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)

  showToast(
    'success',
    'Logo selected',
    'School logo selected successfully.',
  )
}

function resetErrors() {
  errors.schoolName = ''
  errors.phoneNumber = ''
  errors.email = ''
  errors.estimatedStudents = ''
  errors.academicYear = ''
  errors.fullName = ''
  errors.password = ''
  errors.confirmPassword = ''
}

function isValidAcademicYear(value) {
  const academicYearRegex = /^\d{4}\s*\/\s*\d{4}$/

  if (!academicYearRegex.test(value)) {
    return false
  }

  const [startYear, endYear] = value
    .split('/')
    .map((year) => Number(year.trim()))

  return endYear === startYear + 1
}

function validateForm() {
  resetErrors()

  let valid = true

  if (!form.schoolName.trim()) {
    errors.schoolName = 'School name is required.'
    valid = false
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required.'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
    valid = false
  }

  if (!form.estimatedStudents || Number(form.estimatedStudents) < 1) {
    errors.estimatedStudents = 'Estimated students is required.'
    valid = false
  }

  if (!form.academicYear.trim()) {
    errors.academicYear = 'Academic year is required.'
    valid = false
  } else if (!isValidAcademicYear(form.academicYear.trim())) {
    errors.academicYear = 'Use a valid academic year like 2025/2026.'
    valid = false
  }

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Password is required.'
    valid = false
  } else if (!isStrongPassword.value) {
    errors.password =
      'Password must include uppercase, lowercase, number, special character, and at least 8 characters.'
    valid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
    valid = false
  } else if (!passwordsMatch.value) {
    errors.confirmPassword = 'Passwords do not match.'
    valid = false
  }

  if (!valid) {
    showToast(
      'warn',
      'Check form',
      'Please correct the highlighted fields.',
    )
  }

  return valid
}

async function submitForm() {


  if (!validateForm()) {

    return
  }

  loading.value = true

  try {
    const payload = {
      email: form.email.trim(),
      password: form.password.trim(),
      passwordConfirm: form.confirmPassword.trim(),
      schoolName: form.schoolName.trim(),
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      estimatedStudents: Number(form.estimatedStudents),
      academicYear: form.academicYear.trim(),
      location: form.location.trim(),
      profilePictureUrl: '',
    }



    const response = await registerSchool(payload)


    showToast(
      'success',
      'Registration successful. Please verify your email.',
      'School profile created successfully.',
    )
    router.push({ name: 'EmailVerificationSent' })
  } catch (error) {
    console.error('REGISTER ERROR:', error)
    console.error('REGISTER ERROR DATA:', error.response?.data)

    const detail =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.data ||
      error.message ||
      'Registration failed. Please try again.'

    showToast(
      'error',
      'Registration failed',
      String(detail),
    )
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.register-page {
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

.register-card {
  width: min(1120px, 100%);
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



.brand-panel h1 {
  max-width: 420px;
  margin: 0;
  font-size: clamp(36px, 5vw, 58px);
  line-height: 1;
  letter-spacing: -0.06em;
}


.copyright {
  margin: 26px 0 0;
  color: rgba(237, 245, 255, 0.38);
  text-align: center;
  font-size: 12px;
}


.hero-content {
    max-width: 700px;
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
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 800;
    line-height: 1.05;
    color: white;
    margin-bottom: 1.5rem;
    letter-spacing: -0.04em;
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

.hero-content h1 span {
    display: block;
    background: linear-gradient(
        90deg,
        #fbbf24,
        #f59e0b,
        #f97316
    );

    -webkit-text-fill-color: transparent;
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
  font-size: clamp(30px, 4vw, 42px);
  letter-spacing: -0.05em;
}

.form-header p {
  margin: 12px 0 0;
  color: rgba(237, 245, 255, 0.68);
  line-height: 1.6;
}

.school-form {
  display: grid;
  gap: 20px;
}

.upload-box {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 104px;
  padding: 18px;
  border: 1px dashed rgba(245, 213, 140, 0.36);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.055);
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.upload-box:hover {
  transform: translateY(-2px);
  border-color: rgba(245, 213, 140, 0.8);
  background: rgba(255, 255, 255, 0.085);
}

.upload-box input {
  display: none;
}

.upload-preview {
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  overflow: hidden;
  flex: 0 0 auto;
  border-radius: 18px;
  color: #f5d58c;
  background: rgba(245, 213, 140, 0.12);
  font-size: 32px;
  font-weight: 300;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-box strong {
  display: block;
  margin-bottom: 4px;
}

.upload-box small {
  color: rgba(237, 245, 255, 0.58);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
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

.field input,
.field select {
  width: 100%;
  height: 56px;
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

.field input:focus,
.field select:focus {
  border-color: rgba(245, 213, 140, 0.75);
  box-shadow: 0 0 0 4px rgba(245, 213, 140, 0.12);
  background: rgba(255, 255, 255, 0.095);
}

.field select {
  appearance: none;
}

.error {
  color: #ffb3bd;
  font-size: 12px;
  font-weight: 700;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .register-card {
    grid-template-columns: 1fr;
  }

  .brand-panel,
  .form-panel {
    padding: 34px;
  }
}

@media (max-width: 620px) {
  .register-page {
    padding: 18px;
  }

  .register-card {
    border-radius: 24px;
  }

  .brand-panel,
  .form-panel {
    padding: 24px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .upload-box {
    align-items: flex-start;
    flex-direction: column;
  }
}

.password-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrap input {
  padding-right: 78px;
}

.password-toggle {
  position: absolute;
  right: 10px;
  height: 36px;
  min-width: 56px;
  border: 0;
  border-radius: 12px;
  color: #071926;
  background: linear-gradient(135deg, #f5d58c, #c99635);
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease;
}

.password-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(201, 150, 53, 0.24);
}

.password-strength {
  display: grid;
  gap: 8px;
  margin-top: 4px;
  animation: fadeUp 0.25s ease both;
}


.register-link {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding-top: 30px;
  text-align: center;
  width: 100%;
}

.register-link span {
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

.register-link button:hover {
  color: #ffffff;
  transform: translateY(-1px);
}





.strength-track {
  width: 100%;
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.strength-bar {
  display: block;
  height: 100%;
  width: 0%;
  border-radius: inherit;
  transition:
    width 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;
}

.password-strength.weak .strength-bar {
  width: 35%;
  background: #ef4444;
  box-shadow: 0 0 18px rgba(239, 68, 68, 0.35);
}

.password-strength.good .strength-bar {
  width: 70%;
  background: #fbbf24;
  box-shadow: 0 0 18px rgba(251, 191, 36, 0.35);
}

.password-strength.strong .strength-bar {
  width: 100%;
  background: #22c55e;
  box-shadow: 0 0 18px rgba(34, 197, 94, 0.35);
}

.strength-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.server-error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  color: #fecaca;
  background: rgba(239, 68, 68, 0.13);
  border: 1px solid rgba(239, 68, 68, 0.22);
  font-size: 13px;
  font-weight: 800;
}

.server-success {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  color: #86efac;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.2);
  font-size: 13px;
  font-weight: 800;
}

.strength-meta small {
  color: rgba(237, 245, 255, 0.58);
  font-size: 12px;
}

.strength-meta strong {
  font-size: 12px;
  font-weight: 900;
}

.password-strength.weak .strength-meta strong {
  color: #fca5a5;
}

.password-strength.good .strength-meta strong {
  color: #fbbf24;
}

.password-strength.strong .strength-meta strong {
  color: #86efac;
}

.password-rules {
  display: grid;
  gap: 7px;
  margin-top: 4px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  animation: fadeUp 0.25s ease both;
}

.password-rules p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: rgba(237, 245, 255, 0.52);
  font-size: 12px;
  font-weight: 700;
  transition:
    color 0.25s ease,
    transform 0.25s ease;
}

.password-rules p span {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: rgba(237, 245, 255, 0.58);
  background: rgba(255, 255, 255, 0.08);
  font-size: 11px;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.password-rules p.passed {
  color: #86efac;
  transform: translateX(2px);
}

.password-rules p.passed span {
  color: #071926;
  background: #86efac;
  transform: scale(1.05);
}

.match-status {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 4px;
  padding: 11px 12px;
  border-radius: 14px;
  font-weight: 800;
}

.match-status span {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
}

.match-status small {
  font-size: 12px;
  font-weight: 800;
}

.match-status.matched {
  color: #86efac;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.18);
}

.match-status.matched span {
  color: #071926;
  background: #86efac;
}

.match-status.unmatched {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.18);
}

.match-status.unmatched span {
  color: #071926;
  background: #fca5a5;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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
</style>
