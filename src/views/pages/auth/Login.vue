<script setup>
import { login } from '@/services/auth.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const loading = ref(false)
const error = ref('')

// ✅ LOGIN FUNCTION
const handleLogin = async () => {
    error.value = ''
    loading.value = true

    try {
        const res = await login({
            email: email.value,
            password: password.value
        })

        console.log('login response:', res)

        /**
         * ✅ IMPORTANT:
         * If your login() helper does NOT already save tokens,
         * uncomment these two lines:
         */
        localStorage.setItem('access', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)

        localStorage.setItem('rememberMe', rememberMe.value ? 'true' : 'false')

        // ✅ use replace so login page is removed from history
        await router.replace('/dashboard')
    } catch (err) {
        console.error('login error:', err)
        error.value = 'Invalid email or password'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div class="w-full max-w-md">
            <!-- Premium Brand Header -->
            <div class="text-center mb-8">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-100">
                    <span class="text-white text-lg font-bold tracking-wide">P</span>
                </div>

                <h1 class="text-3xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
                <p class="mt-2 text-sm text-gray-500">
                    Sign in to access your school workspace on Phena SMS
                </p>
            </div>

            <!-- Card -->
            <div class="rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <!-- Error -->
                <div v-if="error" class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {{ error }}
                </div>

                <!-- Form -->
                <form @submit.prevent="handleLogin" class="space-y-5">
                    <!-- Email -->
                    <div>
                        <label class="label">Email Address</label>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="admin@school.com"
                            class="input"
                            required
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <div class="mb-1 flex items-center justify-between">
                            <label class="label !mb-0">Password</label>
                            <button
                                type="button"
                                class="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div class="relative">
                            <input
                                v-model="password"
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="Enter your password"
                                class="input pr-12"
                                required
                            />

                            <!-- Eye Toggle -->
                            <button
                                type="button"
                                class="eye-btn"
                                @click="showPassword = !showPassword"
                                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                            >
                                <svg
                                    v-if="!showPassword"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.8"
                                    stroke="currentColor"
                                    class="h-5 w-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>

                                <svg
                                    v-else
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.8"
                                    stroke="currentColor"
                                    class="h-5 w-5"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.477 10.485A3 3 0 0012 15a2.99 2.99 0 002.121-.879" />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9.88 5.09A9.953 9.953 0 0112 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.437 0 .644a10.05 10.05 0 01-4.043 5.127M6.228 6.228A10.012 10.012 0 002.037 11.68c-.07.207-.07.437 0 .644A10.013 10.013 0 006.6 17.728"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Remember me -->
                    <div class="flex items-center justify-between">
                        <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                            <input
                                v-model="rememberMe"
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            Remember me
                        </label>
                    </div>

                    <!-- Button -->
                    <button type="submit" :disabled="loading" class="submit-btn">
                        <span v-if="loading">Signing in...</span>
                        <span v-else>Sign In</span>
                    </button>
                </form>

                <!-- Footer -->
                <div class="mt-6 text-center text-sm text-gray-500">
                    Not registered?
                    <button
                        type="button"
                        @click="router.push('/auth/register')"
                        class="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Create an account
                    </button>
                </div>
            </div>

            <!-- Bottom note -->
            <div class="mt-6 text-center text-xs text-gray-400">
                © 2026 Phena Systems. All rights reserved.
            </div>
        </div>
    </div>
</template>

<style scoped>
.label {
    display: block;
    margin-bottom: 0.45rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #111827;
}

.input {
    width: 100%;
    border-radius: 0.95rem;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
    color: #111827;
    transition: all 0.2s ease;
}

.input::placeholder {
    color: #9ca3af;
}

.input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.eye-btn {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.2s ease;
}

.eye-btn:hover {
    color: #2563eb;
}

.submit-btn {
    width: 100%;
    border: none;
    border-radius: 1rem;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    padding: 0.9rem 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.18);
}

.submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
</style>

