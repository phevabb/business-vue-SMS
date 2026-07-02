<template>
  <footer class="footer-section">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-brand">
          <h3>Phena SMS</h3>
          <p>
            A simple, modern school management system for managing students,
            fees, billing, communication, and school operations with confidence.
          </p>

          <a href="mailto:support@phenaschool.com" class="email-card">
            <span class="email-label">Need help?</span>
            <strong>support@phenaschool.com</strong>
          </a>
        </div>

        <!-- Product -->
        <div class="footer-column">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#highlights">Highlights</a>
          <a href="#hero">Get Started</a>
        </div>

        <!-- Solutions -->
        <div class="footer-column">
          <h4>Solutions</h4>
          <span>Student Profiles</span>
          <span>Fees Management</span>
          <span>Invoices & Payments</span>
          <span>Academic Records</span>
        </div>

        <!-- Support -->
        <div class="footer-column">
          <h4>Support</h4>
          <a href="mailto:support@phenaschool.com">Contact Support</a>
          <a
            href="https://cal.com/emmanuel-aidoo-wphafq/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request Demo
          </a>
          <span>Onboarding Help</span>
          <span>School Setup</span>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          © {{ currentYear }} Phena Systems. All rights reserved.
        </p>

        <div class="footer-bottom-links">
          <a href="mailto:support@phenaschool.com">Contact</a>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer-section {
  margin-top: 5rem;
  padding: 4rem 1.5rem 2rem;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-top: 1px solid #e5e7eb;
}

.footer-container {
  max-width: 1180px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 3rem;
}

.footer-brand h3 {
  margin: 0 0 1rem;
  color: #0f172a;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.footer-brand p {
  max-width: 420px;
  margin: 0;
  color: #64748b;
  font-size: 1rem;
  line-height: 1.8;
}

.email-card {
  display: inline-flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 1.5rem;
  padding: 1rem 1.15rem;
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  transition: 0.2s ease;
}

.email-card:hover {
  transform: translateY(-2px);
  border-color: #2563eb;
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.12);
}

.email-label {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.email-card strong {
  color: #2563eb;
  font-size: 0.98rem;
  font-weight: 900;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-column h4 {
  margin: 0 0 0.5rem;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
}

.footer-column a,
.footer-column span {
  color: #64748b;
  font-size: 0.96rem;
  line-height: 1.5;
  text-decoration: none;
  transition: 0.2s ease;
}

.footer-column a:hover {
  color: #2563eb;
  transform: translateX(3px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 3.2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.footer-bottom p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.92rem;
}

.footer-bottom-links {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.footer-bottom-links a,
.footer-bottom-links span {
  color: #64748b;
  font-size: 0.92rem;
  text-decoration: none;
  font-weight: 700;
}

.footer-bottom-links a:hover {
  color: #2563eb;
}

/* Responsive */
@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-brand {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .footer-section {
    padding: 3rem 1rem 1.5rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-brand {
    grid-column: span 1;
  }

  .footer-brand h3 {
    font-size: 1.7rem;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .email-card {
    width: 100%;
  }
}
</style>
