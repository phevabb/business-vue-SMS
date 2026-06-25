<script setup>
function smoothScroll(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
</script>

<template>
  <header class="topbar">

    <!-- LEFT: LOGO -->
    <div class="brand">
      <img src="/logo.png" alt="Logo" class="logo" />
      <span class="brand-name">Phena SMS</span>
    </div>

    <!-- CENTER: NAV -->
    <nav class="nav">
      <a @click="smoothScroll('hero')" class="nav-link">Home</a>
      <a @click="smoothScroll('features')" class="nav-link">Features</a>
      <a @click="smoothScroll('highlights')" class="nav-link">Highlights</a>
      <a @click="smoothScroll('pricing')" class="nav-link">Pricing</a>
    </nav>

    <!-- RIGHT: ACTIONS -->
    <div class="actions">
      <Button label="Login" class="btn btn-light" as="router-link" to="/auth/login" />
      <Button label="Sign Up" class="btn btn-outline" as="router-link" to="/auth/register" />
      <Button
        label="Request Demo"
        class="btn btn-dark"
        as="a"
        href="https://calendly.com/phevab1/30min"
        target="_blank"
      />
    </div>

  </header>
</template>

<style scoped>

/* TOPBAR */
.topbar {
  position: fixed;   /* makes it stick */
  top: 0;             /* stick to top */
  z-index: 1000;      /* stay above everything */
  width: 100%;          /* full width */

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 60px;

  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* BRAND */
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.brand-name {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

/* NAV */
.nav {
  display: flex;
  gap: 36px;
}

.nav-link {
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: 0.2s ease;
}

.nav-link:hover {
  color: #000000;
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 12px;
}

.btn {
  font-size: 16px;
  font-weight: 600;

  padding: 10px 18px;
  border-radius: 8px;

  cursor: pointer;
  border: none;

  transition: 0.2s ease;
}

.btn-light {
  background: transparent;
  color: #111827;
}

.btn-light:hover {
  background: #f3f4f6;
}

.btn-outline {
  background: transparent;
  border: 2px solid #e5e7eb;
  color: #111827;
}

.btn-outline:hover {
  border-color: #000;
}

.btn-dark {
  background: #000;
  color: #fff;
}

.btn-dark:hover {
  background: #1f2937;
}

</style>
