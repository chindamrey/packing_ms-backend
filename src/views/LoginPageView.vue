<template>
  <div class="login-wrapper">
    <!-- Animated background grid -->
    <div class="bg-grid"></div>

    <!-- Floating parking lot stripes -->
    <div class="bg-stripe s1"></div>
    <div class="bg-stripe s2"></div>
    <div class="bg-stripe s3"></div>

    <div class="card" :class="{ shake: shaking }">
      <!-- Logo -->
      <div class="logo-row">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#1a4fc4" />
            <text x="7" y="21" font-family="Georgia,serif" font-weight="700" font-size="18" fill="white">P</text>
          </svg>
        </div>
        <span class="logo-text">NIB <span class="logo-pro">Parking</span></span>
      </div>

      <h1 class="title">Welcome Back</h1>
      <p class="subtitle">Enter your credentials to access the dashboard</p>

      <!-- Form -->
      <div class="field-group">
        <label class="field-label">Email Address</label>
        <div class="input-wrap" :class="{ focused: emailFocused, error: errors.email }">
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 7 10 6 10-6" />
          </svg>
          <input v-model="form.email" type="email" placeholder="manager@municipality.gov" @focus="emailFocused = true"
            @blur="emailFocused = false; validateEmail()" @input="errors.email = ''" />
        </div>
        <span class="error-msg" v-if="errors.email">{{ errors.email }}</span>
      </div>

      <div class="field-group">
        <label class="field-label">Password</label>
        <div class="input-wrap" :class="{ focused: passFocused, error: errors.password }">
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
            @focus="passFocused = true" @blur="passFocused = false; validatePassword()" @input="errors.password = ''"
            autocomplete="current-password" />
          <button class="toggle-pass" type="button" @click="showPassword = !showPassword" tabindex="-1">
            <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
        <span class="error-msg" v-if="errors.password">{{ errors.password }}</span>
      </div>

      <!-- Remember / Forgot -->
      <div class="row-meta">
        <label class="remember-label">
          <input type="checkbox" v-model="form.remember" />
          <span class="custom-check">
            <svg v-if="form.remember" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white"
              stroke-width="2.5">
              <polyline points="2,6 5,9 10,3" />
            </svg>
          </span>
          Remember Me
        </label>
        <a href="#" class="forgot-link">Forgot Password?</a>
      </div>

      <!-- Sign In Button -->
      <base-button class="btn-signin" @click="handleSubmit" :loading="loading" :disabled="loading">
        <span class="btn-text">Sign In</span>
        <!-- <span v-else class="btn-loader">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span> -->
      </base-button>

      <!-- Secure badge -->
      <div class="secure-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Secure Encrypted Session
      </div>
    </div>
    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showSuccess" :class="showError ? 'toast-error' : 'toast-success'">
        <svg v-if="!showError" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        {{ msg }}
      </div>
    </Transition>
  </div>

</template>

<script setup>
import { ref, reactive } from 'vue'
// import BaseButton from '@/components/base/BaseButton'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/stores/auth';
import { useRequiredValidator } from '@/composables/useRequiredValidator';
import { useRouter } from 'vue-router';
import { set } from '@vueuse/core';


const router = useRouter();
const useAuth = useAuthStore();
const form = reactive({
  email: '',
  password: '',
  // remember: false,
})

const { errors, validateField } = useRequiredValidator()

const emailFocused = ref(false)
const passFocused = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const shaking = ref(false)
const showSuccess = ref(false);
const showError = ref(false);
const msg = ref()
function validateEmail() {
  if (!form.email) {
    errors.email = 'Email is required.'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'Password is required.'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  } else {
    errors.password = ''
  }
}

