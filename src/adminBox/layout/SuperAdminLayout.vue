<template>
  <div class="superadmin-shell">
    <!-- Sidebar -->
    <aside
      :class="[
        'sidebar',
        {
          'sidebar-hidden': sidebarHidden,
          'sidebar-open': sidebarOpen,
        },
      ]"
    >
      <div class="brand">
        <div class="brand-logo">P</div>

        <div class="brand-text">
          <h1>Phena Admin</h1>
          <p>SuperAdmin Panel</p>
        </div>
      </div>

      <nav class="nav-menu">
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="nav-link-active"
          @click="closeSidebarOnMobile"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-card">
          <div class="admin-avatar">{{ adminInitials }}</div>

          <div class="admin-info">
            <strong>{{ adminName }}</strong>
            <small>{{ adminEmail }}</small>
          </div>
        </div>

        <button class="logout-button" type="button" @click="logout">
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main -->
    <main class="main">
      <header class="topbar">
        <div class="topbar-left">
          <!-- Mobile menu button -->
          <button class="menu-button" type="button" @click="sidebarOpen = true">
            ☰
          </button>

          <!-- Desktop hide/show button -->
          <button class="desktop-toggle-button" type="button" @click="toggleSidebar">
            {{ sidebarHidden ? 'Show Menu' : 'Hide Menu' }}
          </button>

          <div class="page-title-box">
            <h2>{{ pageTitle }}</h2>
            <p>Manage accounts, tenants, billing, and provisioning.</p>
          </div>
        </div>

        <div class="topbar-actions">
          <button class="quick-button" type="button" @click="goToDashboard">
            Dashboard
          </button>
        </div>
      </header>

      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)
const sidebarHidden = ref(false)

const menuItems = [
  {
    label: 'Dashboard',
    to: '/superadmin/dashboard',
    icon: '📊',
  },
  {
    label: 'Accounts',
    to: '/superadmin/accounts',
    icon: '🏫',
  },
  {
    label: 'Tenants',
    to: '/superadmin/tenants',
    icon: '🧩',
  },
  {
    label: 'Billing Calendar',
    to: '/superadmin/billing-calendar',
    icon: '📅',
  },
  {
    label: 'Transactions',
    to: '/superadmin/transactions',
    icon: '💳',
  },
  {
    label: 'Provisioning',
    to: '/superadmin/provisioning',
    icon: '⚙️',
  },
  {
    label: 'Audit Logs',
    to: '/superadmin/audit-logs',
    icon: '📝',
  },
  {
    label: 'Settings',
    to: '/superadmin/settings',
    icon: '🔐',
  },
  {
    label: 'Academic Calendar',
    to: '/superadmin/add-year-calendar',
    icon: '📅',
  },
]

const pageTitle = computed(() => {
  const map = {
    'superadmin-dashboard': 'Dashboard',
    'superadmin-accounts': 'Accounts',
    'superadmin-account-details': 'Account Details',
    'superadmin-tenants': 'Tenants',
    'superadmin-tenant-details': 'Tenant Details',
    'superadmin-billing-calendar': 'Billing Calendar',
    'superadmin-transactions': 'Transactions',
    'superadmin-provisioning': 'Provisioning',
    'superadmin-audit-logs': 'Audit Logs',
    'superadmin-settings': 'Settings',
    'superadmin-change-password': 'Change Password',
    'superadmin-academic-calendar': 'Academic Calendar',
  }

  return map[route.name] || 'SuperAdmin'
})

const adminName = computed(() => {
  return localStorage.getItem('superadmin_name') || 'Super Admin'
})

const adminEmail = computed(() => {
  return localStorage.getItem('superadmin_email') || 'admin@phena.app'
})

const adminInitials = computed(() => {
  const name = adminName.value || 'Super Admin'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
})

function toggleSidebar() {
  sidebarHidden.value = !sidebarHidden.value

  localStorage.setItem(
    'superadmin_sidebar_hidden',
    sidebarHidden.value ? 'yes' : 'no'
  )
}

function closeSidebarOnMobile() {
  sidebarOpen.value = false
}

function goToDashboard() {
  router.push('/superadmin/dashboard')
}

function logout() {
  localStorage.removeItem('superadmin_token')
  localStorage.removeItem('superadmin_name')
  localStorage.removeItem('superadmin_email')

  router.push('/superadmin/login')
}

onMounted(() => {
  sidebarHidden.value =
    localStorage.getItem('superadmin_sidebar_hidden') === 'yes'
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.superadmin-shell {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  font-family: Inter, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  min-height: 100vh;
  background: #0f172a;
  color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 30;
  transition: margin-left 0.25s ease;
}

.sidebar-hidden {
  margin-left: -280px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
}

.brand-logo {
  width: 46px;
  height: 46px;
  min-width: 46px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
}

.brand-text h1 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 900;
}

.brand-text p {
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 0.8rem;
}

/* Navigation */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 13px;
  border-radius: 14px;
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 800;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-link-active {
  background: #ffffff;
  color: #0f172a;
}

.nav-icon {
  width: 24px;
  min-width: 24px;
  text-align: center;
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Footer */
.sidebar-footer {
  margin-top: 20px;
}

.admin-card {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 12px;
}

.admin-avatar {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 14px;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.admin-info strong {
  display: block;
  font-size: 0.9rem;
}

.admin-info small {
  display: block;
  color: #94a3b8;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-button {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 12px;
  font-weight: 900;
  background: #dc2626;
  color: #ffffff;
  cursor: pointer;
}

/* Main */
.main {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.topbar {
  min-height: 84px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 20;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.page-title-box {
  min-width: 0;
}

.topbar h2 {
  margin: 0 0 4px;
  font-size: 1.2rem;
  font-weight: 900;
}

.topbar p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.menu-button,
.desktop-toggle-button {
  border: none;
  border-radius: 12px;
  background: #f1f5f9;
  color: #0f172a;
  padding: 10px 13px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
}

.menu-button {
  display: none;
  font-size: 1.2rem;
}

.desktop-toggle-button {
  display: inline-flex;
}

.topbar-actions {
  display: flex;
  gap: 10px;
}

.quick-button {
  border: none;
  border-radius: 12px;
  padding: 11px 14px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
}

.content {
  padding: 24px;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}

/* Mobile overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 25;
}

/* Mobile */
@media (max-width: 980px) {
  .sidebar {
    position: fixed;
    left: -300px;
    top: 0;
    bottom: 0;
    width: 280px;
    min-width: 280px;
    margin-left: 0;
    transition: left 0.25s ease;
  }

  .sidebar-hidden {
    margin-left: 0;
  }

  .sidebar-open {
    left: 0;
  }

  .menu-button {
    display: inline-flex;
  }

  .desktop-toggle-button {
    display: none;
  }

  .content {
    padding: 16px;
  }
}

@media (max-width: 640px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar-left {
    align-items: flex-start;
  }

  .quick-button {
    width: 100%;
  }
}
</style>
