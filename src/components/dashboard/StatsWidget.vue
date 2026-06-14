<template>
  <!-- Student Info Card with Image -->
  <div class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0 p-0 overflow-hidden">
      <!-- Student Image -->
      <img
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Student"
        class="w-full h-48 object-cover rounded-t-lg"
      />

      <!-- Student Info -->
      <div class="p-4">
        <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-lg">
          Alex Johnson
        </h2>
        <p class="text-muted-color mb-2">Student ID: ST20234567</p>
        <span class="text-primary font-medium">Computer Science</span>
      </div>
    </div>
  </div>

  <!-- Academic Year & Class Card -->
  <div class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0 p-0 overflow-hidden">
      <div class="p-4">
        <span class="block text-primary font-medium mb-2">Academic Year: 2024/2025</span>
        <span class="block text-muted-color">Class: Level 300</span>
      </div>
    </div>
  </div>

  <!-- Arrears Card -->
  <div class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0">
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">Arrears</span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
            GHS 1,250.00
          </div>
        </div>
        <div
          class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border"
          style="width: 2.5rem; height: 2.5rem"
        >
          <i class="pi pi-exclamation-triangle text-red-500 !text-xl"></i>
        </div>
      </div>
      <span class="text-primary font-medium">Outstanding</span>
      <span class="text-muted-color"> tuition fees</span>
    </div>
  </div>
</template>
