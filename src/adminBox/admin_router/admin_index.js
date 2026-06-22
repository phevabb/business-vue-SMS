import SuperAdminLayout from '@/adminBox/layout/SuperAdminLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    // ✅ SuperAdmin login page
    {
      path: '/superadmin/login',
      name: 'superadmin-login',
      component: () => import('@/adminBox/views/registration/SuperAdminLogin.vue'),
      meta: {
        guestOnly: true,
      },
    },

    // ✅ Protected SuperAdmin dashboard layout
    {
      path: '/superadmin',
      component: SuperAdminLayout,
      meta: {
        requiresSuperAdminAuth: true,
      },
      children: [
        {
          path: '',
          redirect: '/superadmin/dashboard',
        },
        {
          path: '/add-year-calendar',
          name: 'superadmin-add-year-calendar',
          component: () => import('@/adminBox/views/superadmin/SuperAdminAddYearCalendar.vue'),
        },
        {
          path: '/admin/dashboard',
          name: 'superadmin-dashboard',
          component: () => import('@/adminBox/views/superadmin/SuperAdminDashboard.vue'),
        },
        {
          path: '/admin/accounts',
          name: 'superadmin-accounts',
          component: () => import('@/adminBox/views/superadmin/SuperAdminAccounts.vue'),
        },
        {
          path: 'accounts/:id',
          name: 'superadmin-account-details',
          component: () => import('@/adminBox/views/superadmin/SuperAdminAccountDetails.vue'),
          props: true,
        },
        {
          path: 'tenants',
          name: 'superadmin-tenants',
          component: () => import('@/adminBox/views/superadmin/SuperAdminTenants.vue'),
        },
        {
          path: 'tenants/:tenantCode',
          name: 'superadmin-tenant-details',
          component: () => import('@/adminBox/views/superadmin/SuperAdminTenantDetails.vue'),
          props: true,
        },
        {
          path: 'transactions',
          name: 'superadmin-transactions',
          component: () => import('@/views/superadmin/SuperAdminTransactions.vue'),
        },
        {
          path: 'provisioning',
          name: 'superadmin-provisioning',
          component: () => import('@/views/superadmin/SuperAdminProvisioning.vue'),
        },
        {
          path: 'audit-logs',
          name: 'superadmin-audit-logs',
          component: () => import('@/views/superadmin/SuperAdminAuditLogs.vue'),
        },
        {
          path: 'settings',
          name: 'superadmin-settings',
          component: () => import('@/views/superadmin/SuperAdminSettings.vue'),
        },
        {
          path: 'change-password',
          name: 'superadmin-change-password',
          component: () => import('@/views/superadmin/SuperAdminChangePassword.vue'),
        },
      ],
    },

    // ✅ Optional redirect from root
    {
      path: '/',
      redirect: '/superadmin/login',
    },

    // ✅ Optional 404
    {
      path: '/:pathMatch(.*)*',
      name: 'superadmin-notfound',
      component: () => import('@/views/pages/NotFound.vue'),
    },
  ],
})

/**
 * ✅ SuperAdmin auth check
 * Checks if superadmin token exists.
 *
 * This should be the token returned by:
 * POST /api/superadmin/login
 */
const isSuperAdminAuthenticated = () => {
  const token = localStorage.getItem('superadmin_token')
  return !!token
}

/**
 * ✅ Global route guard for SuperAdmin
 */
router.beforeEach((to, from, next) => {
  const requiresSuperAdminAuth = to.matched.some(
    (record) => record.meta.requiresSuperAdminAuth
  )

  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  const loggedIn = isSuperAdminAuthenticated()

  // ✅ If route requires superadmin auth and user is not logged in
  if (requiresSuperAdminAuth && !loggedIn) {
    return next('/superadmin/login')
  }

  // ✅ If route is only for guests but superadmin is already logged in
  if (guestOnly && loggedIn) {
    return next('/superadmin/dashboard')
  }

  next()
})

export default router
