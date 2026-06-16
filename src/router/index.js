import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // ✅ Public landing page
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },

        // ✅ Public auth pages
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: { guestOnly: true }
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue'),
            meta: { guestOnly: true }
        },
        {
            path: '/email-verification-sent',
            name: 'EmailVerificationSent',
            component: () => import('@/views/pages/auth/EmailVerificationSent.vue'),
            meta: { guestOnly: true }
        },


        // ✅ Protected dashboard layout
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'subscription',
                    name: 'subscription',
                    component: () => import('@/views/Subscription.vue')
                },
                {
                    path: 'domain',
                    name: 'domain',
                    component: () => import('@/views/Domain.vue')
                },
                {
                    path: 'billing',
                    name: 'billing',
                    component: () => import('@/views/Billing.vue')
                },
                {
                    path: 'sms',
                    name: 'sms',
                    component: () => import('@/views/SMS.vue')
                }
            ]
        },

        // ✅ Optional 404
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
})

/**
 * ✅ Simple auth check
 * Checks if access token exists
 */
const isAuthenticated = () => {
    const token = localStorage.getItem('access')
    return !!token
}

/**
 * ✅ Global route guard
 */
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const guestOnly = to.matched.some((record) => record.meta.guestOnly)

    const loggedIn = isAuthenticated()

    // ✅ If route requires auth and user is not logged in
    if (requiresAuth && !loggedIn) {
        return next('/auth/login')
    }

    // ✅ If route is only for guests but user is already logged in
    if (guestOnly && loggedIn) {
        return next('/dashboard')
    }

    next()
})

export default router
