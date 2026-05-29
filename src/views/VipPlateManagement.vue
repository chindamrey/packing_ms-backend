<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="page-title">VIP Plate Management</h1>
        <p class="page-subtitle">Authorize and manage priority parking access for special whitelist vehicles.</p>
      </div>
      <base-button variant="primary" label="" @click="createVip">
        Register VIP Plate
      </base-button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">TOTAL VIP Plates</div>
        <div class="stat-value">{{ useVipPlates.vipPlates?.total }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">ACTIVE NOW</div>
        <div class="stat-value stat-value--blue">{{ useVipPlates.vipPlates?.active_status }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">EXPIRED</div>
        <div class="stat-value">{{ useVipPlates.vipPlates?.unActive_status }}</div>
      </div>

    </div>

    <!-- Table Card -->
    <div class="table-card">
      <!-- Search + Filter -->
      <div class="toolbar">
        <div class="search-wrap">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input v-model="search" class="search-input" placeholder="Search by plate or owner name..." />
        </div>
        <div class="toolbar-right">
          <button class="btn-tool" @click="filterOpen = !filterOpen">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
          </button>
          <button class="btn-tool" @click="exportCSV">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Filter Panel -->
      <Transition name="slide">
        <div v-if="filterOpen" class="filter-panel">
          <label>Status</label>
          <select v-model="filterStatus" class="filter-select">
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
          <button class="btn-clear" @click="filterStatus = ''; search = ''">Clear</button>
        </div>
      </Transition>

      <!-- Table -->
      <table class="data-table">
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Owner Name</th>
            <th>Status</th>
            <th>Discount %</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in useVipPlates.vipPlates?.data" :key="row.id" class="data-row">
            <td><span class="plate-badge">{{ row.plate_number }}</span></td>
            <td class="owner-name">{{ row?.owner_name == null ? 'Null' : row?.owner_name }}</td>
            <td>
              <span class="status-dot" :class="row.is_active === 1 ? 'dot-active' : 'dot-expired'"></span>
              <span class="status-text" :class="row.is_active === 1 ? 'text-active' : 'text-expired'">{{ row.is_active
                === 1 ? 'Active' : 'Expired'}}</span>
            </td>
            <td class="discount">{{ row.discount_percentage == null ? '0' : row.discount_percentage }} %</td>
            <td>
              <div class="row-actions">
                <button class="action-btn" title="Edit" @click="editPlate(row.id)">
                  <IconEdit />
                </button>
                    <button class="action-btn action-btn-danger" title="Delete" @click="deleteVipPlate(row.id)">
                  <IconTrash />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedRows.length === 0">
            <td colspan="6" class="empty-state">No entries found.</td>
          </tr>
        </tbody>
      </table>

      
    </div>

    <!--Delete Vehicle Type Modal -->

    <BaseModal v-if="deleteVipModal" title="Confirm Delete" @close="deleteVipModal = false">
      <p>Are you sure you want to delete this vehicle type ?</p>
      <template #footer>
        <BaseButton @click="deleteModal = false" variant="secondary">Cancel</BaseButton>
        <BaseButton @click="comfirmDelete" variant="dangerous" class="ms-2" :loading="isLoading">
          Delete
        </BaseButton>
      </template>
    </BaseModal>
    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showSuccess" class="toast-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        {{ msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onBeforeUnmount } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue';
import { useVipPlatesStore } from '@/stores/vip_plates';
import { useRouter } from 'vue-router';
import BaseModal from '@/components/base/BaseModal.vue';

const router = useRouter();
const useVipPlates = useVipPlatesStore();

onMounted(async () => {
  await useVipPlates.getAllVipPlates();
  console.log('vip plate ', await useVipPlates.vipPlates.data)
})

const deleteVipModal = ref(false)
const deleteVipPlate = (id) => {
  deleteId.value = id;
  deleteVipModal.value = true;
}
// ── Data ─────────────────────────────────────────────────────────────────────

const allPlates = ref([
  { id: 1, plate: 'VIP-001-NYC', owner: "Mayor's Office - Exec", status: 'Active', discount: 30 },
  { id: 2, plate: 'GHOST-928', owner: 'Alpha Logistics Corp', status: 'Active', discount: 25 },
  { id: 3, plate: 'TEMP-4422', owner: 'Marcus Chen', status: 'Expired', discount: 0 },
  { id: 4, plate: 'LUXE-TRK-1', owner: 'Riverside Grand Hotel', status: 'Active', discount: 10 },
  { id: 5, plate: 'CITY-900-PD', owner: 'Public Safety Dept', status: 'Active', discount: 15 },
  { id: 6, plate: 'EXEC-7700', owner: 'Governor Office', status: 'Active', discount: 20 },
  { id: 7, plate: 'MED-FLEET-3', owner: 'City Hospital Network', status: 'Active', discount: 5 },
  { id: 8, plate: 'DIPLO-44', owner: 'Foreign Affairs Bureau', status: 'Active', discount: 18 },
  { id: 9, plate: 'OLD-CORP-12', owner: 'Harrington & Sons LLC', status: 'Expired', discount: 0 },
  { id: 10, plate: 'VNR-PRESS-1', owner: 'City Press Pool', status: 'Active' },
  { id: 11, plate: 'SVC-PLT-09', owner: 'Metro Cleaning Services', status: 'Expired', discount: 0 },
  { id: 12, plate: 'FIRE-001', owner: 'Fire Dept HQ', status: 'Active', discount: 0 },
])

const IconEdit = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
  h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
])
const IconTrash = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('polyline', { points: '3 6 5 6 21 6' }),
  h('path', { d: 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' }),
  h('path', { d: 'M10 11v6' }),
  h('path', { d: 'M14 11v6' }),
  h('path', { d: 'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' })
])
// ── State ─────────────────────────────────────────────────────────────────────

const search = ref('')
const filterStatus = ref('')
const filterOpen = ref(false)
const currentPage = ref(1)
const perPage = 5
const openMenuId = ref(null)
const modalOpen = ref(false)
const editing = ref(null)
const deleteId = ref(null);
const isLoading = ref(false);
const showSuccess = ref(false);
const msg = ref(null)
const form = ref({ plate: '', owner: '', expDate: '', status: 'Active', notes: '' })

// ── Computed ──────────────────────────────────────────────────────────────────

const totalWhitelisted = computed(() => allPlates.value.length + 1272)
const activeCount = computed(() => allPlates.value.filter(p => p.status === 'Active').length + 1138)
const expiringCount = computed(() => 42)

const filteredRows = computed(() => {
  let rows = allPlates.value
  if (search.value) {
    const q = search.value.toLowerCase()
    rows = rows.filter(r => r.plate.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q))
  }
  if (filterStatus.value) rows = rows.filter(r => r.status === filterStatus.value)
  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / perPage)))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredRows.value.slice(start, start + perPage)
})

