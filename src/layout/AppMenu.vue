<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppMenuItem from './AppMenuItem.vue'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('token')
  localStorage.removeItem('tenantCode')
  localStorage.removeItem('user')
  localStorage.removeItem('rememberMe')

  const tenantSlug = localStorage.getItem('tenantSlug')
  localStorage.removeItem('tenantSlug')

  const schoolName = localStorage.getItem('schoolName')
  localStorage.removeItem('schoolName')

  router.replace({ name: 'login' })
}

const model = ref([
  {
    label: 'Home',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        to: '/dashboard',
      },
      {
        label: 'Subscription & Plan',
        icon: 'pi pi-fw pi-tag',
        to: '/subscription',
      },
      // {
      //   label: 'School Domain',
      //   icon: 'pi pi-fw pi-globe',
      //   to: '/domain',
      // },
      // {
      //   label: 'SMS',
      //   icon: 'pi pi-fw pi-comments',
      //   to: '/sms',
      // },
      // {
      //   label: 'Billing Summary',
      //   icon: 'pi pi-fw pi-dollar',
      //   to: '/billing',
      // },
    ],
  },

  // {
  //   label: 'Settings',
  //   items: [
  //     {
  //       label: 'School Settings',
  //       icon: 'pi pi-fw pi-cog',
  //       to: '/settings',
  //     },
  //   ],
  // },

  {
    label: 'Account',
    items: [
      {
        label: 'Security',
        icon: 'pi pi-fw pi-shield',
        items: [
          {
            label: 'Change Password',
            icon: 'pi pi-fw pi-lock',
            to: '/change-password',
          },
        ],
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: handleLogout,
      },
    ],
  },
])
</script>

<template>
  <nav class="premium-menu-shell">
    <div class="menu-brand-card">
      <div class="brand-icon">
        P
      </div>

      <div class="brand-text">
        <span>Phena Admin</span>
        <strong>Workspace</strong>
      </div>
    </div>

    <div class="menu-caption">
      <span></span>
      Navigation
    </div>

    <ul class="layout-menu premium-layout-menu">
      <template v-for="(item, i) in model" :key="item.label">
        <app-menu-item
          v-if="!item.separator"
          :item="item"
          :index="i"
        />

        <li
          v-if="item.separator"
          class="menu-separator"
        ></li>
      </template>
    </ul>

    <div class="menu-footer-card">
      <div class="footer-glow"></div>

      <div class="footer-icon">
        🔐
      </div>

      <div>
        <strong>Secure Access</strong>
        <span>Protected tenant session</span>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.premium-menu-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100%;
  padding: 0.75rem;
  color: #0f172a;
}

/* Brand */
.menu-brand-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(96, 165, 250, 0.22), transparent 34%),
    linear-gradient(135deg, #07111f 0%, #0f172a 52%, #111827 100%);
  color: #ffffff;
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

.menu-brand-card::after {
  content: '';
  position: absolute;
  width: 130px;
  height: 130px;
  top: -70px;
  right: -55px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.35);
  filter: blur(2px);
}

.brand-icon {
  position: relative;
  z-index: 2;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.35), transparent 36%),
    linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-weight: 950;
  font-size: 1.25rem;
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.35);
}

