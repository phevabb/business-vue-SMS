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
      {
        label: 'School Domain',
        icon: 'pi pi-fw pi-globe',
        to: '/domain',
      },
      {
        label: 'SMS',
        icon: 'pi pi-fw pi-comments',
        to: '/sms',
      },
      {
        label: 'Billing Summary',
        icon: 'pi pi-fw pi-dollar',
        to: '/billing',
      },
    ],
  },

  {
    label: 'Settings',
    items: [
      {
        label: 'School Settings',
        icon: 'pi pi-fw pi-cog',
        to: '/settings',
      },
    ],
  },

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
  <ul class="layout-menu">
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
</template>

<style lang="scss" scoped></style>