const rangeStart = computed(() => filteredRows.value.length === 0 ? 0 : (currentPage.value - 1) * perPage + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * perPage, filteredRows.value.length))

// ── Methods ───────────────────────────────────────────────────────────────────
const createVip = () => {
  router.push({ name: 'vip-plates.create' })
}

const editPlate = (id) => {
  router.push({ name: 'vip-plates.edit', params: { id } })
}

const comfirmDelete = async () => {
  const res = await useVipPlates.deleteVipPlate(deleteId.value);
  console.log('api response : ',res);
  msg.value = res.msg;
  isLoading.value = true
  showSuccess.value = true
  await useVipPlates.getAllVipPlates();
  setTimeout(() => {
    isLoading.value = false
    deleteVipModal.value = false;
    showSuccess.value = false
  }, 2000)
}
function toggleMenu(id) { openMenuId.value = openMenuId.value === id ? null : id }
function closeMenu() { openMenuId.value = null }

function openModal(row = null) {
  if (row) {
    editing.value = row
    form.value = { ...row }
  } else {
    editing.value = null
    form.value = { plate: '', owner: '', expDate: '', status: 'Active', notes: '' }
  }
  modalOpen.value = true
  closeMenu()
}

function closeModal() { modalOpen.value = false; editing.value = null }

function saveRow() {
  if (!form.value.plate || !form.value.owner) return
  if (editing.value) {
    const idx = allPlates.value.findIndex(r => r.id === editing.value.id)
    if (idx !== -1) allPlates.value[idx] = { ...allPlates.value[idx], ...form.value }
  } else {
    allPlates.value.unshift({ id: Date.now(), ...form.value })
  }
  closeModal()
}

function deleteRow(id) { allPlates.value = allPlates.value.filter(r => r.id !== id); closeMenu() }