.brand-text {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-text span {
  color: #bfdbfe;
  font-size: 0.74rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.brand-text strong {
  margin-top: 0.15rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 950;
  letter-spacing: -0.025em;
}

/* Caption */
.menu-caption {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0 0.55rem;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.11em;
}

.menu-caption span {
  width: 24px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, transparent);
}

/* Base menu */
.premium-layout-menu {
  flex: 1;
  margin: 0;
  padding: 0.2rem 0;
  list-style: none;
}

/* Prime/Sakai-style menu deep styling */
:deep(.layout-menuitem-root-text) {
  display: block;
  margin: 1.15rem 0 0.45rem;
  padding: 0 0.65rem;
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.11em;
}

:deep(li) {
  list-style: none;
}

:deep(li a),
:deep(li button),
:deep(.layout-menuitem-link) {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.78rem;
  min-height: 46px;
  margin: 0.18rem 0;
  padding: 0.78rem 0.9rem;
  border-radius: 16px;
  color: #334155;
  font-weight: 850;
  text-decoration: none;
  transition:
    background 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

:deep(li a::before),
:deep(.layout-menuitem-link::before) {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(96, 165, 250, 0.05));
  opacity: 0;
  transition: opacity 0.22s ease;
}

:deep(li a:hover),
:deep(.layout-menuitem-link:hover) {
  color: #1d4ed8;
  background: #eff6ff;
  transform: translateX(3px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
}

:deep(li a:hover::before),
:deep(.layout-menuitem-link:hover::before) {
  opacity: 1;
}

:deep(.layout-menuitem-icon),
:deep(.pi) {
  position: relative;
  z-index: 2;
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #2563eb;
  font-size: 0.95rem;
  transition:
    background 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease;
}

:deep(li a:hover .layout-menuitem-icon),
:deep(li a:hover .pi),
:deep(.layout-menuitem-link:hover .layout-menuitem-icon),
:deep(.layout-menuitem-link:hover .pi) {
  background: #2563eb;
  color: #ffffff;
  transform: scale(1.05);
}

:deep(.layout-menuitem-text) {
  position: relative;
  z-index: 2;
  flex: 1;
  line-height: 1.2;
}

:deep(.layout-submenu-toggler) {
  position: relative;
  z-index: 2;
  margin-left: auto;
  color: #94a3b8;
  transition: transform 0.22s ease, color 0.22s ease;
}

:deep(li a:hover .layout-submenu-toggler),
:deep(.layout-menuitem-link:hover .layout-submenu-toggler) {
  color: #2563eb;
}

/* Active route styling */
:deep(li.active-menuitem > a),
:deep(li.active-menuitem > .layout-menuitem-link),
:deep(a.router-link-active),
:deep(a.router-link-exact-active) {
  color: #ffffff !important;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 34%),
    linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
  box-shadow:
    0 14px 32px rgba(37, 99, 235, 0.28),
    inset 0 1px 1px rgba(255, 255, 255, 0.14);
}

:deep(li.active-menuitem > a .layout-menuitem-icon),
:deep(li.active-menuitem > a .pi),
:deep(a.router-link-active .layout-menuitem-icon),
:deep(a.router-link-active .pi),
:deep(a.router-link-exact-active .layout-menuitem-icon),
:deep(a.router-link-exact-active .pi) {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

:deep(li.active-menuitem > a .layout-submenu-toggler),
:deep(a.router-link-active .layout-submenu-toggler),
:deep(a.router-link-exact-active .layout-submenu-toggler) {
  color: #ffffff;
}

/* Improve nested submenu */
:deep(ul) {
  padding-left: 0.65rem;
}

:deep(ul ul) {
  margin: 0.25rem 0 0.45rem 1.05rem;
  padding-left: 0.65rem;
  border-left: 1px dashed #cbd5e1;
}

:deep(ul ul li a),
:deep(ul ul .layout-menuitem-link) {
  min-height: 40px;
  padding: 0.65rem 0.75rem;
  font-size: 0.9rem;
  border-radius: 14px;
}

:deep(ul ul .layout-menuitem-icon),
:deep(ul ul .pi) {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 11px;
  font-size: 0.85rem;
}

/* Logout emphasis */
:deep(li a[href='']),
:deep(.layout-menuitem-link) {
  cursor: pointer;
}

:deep(li:last-child > a:hover),
:deep(li:last-child > .layout-menuitem-link:hover) {
  background: #fef2f2;
  color: #b91c1c;
}

:deep(li:last-child > a:hover .layout-menuitem-icon),
:deep(li:last-child > a:hover .pi),
:deep(li:last-child > .layout-menuitem-link:hover .layout-menuitem-icon),
:deep(li:last-child > .layout-menuitem-link:hover .pi) {
  background: #fee2e2;
  color: #b91c1c;
}

/* Separator */
.menu-separator {
  height: 1px;
  margin: 0.8rem 0;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

/* Footer card */
.menu-footer-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding: 0.9rem;
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 32%),
    #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
}

.footer-glow {
  position: absolute;
  width: 110px;
  height: 110px;
  right: -65px;
  top: -65px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
}

.footer-icon {
  position: relative;
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #2563eb;
  flex-shrink: 0;
}

.menu-footer-card div:last-child {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.menu-footer-card strong {
  color: #0f172a;
  font-size: 0.86rem;
  font-weight: 950;
}

.menu-footer-card span {
  margin-top: 0.12rem;
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 700;
}

/* Mobile */
@media (max-width: 991px) {
  .premium-menu-shell {
    padding: 0.5rem;
  }

  .menu-brand-card {
    border-radius: 22px;
  }

  :deep(li a),
  :deep(.layout-menuitem-link) {
    min-height: 44px;
  }
}
</style>
