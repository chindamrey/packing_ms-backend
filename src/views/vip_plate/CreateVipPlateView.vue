<template>
    <div class="page-wrapper">
        <div class="form-card">
            <!-- Decorative accent bar -->
            <div class="accent-bar"></div>

            <!-- Header -->
            <div class="card-header">
                <RouterLink class="back-btn" :to="{ name: 'vip-plates.index' }" variant="secondary"
                    @click="handleBack" label="">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    <span>Back</span>
                </RouterLink>
                <div class="title-group">
                    <div class="title-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="form-title">Register VIP Plate</h1>
                        <p class="form-subtitle">Add Plate Number info details below</p>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Form Body -->
            <div class="form-body">

                <!-- Name Field -->
                <div class="field-group" :class="{ focused: plateFocused, filled: form.plate_number, error: errors.plate_number }">
                    <label class="field-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        Plate Number <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                        <input v-model="form.plate_number" type="text" class="field-input" placeholder="Enter plate number ..."
                            @focus="plateFocused = true" @blur="plateFocused = false; validatePlate()" />
                        <div class="input-suffix">
                            <span v-if="form.plate_number" class="char-count">{{ form.plate_number.length }}</span>
                            <svg v-if="form.plate_number && !errors.plate_number" class="valid-icon" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>
                    <p v-if="errors.plate_number" class="error-msg">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {{ errors.plate_number }}
                    </p>
                </div>

                <!-- Owner Name Field  -->

                <div class="field-group" :class="{ focused: nameFocused, filled: form.owner_name, error: errors.owner_name }">
                    <label class="field-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Owner Name <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                        <input v-model="form.owner_name" type="text" class="field-input" placeholder="Enter plate number ..."
                            @focus="nameFocused = true" @blur="nameFocused = false; validateName()" />
                        <div class="input-suffix">
                            <span v-if="form.owner_name" class="char-count">{{ form.owner_name.length }}</span>
                            <svg v-if="form.owner_name && !errors.owner_name" class="valid-icon" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>
                    <p v-if="errors.owner_name" class="error-msg">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {{ errors.owner_name }}
                    </p>
                </div>

                <!-- Discount Percentage Field -->
                <div class="field-group"
                    :class="{ focused: numberFocused, filled: form.discount !== '', error: errors.discount }">
                    <label class="field-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 17l-5.5 2.5 1-6.2L3 8.9 9 8z" />
                        </svg>
                        Discount% <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper number-wrapper">
                        <button class="stepper-btn" @click="decrement" :disabled="form.discount <= 0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="3" stroke-linecap="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                        <input v-model.number="form.discount" type="number" class="field-input number-input"
                            placeholder="0" min="0" @focus="numberFocused = true"
                            @blur="numberFocused = false; validateNumber()" />
                        <button class="stepper-btn" @click="increment">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="3" stroke-linecap="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                    </div>
                    <p v-if="errors.discount" class="error-msg">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {{ errors.discount }}
                    </p>
                </div>

            </div>

            <!-- Footer Actions -->
            <div class="card-footer">
                <base-button class="cancel-btn" variant="secondary" @click="handleReset" label="">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    Reset
                </base-button>
                <base-button class="submit-btn" @click="handleSubmit" :class="{ loading: isLoading }" label="">
                    <span v-if="!isLoading" class="btn-content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Submit
                    </span>
                    <span v-else class="btn-content">
                        <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5" stroke-linecap="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Saving...
                    </span>
                </base-button>
            </div>

            <!-- Success Toast -->
            <Transition name="toast">
                <div v-if="showSuccess" class="toast-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Added vehicle type successfully!
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseButton from "@/components/base/BaseButton.vue"
import { useRequiredValidator } from '@/composables/useRequiredValidator';
import { useRouter } from 'vue-router';
import { useVipPlatesStore } from '@/stores/vip_plates';


const useVipPlate = useVipPlatesStore()
const router = useRouter();
const { errors, validateField } = useRequiredValidator()
const form = reactive({
    plate_number: '',
    owner_name : '',
    discount: null
})

// const errors = reactive({ name: '', numberInstand: '' })
const nameFocused = ref(false)
const numberFocused = ref(false)
const isLoading = ref(false)
const showSuccess = ref(false)
const plateFocused = ref(false);