function exportCSV() {
  const header = 'Plate Number,Owner Name,Expiration Date,Status,Notes'
  const rows = allPlates.value.map(r => `${r.plate},${r.owner},${r.expDate},${r.status},"${r.notes}"`)
  const csv = [header, ...rows].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'vip-plates.csv'
  a.click()
}

// ── Click Outside Directive ───────────────────────────────────────────────────

const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  font-family: 'Sora', sans-serif;
  background: #f0f2f7;
  min-height: 100vh;
  padding: 36px 44px;
  color: #0d1117;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 12px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: #0d1117;
}

.page-subtitle {
  font-size: 13.5px;
  color: #6b7280;
  margin-top: 5px;
}

.btn-register {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #0d1117;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-register:hover {
  background: #1e2530;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 28px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 22px 24px;
  border: 1px solid #e8eaf0;
}

.stat-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.8px;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1.5px;
  color: #0d1117;
  line-height: 1;
}

.stat-value--blue {
  color: #2563eb;
}

/* Avatars */
.avatars {
  display: flex;
  margin-top: 6px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #d1d5db;
  border: 2px solid #fff;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar--count {
  background: #4b5563;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
}

/* Table Card */
.table-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8eaf0;
  overflow: hidden;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.search-wrap {
  position: relative;
  width: 340px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  color: #374151;
  outline: none;
  transition: border-color 0.15s;
  background: #fafafa;
}

.search-input:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.btn-tool {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  background: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-tool:hover {
  background: #f9fafb;
}

/* Row Actions */
.row-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.action-btn--danger:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}

/* Filter Panel */
.filter-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.filter-select {
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.btn-clear {
  padding: 5px 12px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
}

.btn-clear:hover {
  background: #f3f4f6;
}

/* Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead th {
  padding: 12px 24px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #9ca3af;
  text-align: left;
  background: #fafafa;
  border-bottom: 1px solid #f3f4f6;
}

.data-table td {
  padding: 18px 24px;
  font-size: 13.5px;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.data-row:last-child td {
  border-bottom: none;
}

.data-row:hover td {
  background: #f9fbff;
}

.plate-badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  font-weight: 600;
  color: #111827;
  background: #edf0fc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 10px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.owner-name {
  font-weight: 500;
  color: #1a202c;
}

.exp-date {
  color: #6b7280;
  font-size: 13px;
}

.notes {
  color: #9ca3af;
  font-size: 12.5px;
  max-width: 280px;
}

/* Status */
td:has(.status-dot) {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

.dot-active {
  background: #22c55e;
}

.dot-expired {
  background: #f87171;
}

.status-text {
  font-size: 13px;
  font-weight: 600;
}

.text-active {
  color: #16a34a;
}

.text-expired {
  color: #dc2626;
}

/* Action Menu */
.action-menu-wrap {
  position: relative;
  display: inline-block;
}

.dots-btn {
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.dots-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 34px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-width: 110px;
  z-index: 50;
  overflow: hidden;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: none;
  border: none;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s;
}

.dropdown-menu button:hover {
  background: #f9fafb;
}

.dropdown-menu button.danger {
  color: #dc2626;
}

.dropdown-menu button.danger:hover {
  background: #fef2f2;
}

/* Empty */
.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 40px !important;
  font-size: 14px;
}

/* Table Footer */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1px solid #f3f4f6;
}

.entry-count {
  font-size: 13px;
  color: #9ca3af;
}

.pagination {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pg-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 7px;
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
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
.pg-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.pg-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pg-btn--active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
  font-weight: 600;
}

/* Modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(13, 17, 23, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 460px;
  max-width: 95vw;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.16);
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-head h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0d1117;
}

.modal-x {
  width: 28px;
  height: 28px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
}

.modal-x:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
}

.finput {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 9px 12px;
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
}

.finput:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid #f3f4f6;
}

.btn-cancel {
  padding: 9px 18px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-save {
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: #0d1117;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-save:hover {
  background: #1e2530;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.2s ease, opacity 0.2s;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 60px;
  opacity: 1;
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page {
    padding: 16px;
  }

  .stats-row {
    grid-template-columns: 1fr 1fr;
  }

  .search-wrap {
    width: 100%;
  }

  .toolbar {
    flex-wrap: wrap;
  }
}
</style>