const handleSubmit = async () => {
  validateEmail()
  validatePassword()
  try {
    loading.value = true
    showSuccess.value = true
    // console.log(form);

    const res = await useAuth.login(form)
    msg.value = res.msg
    if (!res.result) {
      throw new Error(res.msg || 'Login failed. Please try again.');
    }

    router.push({ name: 'overview' });
  } catch (e) {
    console.log('error hx bro', e);
    msg.value = e;
    showError.value = true;


  }
  finally {
    setTimeout(() => {
      showError.value = false;
      showSuccess.value = false;
      loading.value = false
    }, 1000)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-wrapper {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8ecf0;
  position: relative;
  overflow: hidden;
}

/* Subtle grid background */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(100, 120, 160, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 120, 160, 0.07) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Parking lot hazard stripes */
.bg-stripe {
  position: absolute;
  height: 6px;
  background: repeating-linear-gradient(90deg,
      #c8b400 0px, #c8b400 24px,
      #111 24px, #111 48px);
  opacity: 0.15;
  border-radius: 3px;
}

.s1 {
  width: 340px;
  top: 18%;
  left: -40px;
  transform: rotate(-2deg);
}

.s2 {
  width: 260px;
  bottom: 22%;
  right: -20px;
  transform: rotate(1.5deg);
}

.s3 {
  width: 180px;
  bottom: 12%;
  left: 8%;
  transform: rotate(-1deg);
  opacity: 0.09;
}

/* Card */
.card {
  background: #fff;
  border-radius: 18px;
  padding: 44px 44px 36px;
  width: 100%;
  max-width: 440px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 32px 64px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  transition: transform 0.15s ease;
}

.card.shake {
  animation: shake 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translateX(-3px);
  }

  20%,
  80% {
    transform: translateX(5px);
  }

  30%,
  50%,
  70% {
    transform: translateX(-5px);
  }

  40%,
  60% {
    transform: translateX(5px);
  }
}

/* Logo */
.logo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.logo-icon {
  display: flex;
  flex-shrink: 0;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #0f1c3f;
  letter-spacing: -0.4px;
}

.logo-pro {
  color: #1a4fc4;
}

/* Headings */
.title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #0f1c3f;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.subtitle {
  text-align: center;
  font-size: 13.5px;
  color: #6b7a99;
  margin-bottom: 28px;
}

/* Field */
.field-group {
  margin-bottom: 18px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #3a4468;
  margin-bottom: 7px;
  letter-spacing: 0.01em;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #dde2ef;
  border-radius: 10px;
  padding: 0 14px;
  background: #f6f8fc;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.input-wrap.focused {
  border-color: #1a4fc4;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(26, 79, 196, 0.10);
}

.input-wrap.error {
  border-color: #e0334c;
  background: #fff8f9;
  box-shadow: 0 0 0 3px rgba(224, 51, 76, 0.08);
}

.input-icon {
  color: #9aa3be;
  flex-shrink: 0;
}

.input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #0f1c3f;
  padding: 13px 0;
}

.input-wrap input::placeholder {
  color: #b0b9d4;
}

.toggle-pass {
  background: none;
  border: none;
  cursor: pointer;
  color: #9aa3be;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}

.toggle-pass:hover {
  color: #1a4fc4;
}

.error-msg {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #e0334c;
  font-weight: 500;
}

/* Row meta */
.row-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #3a4468;
  cursor: pointer;
  user-select: none;
}

.remember-label input[type="checkbox"] {
  display: none;
}

.custom-check {
  width: 17px;
  height: 17px;
  border-radius: 4px;
  border: 1.5px solid #c0c8df;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
  flex-shrink: 0;
}

.remember-label input:checked~.custom-check,
.remember-label:has(input:checked) .custom-check {
  background: #1a4fc4;
  border-color: #1a4fc4;
}

.forgot-link {
  font-size: 13.5px;
  font-weight: 600;
  color: #1a4fc4;
  text-decoration: none;
  transition: opacity 0.15s;
}

.forgot-link:hover {
  opacity: 0.75;
}

/* Sign In button */
.btn-signin {
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  border: none;
  background: #1a4fc4;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
  box-shadow: 0 4px 16px rgba(26, 79, 196, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  margin-bottom: 24px;
}

.btn-signin:hover:not(:disabled) {
  background: #1540a8;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26, 79, 196, 0.36);
}

.btn-signin:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(26, 79, 196, 0.22);
}

.btn-signin:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

/* Loader dots */
.btn-loader {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  animation: bounce 0.9s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0.32s;
}


/* Toast */
.toast-success {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 13.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 100;
}

.toast-success svg {
  color: #10b981;
}

/* Toast */
.toast-error {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 13.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 100;
}

.toast-error svg {
  color: #e0334c;
}

.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}


@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Secure badge */
.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 12.5px;
  color: #9aa3be;
  font-weight: 500;
}
</style>
