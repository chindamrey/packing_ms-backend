<script setup>
defineProps({
  label: String,
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary' // primary | secondary | danger
  },
  loading: Boolean,
  disabled: Boolean
})

const emit = defineEmits(['click'])

function handleClick(e) {
  if (!e.target.disabled) {
    emit('click', e)
  }
}
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="['btn', `btn-${variant}`]" :loading="isLoading"
    @click="handleClick">
    <span v-if="loading">Loading...</span>
    <span v-else><slot></slot></span>
    
    
  </button>
</template>

<style scoped>
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.12s, box-shadow 0.12s;
}
.btn:hover:not(:disabled) {
  transform: translateY(-0.08rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: #2664eb !important;
  color: white;
}

.btn-secondary {
  /* background: #22507e !important; */
    background: #ffffff !important;
  color: rgb(0, 0, 0) !important;
  border-color: rgb(179, 179, 179) !important;
}

.btn-dangerous {
  background: #e53935 !important;
  padding: 11px !important;
  color: white !important;
}
.loading {
  opacity: 0.6;
}
</style>