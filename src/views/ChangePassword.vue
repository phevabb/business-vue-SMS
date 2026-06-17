<template>
  <div class="password-page">
    <section class="password-card">
      <span class="badge">Security</span>

      <h1>Change Password</h1>
      <p>Update your account password to keep your workspace secure.</p>

      <form class="password-form" @submit.prevent="changePassword">
        <div class="field">
          <label>Current Password</label>
          <input
            v-model="form.currentPassword"
            type="password"
            placeholder="Enter current password"
          />
        </div>

        <div class="field">
          <label>New Password</label>
          <input
            v-model="form.newPassword"
            type="password"
            placeholder="Enter new password"
          />
        </div>

        <div class="field">
          <label>Confirm New Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm new password"
          />
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
import { reactive, ref } from 'vue'

const loading = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const changePassword = async () => {
  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    alert('Please complete all fields.')
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    alert('New passwords do not match.')
    return
  }

  loading.value = true

  try {
    // TODO: connect to backend endpoint later
    await new Promise((resolve) => setTimeout(resolve, 800))

    alert('Password updated successfully.')

    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (error) {
    alert('Unable to update password.')
  } finally {
    loading.value = false
  }
}
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

.field input {
  width: 100%;
  height: 50px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0 14px;
  outline: none;
}

.field input:focus {
  border-color: #c99635;
  box-shadow: 0 0 0 4px rgba(201, 150, 53, 0.12);
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
