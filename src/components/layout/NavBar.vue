<template>
  <header class="navbar">
    <!-- Search -->
     <div class="brand-text">
          <span class="brand-name">Parking Management</span>
          <span class="brand-sub">URBAN INFRASTRUCTURE V2.1</span>
        </div>
    <div class="search-wrapper">
      <span class="search-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        v-model="searchQuery"
        class="search-input"
        type="text"
        placeholder="Search rules, zones, or vehicles..."
        @keyup.enter="onSearch"
      />
    </div>

    <!-- Right Actions -->
    <div class="actions">
      <!-- Notifications -->
      <button class="action-btn" title="Notifications" @click="onNotifications">
        <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>

      <!-- Help -->
      <button class="action-btn" title="Help" @click="onHelp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </button>

      <!-- Avatar -->
      <button class="avatar-btn" title="Profile" @click="onProfile">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="avatar-img"
        />
        <span v-else class="avatar-fallback">{{ userInitials }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/40?img=12'
    })
  },
  notificationCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['search', 'notifications', 'help', 'profile'])

// State
const searchQuery = ref('')

// Computed
const userInitials = computed(() => {
  return props.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Handlers
function onSearch() {
  emit('search', searchQuery.value)
}

function onNotifications() {
  emit('notifications')
}

function onHelp() {
  emit('help')
}

function onProfile() {
  emit('profile')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
/* Brand */
.brand {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 0 20px 28px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b5bdb 0%, #4c6ef5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 91, 219, 0.35);
}
.brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 2px;
}

.brand-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #1a1f36;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.brand-sub {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  color: #8c92a4;
  letter-spacing: 0.04em;
  line-height: 1.4;
}

.navbar {
  display: flex;
  align-items: center;

  height: 56px;
  padding: 0 20px 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #e8eaf0;
  font-family: 'DM Sans', sans-serif;
  gap: 16px;

}

/* ── Search ─────────────────────────────────────── */
.search-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f4f5f8;
  border: 1px solid #e8eaf0;
  border-radius: 8px;
  padding: 0 14px;
  height: 36px;
  width: 340px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-wrapper:focus-within {
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
  background: #fff;
}

.search-icon {
  display: flex;
  align-items: center;
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  color: #374151;
  width: 100%;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* ── Actions ─────────────────────────────────────── */
.actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e8eaf0;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.action-btn:hover {
  background: #f4f5f8;
  color: #1a1f36;
  border-color: #d1d5db;
}

.badge {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  border: 1.5px solid #fff;
  font-size: 0;
}

/* ── Avatar ─────────────────────────────────────── */
.avatar-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e8eaf0;
  overflow: hidden;
  cursor: pointer;
  background: #e8eaf0;
  padding: 0;
  margin-left: 4px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.avatar-btn:hover {
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  font-weight: 600;
  color: #3b5bdb;
  background: #eef1fd;
  font-family: 'DM Sans', sans-serif;
}
</style>