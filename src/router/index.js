import SuperAdminLayout from '@/adminBox/layout/SuperAdminLayout.vue'
import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Public landing
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/pages/Landing.vue'),
  },{
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/pages/DemoSection.vue'),
  },

  // Public business auth pagesre
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue'),
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/views/pages/auth/Register.vue'),
  },
  {
    path: '/email-verification-sent',
    name: 'EmailVerificationSent',
    component: () => import('@/views/pages/auth/EmailVerificationSent.vue'),
  },

  // SuperAdmin login
  {
    path: '/superadmin/login',
    name: 'superadmin-login',
    component: () => import('@/adminBox/views/registration/SuperAdminLogin.vue'),
    meta: { superAdminGuestOnly: true },
  },

  // Protected SuperAdmin
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { superAdminGuestOnly: true },

    // meta: { requiresSuperAdminAuth: true },
    children: [
      { path: '', redirect: '/superadmin/dashboard' },
      { path: 'dashboard', name: 'superadmin-dashboard', component: () => import('@/adminBox/views/superadmin/SuperAdminDashboard.vue') },
      { path: 'accounts', name: 'superadmin-accounts', component: () => import('@/adminBox/views/superadmin/SuperAdminAccounts.vue') },
      { path: 'add-year-calendar', name: 'superadmin-add-year-calendar', component: () => import('@/adminBox/views/superadmin/SuperAdminAddYearCalendar.vue') },


      //   { path: 'accounts/:id', name: 'superadmin-account-details', component: () => import('@/adminBox/views/superadmin/SuperAdminAccountDetails.vue'), props: true },
       { path: 'tenants', name: 'superadmin-tenants', component: () => import('@/adminBox/views/superadmin/SuperAdminTenants.vue') },
    //   { path: 'tenants/:tenantCode', name: 'superadmin-tenant-details', component: () => import('@/adminBox/views/superadmin/SuperAdminTenantDetails.vue'), props: true },
    //   { path: 'transactions', name: 'superadmin-transactions', component: () => import('@/adminBox/views/superadmin/SuperAdminTransactions.vue') },
    //   { path: 'provisioning', name: 'superadmin-provisioning', component: () => import('@/adminBox/views/superadmin/SuperAdminProvisioning.vue') },
    //   { path: 'audit-logs', name: 'superadmin-audit-logs', component: () => import('@/adminBox/views/superadmin/SuperAdminAuditLogs.vue') },
    //   { path: 'settings', name: 'superadmin-settings', component: () => import('@/adminBox/views/superadmin/SuperAdminSettings.vue') },
    //   { path: 'change-password', name: 'superadmin-change-password', component: () => import('@/adminBox/views/superadmin/SuperAdminChangePassword.vue') },
    ],
  },

  // Protected normal business dashboard layout
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [


      { path: 'settings', name: 'settings', component: () => import('@/views/Settings.vue') },
      { path: 'change-password', name: 'change-password', component: () => import('@/views/ChangePassword.vue') },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'subscription', name: 'subscription', component: () => import('@/views/Subscription.vue') },
      { path: 'domain', name: 'domain', component: () => import('@/views/Domain.vue') },
      { path: 'billing', name: 'billing', component: () => import('@/views/Billing.vue') },
      { path: 'sms', name: 'sms', component: () => import('@/views/SMS.vue') },
    ],
  },
  {
  path: '/auth/forgot-password',
  name: 'forgot-password',
  component: () => import('@/views/pages/auth/ForgotPassword.vue'),
},
{
  path: '/auth/reset-password',
  name: 'reset-password',
  component: () => import('@/views/pages/auth/ForgotPassword.vue'),
},

  // 404 - keep last
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Normal business user auth check
const isAuthenticated = () => !!localStorage.getItem('access')

// SuperAdmin auth check
const isSuperAdminAuthenticated = () => !!localStorage.getItem('superadmin_token')

// Global route guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const requiresSuperAdminAuth = to.matched.some((r) => r.meta.requiresSuperAdminAuth)
  const guestOnly = to.matched.some((r) => r.meta.guestOnly)
  const superAdminGuestOnly = to.matched.some((r) => r.meta.superAdminGuestOnly)

  const loggedIn = isAuthenticated()
  const superAdminLoggedIn = isSuperAdminAuthenticated()

  if (requiresSuperAdminAuth && !superAdminLoggedIn) return next('/superadmin/login')
  if (superAdminGuestOnly && superAdminLoggedIn) return next('/superadmin/dashboard')
  if (requiresAuth && !loggedIn) return next('/auth/login')
  if (guestOnly && loggedIn) return next('/dashboard')

  next()
})

export default router
