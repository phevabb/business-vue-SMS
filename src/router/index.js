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

  children: [
    {
      path: '',
      redirect: '/superadmin/dashboard',
    },
    {
      path: 'dashboard',
      name: 'superadmin-dashboard',
      component: () => import('@/adminBox/views/superadmin/SuperAdminDashboard.vue'),
    },
    {
      path: 'accounts',
      name: 'superadmin-accounts',
      component: () => import('@/adminBox/views/superadmin/SuperAdminAccounts.vue'),
    },
    {
      path: 'tenants',
      name: 'superadmin-tenants',
      component: () => import('@/adminBox/views/superadmin/SuperAdminTenants.vue'),
    },
    {
      path: 'add-year-calendar',
      name: 'superadmin-add-year-calendar',
      component: () => import('@/adminBox/views/superadmin/SuperAdminAddYearCalendar.vue'),
    },

    // Billing list: shows all schools
    {
      path: 'billing-list',
      name: 'TenantBillingList',
      component: () => import('@/adminBox/views/superadmin/SchoolsBillingList.vue'),
    },

    // Billing details: shows one selected school
    {
      path: 'billing-details/:tenantCode',
      name: 'TenantBillingDetails',
      component: () => import('@/adminBox/views/superadmin/TenantBillingDetails.vue'),
    },

    {
      path: 'billing-history',
      name: 'TenantBillingHistory',
      component: () => import('@/adminBox/views/superadmin/BillingHistory.vue'),
    },

    {
      path: 'school-information',
      name: 'TenantSchoolInformation',
      component: () => import('@/adminBox/views/superadmin/SchoolInformation.vue'),
    },
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
  const token = localStorage.getItem('superadmin_token')

  // ✅ Allow login page ALWAYS
  if (to.path === '/superadmin/login') {
    return next()
  }

  // ✅ Protect superadmin routes
  if (to.path.startsWith('/superadmin')) {
    if (!token) {
      return next('/superadmin/login')
    }
  }

  next()
})

export default router
