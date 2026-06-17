<template>
  <main class="verification-page">
    <section class="verification-card">
      <div class="icon-wrap">
        <div class="icon-circle">
          <span>✉</span>
        </div>
      </div>

      <p class="eyebrow">Email Verification</p>

      <h1 style="color: papayawhip;">Verification email sent</h1>

      <p class="message">
        Your school profile has been created successfully. We have sent a verification
        link to your email address.
      </p>

      <div class="instruction-box">
        <span class="instruction-icon">✓</span>
        <p>
          Open your email inbox and click the verification link to activate your account.
        </p>
      </div>

      <p class="hint">
        If you do not see the email, please check your spam or promotions folder.
      </p>

      <div class="actions">
        <RouterLink to="auth/login" class="primary-btn">
          Login here
        </RouterLink>

        <RouterLink to="/" class="secondary-btn">
          Home
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.verification-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  color: #ffffff;
  background:
    radial-gradient(circle at top left, rgba(245, 213, 140, 0.24), transparent 32%),
    radial-gradient(circle at bottom right, rgba(22, 139, 118, 0.28), transparent 38%),
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

.verification-card {
  width: min(520px, 100%);
  padding: 42px;
  text-align: center;
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(26px);
  animation: fadeUp 0.45s ease both;
}

.icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.icon-circle {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  border-radius: 30px;
  color: #071926;
  background: linear-gradient(135deg, #f5d58c, #c99635);
  box-shadow: 0 24px 60px rgba(201, 150, 53, 0.32);
}

.icon-circle span {
  font-size: 42px;
  line-height: 1;
}

.eyebrow {
  margin: 0 0 12px;
  color: #fbbf24;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(32px, 5vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.055em;
}

.message {
  margin: 18px auto 0;
  max-width: 420px;
  color: rgba(237, 245, 255, 0.76);
  font-size: 1rem;
  line-height: 1.75;
}

.instruction-box {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 28px;
  padding: 18px;
  text-align: left;
  border-radius: 20px;
  border: 1px solid rgba(134, 239, 172, 0.22);
  background: rgba(34, 197, 94, 0.1);
}

.instruction-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 999px;
  color: #071926;
  background: #86efac;
  font-size: 14px;
  font-weight: 950;
}

.instruction-box p {
  margin: 0;
  color: rgba(237, 245, 255, 0.82);
  font-size: 0.95rem;
  line-height: 1.55;
  font-weight: 700;
}

.hint {
  margin: 18px 0 0;
  color: rgba(237, 245, 255, 0.56);
  font-size: 0.9rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  min-width: 140px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 950;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.primary-btn {
  color: #071926;
  background: linear-gradient(135deg, #f5d58c, #c99635);
  box-shadow: 0 20px 48px rgba(201, 150, 53, 0.24);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 62px rgba(201, 150, 53, 0.34);
}

.secondary-btn {
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.075);
}

.secondary-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 520px) {
  .verification-card {
    padding: 30px 22px;
    border-radius: 26px;
  }

  .actions {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
</style>