function validatePlate() {
    errors.plate_number = form.plate_number.trim() ? '' : 'Plate number is required.'
}
function validateName() {
    errors.owner_name = form.owner_name.trim() ? '' : 'Owner name is required.'
}
function validateNumber() {
    if (form.discount === '' || form.discount === null) {
        errors.discount = 'Discount is required.'
    } else if (form.numberInstand < 0) {
        errors.discount = 'Must be a positive number.'
    } else {
        errors.discount = ''
    }
}
function increment() { form.discount++ }
function decrement() { if (form.discount > 0) form.discount-- }

function handleReset() {
    form.name = ''
    form.numberInstand = 0
    errors.name = ''
    errors.numberInstand = ''
}

const handleSubmit = async () => {

    validateName()
    validatePlate()
    validateNumber()
    if (errors.owner_name || errors.discount || errors.plate_number) return
    console.log(form.value);

    const res = await useVipPlate.addVipPlate(form)
    console.log(res);
    isLoading.value = true

    showSuccess.value = true
    setTimeout(() => {
        isLoading.value = false
        router.push({ name: 'vip-plates.index' })
        showSuccess.value = false
    }, 2000)
}

const handleBack = () => {
    router.push({ name: 'vip-plates.index' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.page-wrapper {
    min-height: calc(100vh - 56px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f6fa;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
}

.form-card {
    background: #ffffff;
    border-radius: 20px;
    width: 100%;
    max-width: 560px;
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.06),
        0 8px 32px rgba(99, 102, 241, 0.10),
        0 0 0 1px rgba(99, 102, 241, 0.06);
    position: relative;
    overflow: hidden;
}



/* Header */
.card-header {
    padding: 28px 32px 20px;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    padding: 0px 10px 0px 6px;
    border-radius: 8px;
    margin-bottom: 20px;
    transition: all 0.18s ease;
    margin-left: -6px;
}

.back-btn:hover {
    color: #6366f1;
    background: #f0f0ff;
}

.title-group {
    display: flex;
    align-items: center;
    gap: 14px;
}

.title-icon {
    width: 48px;
    height: 48px;
    background: #2664eb;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.30);
}

.form-title {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.4px;
}

.form-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin-top: 2px;
    font-weight: 400;
}

.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent);
    margin: 0 32px;
}

/* Form Body */
.form-body {
    padding: 12px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
    transition: color 0.18s;
}

.field-group.focused .field-label {
    color: #6366f1;
}

.required-star {
    color: #ef4444;
    font-size: 14px;
    line-height: 1;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    transition: all 0.2s ease;
    overflow: hidden;
}

.field-group.focused .input-wrapper {
    border-color: #6366f1;
    background: #fafafe;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.10);
}

.field-group.error .input-wrapper {
    border-color: #ef4444;
    background: #fff9f9;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.field-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 13px 16px;
    font-family: 'Sora', sans-serif;
    font-size: 14.5px;
    font-weight: 500;
    color: #111827;
    outline: none;
    min-width: 0;
}

.field-input::placeholder {
    color: #c4c9d4;
    font-weight: 400;
}

/* Number field custom stepper */
.number-wrapper {
    padding: 0;
}

.number-input {
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px;
    padding: 13px 8px;
    -moz-appearance: textfield;
}

.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

.stepper-btn {
    width: 46px;
    height: 46px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6366f1;
    transition: all 0.15s ease;
    flex-shrink: 0;
}

.stepper-btn:hover:not(:disabled) {
    background: #eeefff;
}

.stepper-btn:active:not(:disabled) {
    background: #e0e1ff;
}

.stepper-btn:disabled {
    color: #d1d5db;
    cursor: not-allowed;
}

.stepper-btn:first-child {
    border-right: 1.5px solid #e5e7eb;
}

.stepper-btn:last-child {
    border-left: 1.5px solid #e5e7eb;
}

.input-suffix {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-right: 14px;
}

.char-count {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: #9ca3af;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 5px;
}

.valid-icon {
    color: #10b981;
}

.error-msg {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #ef4444;
    font-weight: 500;
}

/* Footer */
.card-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 32px 28px;
    border-top: 1px solid #f3f4f6;
}

.cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: none;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 11px 20px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.18s ease;
}

.cancel-btn:hover {
    border-color: #9ca3af;
    color: #374151;
    background: #f9fafb;
}

.submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.30);
    min-width: 155px;
}

.submit-btn:hover:not(.loading) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.40);
}

.submit-btn:active:not(.loading) {
    transform: translateY(0);
}

.submit-btn.loading {
    opacity: 0.85;
    cursor: not-allowed;
}

.btn-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin 0.8s linear infinite;
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
    z-index: 10;
}

.toast-success svg {
    color: #10b981;
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
</style>