<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

function smoothScroll(id) {
  const element = document.getElementById(id)

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  mobileMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="topbar">
    <!-- LEFT: LOGO -->
    <div class="brand">
      <img src="/logo.png" alt="Logo" class="logo" />
      <span class="brand-name">Phena SMS</span>
    </div>

    <!-- DESKTOP: NAV -->
    <nav class="nav desktop-nav">
      <a @click="smoothScroll('hero')" class="nav-link">Home</a>
      <a @click="smoothScroll('features')" class="nav-link">Features</a>
      <a @click="smoothScroll('highlights')" class="nav-link">Highlights</a>
      <a @click="smoothScroll('pricing')" class="nav-link">Pricing</a>
    </nav>

    <!-- DESKTOP: ACTIONS -->
    <div class="actions desktop-actions">
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

    <!-- MOBILE: HAMBURGER -->
    <button
      class="mobile-toggle"
      type="button"
      :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
      aria-label="Toggle navigation menu"
      @click="toggleMobileMenu"
    >
      <span :class="{ active: mobileMenuOpen }"></span>
      <span :class="{ active: mobileMenuOpen }"></span>
      <span :class="{ active: mobileMenuOpen }"></span>
    </button>

    <!-- MOBILE MENU -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <nav class="mobile-nav">
        <a @click="smoothScroll('hero')" class="mobile-nav-link">Home</a>
        <a @click="smoothScroll('features')" class="mobile-nav-link">Features</a>
        <a @click="smoothScroll('highlights')" class="mobile-nav-link">Highlights</a>
        <a @click="smoothScroll('pricing')" class="mobile-nav-link">Pricing</a>
      </nav>

      <div class="mobile-actions">
        <Button
          label="Login"
          class="btn mobile-btn btn-light"
          as="router-link"
          to="/auth/login"
          @click="closeMobileMenu"
        />

        <Button
          label="Sign Up"
          class="btn mobile-btn btn-outline"
          as="router-link"
          to="/auth/register"
          @click="closeMobileMenu"
        />

        <Button
          label="Request Demo"
          class="btn mobile-btn btn-dark"
          as="a"
          href="https://calendly.com/phevab1/30min"
          target="_blank"
          @click="closeMobileMenu"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* TOPBAR */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 18px 60px;

  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* BRAND */
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
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
  white-space: nowrap;
}

/* DESKTOP NAV */
.nav {
  display: flex;
  gap: 36px;
  align-items: center;
}

.nav-link {
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: 0.2s ease;
  text-decoration: none;
}

.nav-link:hover {
  color: #000000;
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  font-size: 16px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: 0.2s ease;
  white-space: nowrap;
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

/* MOBILE TOGGLE */
.mobile-toggle {
  display: none;
  width: 44px;
  height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.mobile-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background: #111827;
  border-radius: 999px;
  transition: 0.25s ease;
}

.mobile-toggle span:nth-child(1).active {
  transform: translateY(7px) rotate(45deg);
}

.mobile-toggle span:nth-child(2).active {
  opacity: 0;
}

.mobile-toggle span:nth-child(3).active {
  transform: translateY(-7px) rotate(-45deg);
}

/* MOBILE MENU */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 16px;
  right: 16px;

  display: none;

  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 18px;

  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.mobile-nav-link {
  padding: 13px 14px;
  border-radius: 12px;
  color: #374151;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.mobile-nav-link:hover {
  background: #f3f4f6;
  color: #000;
}

.mobile-actions {
  display: grid;
  gap: 10px;
}

.mobile-btn {
  width: 100%;
  justify-content: center;
}

/* TABLET */
@media (max-width: 1180px) {
  .topbar {
    padding: 16px 32px;
  }

  .logo {
    width: 100px;
  }

  .brand-name {
    font-size: 22px;
  }

  .nav {
    gap: 22px;
  }

  .nav-link {
    font-size: 16px;
  }

  .btn {
    font-size: 14px;
    padding: 9px 14px;
  }
}

/* MOBILE */
@media (max-width: 920px) {
  .topbar {
    padding: 14px 18px;
  }

  .desktop-nav,
  .desktop-actions {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .logo {
    width: 82px;
  }

  .brand-name {
    font-size: 20px;
  }
}

/* SMALL MOBILE */
@media (max-width: 480px) {
  .topbar {
    padding: 12px 14px;
  }

  .brand {
    gap: 8px;
  }

  .logo {
    width: 70px;
  }

  .brand-name {
    font-size: 17px;
  }

  .mobile-toggle {
    width: 40px;
    height: 40px;
  }

  .mobile-menu {
    left: 10px;
    right: 10px;
    padding: 14px;
    border-radius: 16px;
  }

  .mobile-nav-link {
    font-size: 15px;
    padding: 12px;
  }
}
</style>
