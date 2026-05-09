<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1 class="page-title">Vehicle Type Management</h1>
        <p class="page-subtitle">Configure vehicle categories, occupancy limits, and pricing modifiers for the entire
          facility.</p>
      </div>
      <base-button class="btn-primary" @click="createType">Add New Vehicle Type
      </base-button>
    </div>

    <!-- Stats Cards -->

    <div class="stats-grid">

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">{{ stats[0].label }}</span>
          <div class="stat-icon" :style="{ background: stats[0].iconBg }">
            <component :is="stats[0].icon" :color="stats[0].iconColor" />
          </div>
        </div>
        <div class="stat-value">{{ usePackingLogs.vehicleTypes.length }}</div>
        <div v-if="stats[2].sub" class="stat-sub" :class="stats[0].subClass">{{ stats[0].sub }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">{{ stats[2].label }}</span>
          <div class="stat-icon" :style="{ background: stats[2].iconBg }">
            <component :is="stats[1].icon" :color="stats[1].iconColor" />
          </div>
        </div>
        <div class="stat-value">{{ usePackingLogs.slotMax }}</div>
        <div v-if="stats[2].sub" class="stat-sub" :class="stats[2].subClass">{{ stats[2].sub }}</div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <div class="table-header">
        <h2 class="table-title">Vehicle Categories</h2>
        <div class="table-actions">
          <button class="icon-btn" title="Filter">
            <IconFilter />
          </button>
          <button class="icon-btn" title="Download">
            <IconDownload />
          </button>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Vehicle Types</th>
            <th>Alias Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in usePackingLogs.vehicleTypes" :key="vehicle.id" class="table-row">
            <td>
              <div class="category-name">
                <div class="vehicle-icon-wrap" :style="{ background: vehicles[1].iconBg }">
                  <component :is="vehicle.number_instand == 1 ? IconMoto : IconCar"
                    :color="vehicle.number_instand == 1 ? vehicles[1].iconColor : vehicles[2].iconColor" />
                </div>
                <span>{{ vehicle.name }}</span>
              </div>
            </td>

            <td>{{ vehicle.number_instand }}</td>

            <td>
              <span class="status-badge status-active">
                Active
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button class="action-btn" title="Edit" @click="editVehicle(vehicle.id)">
                  <IconEdit />
                </button>
                <button class="action-btn action-btn-danger" title="Delete" @click="deleteVehicle(vehicle.id)">
                  <IconTrash />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer">
        <span class="table-count">Showing {{ vehicles.length }} of {{ vehicles.length }} vehicle categories</span>
        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">&#8249;</button>
          <button class="page-btn page-btn--active">{{ currentPage }}</button>
          <button class="page-btn" @click="currentPage++">&#8250;</button>
        </div>
      </div>
    </div>

    <!--Delete Vehicle Type Modal -->

   <BaseModal v-if="deleteModal" title="Confirm Delete" @close="deleteModal = false">
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
import { ref, computed, h, onMounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { usePackingLogsStore } from '@/stores/packing_logs.js';
import { useVehicleTypeStore } from '@/stores/vehicle_types';
import { useRouter } from 'vue-router'


const router = useRouter();
const useVehicleType = useVehicleTypeStore();
const usePackingLogs = usePackingLogsStore();
let totalVehicleTypes = ref(0);
const deleteModal = ref(false)

onMounted(async () => {
  await usePackingLogs.getVehicleTypes();
  await usePackingLogs.getCapacitySlot();



})
// ── Inline SVG Icon Components ──────────────────────────────────────────────

const IconCar = (props) => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: props.color || '#6366f1', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3' }),
  h('circle', { cx: 7.5, cy: 17.5, r: 2.5 }),
  h('circle', { cx: 17.5, cy: 17.5, r: 2.5 })
])

const IconSUV = (props) => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: props.color || '#6366f1', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: 1, y: 9, width: 22, height: 8, rx: 2 }),
  h('path', { d: 'M4 9V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3' }),
  h('circle', { cx: 6.5, cy: 17.5, r: 2.5 }),
  h('circle', { cx: 17.5, cy: 17.5, r: 2.5 })
])

const IconElectric = (props) => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: props.color || '#22c55e', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' })
])

const IconMoto = (props) => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: props.color || '#ef4444', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('circle', { cx: 5.5, cy: 17.5, r: 3.5 }),
  h('circle', { cx: 18.5, cy: 17.5, r: 3.5 }),
  h('path', { d: 'M15 6h2l3 5H9l1-3h5z' }),
  h('path', { d: 'M9 8H5l-2 6' })
])

const IconCategories = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#6366f1', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: 2, y: 2, width: 9, height: 9 }),
  h('rect', { x: 13, y: 2, width: 9, height: 9 }),
  h('rect', { x: 2, y: 13, width: 9, height: 9 }),
  h('rect', { x: 13, y: 13, width: 9, height: 9 })
])

const IconMultiplier = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#f97316', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: 2, y: 3, width: 20, height: 14, rx: 2 }),
  h('line', { x1: 8, y1: 21, x2: 16, y2: 21 }),
  h('line', { x1: 12, y1: 17, x2: 12, y2: 21 })
])

const IconCapacity = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#6366f1', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: 3, y: 3, width: 7, height: 7 }),
  h('rect', { x: 14, y: 3, width: 7, height: 7 }),
  h('rect', { x: 3, y: 14, width: 7, height: 7 }),
  h('rect', { x: 14, y: 14, width: 7, height: 7 })
])

const IconRules = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#10b981', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' }),
  h('path', { d: 'M9 12l2 2 4-4' })
])

const IconFilter = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('polygon', { points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' })
])

const IconDownload = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
  h('polyline', { points: '7 10 12 15 17 10' }),
  h('line', { x1: 12, y1: 15, x2: 12, y2: 3 })
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

// ── State ────────────────────────────────────────────────────────────────────

const currentPage = ref(1)
const showAddModal = ref(false)
const editingVehicle = ref(null)

const form = ref({ name: '', multiplier: 1.0, occupancyLimit: 0, status: 'Active' })
const msg = ref();
const showSuccess = ref(false)
const isLoading = ref(false)

const comfimDeleteId = ref(null);
const vehicles = ref([
  { id: 1, name: 'Compact', icon: IconCar, iconColor: '#6366f1', iconBg: '#eef2ff', multiplier: '1.00x', occupancyLimit: 1200, occupancyPct: 62, barColor: '#22c55e', status: 'Active' },
  { id: 2, name: 'SUV', icon: IconSUV, iconColor: '#6366f1', iconBg: '#eef2ff', multiplier: '1.50x', occupancyLimit: 800, occupancyPct: 48, barColor: '#f59e0b', status: 'Active' },
  { id: 3, name: 'Electric', icon: IconElectric, iconColor: '#22c55e', iconBg: '#f0fdf4', multiplier: '0.85x', occupancyLimit: 300, occupancyPct: 22, barColor: '#22c55e', status: 'Active' },
  { id: 4, name: 'Motorcycle', icon: IconMoto, iconColor: '#ef4444', iconBg: '#fef2f2', multiplier: '0.50x', occupancyLimit: 150, occupancyPct: 38, barColor: '#22c55e', status: 'Paused' },
])

const stats = computed(() => [
  { label: 'Total Vehicle Types', value: vehicles.value.length, sub: '+1 this quarter', subClass: 'sub-positive', icon: IconCategories, iconBg: '#eef2ff', iconColor: '#6366f1' },
  { label: 'AVG MULTIPLIER', value: '1.25x', sub: 'Weighted by occupancy', subClass: 'sub-neutral', icon: IconMultiplier, iconBg: '#fff7ed', iconColor: '#f97316' },
  { label: 'TOTAL CAPACITY', value: '2,450', sub: 'Allocated spots', subClass: 'sub-neutral', icon: IconCapacity, iconBg: '#eef2ff', iconColor: '#6366f1' },
  { label: 'ACTIVE RULES', value: '12', sub: 'Operational system-wide', subClass: 'sub-neutral', icon: IconRules, iconBg: '#f0fdf4', iconColor: '#10b981' },
])

// ── Methods ──────────────────────────────────────────────────────────────────

const editVehicle = (id) => {
  router.push({ name : 'vehicle-type.edit',params:{id}})
  // form.value = { name: v.name, multiplier: parseFloat(v.multiplier), occupancyLimit: v.occupancyLimit, status: v.status }
}
const createType = () => {
  router.push({ name : 'vehicle-type.create'});
}
const deleteVehicle = async(id) => {
  deleteModal.value=true;
  comfimDeleteId.value=id;
  
}

const comfirmDelete = async () => {
  isLoading.value = true;
  // console.log('Id need to delete ',comfimDeleteId.value);
  
  const res = await useVehicleType.removeVehicleTypeById(comfimDeleteId.value)
  showSuccess.value = true
  msg.value = res.msg;
    await usePackingLogs.getVehicleTypes();
  setTimeout(() => {
    showSuccess.value = false;
    isLoading.value = false;
    deleteModal.value = false;
    comfimDeleteId.value=null;
  },
    2000)
}

function closeModal() {
  showAddModal.value = false
  editingVehicle.value = null
  form.value = { name: '', multiplier: 1.0, occupancyLimit: 0, status: 'Active' }
}

function saveVehicle() {
  if (!form.value.name) return
  if (editingVehicle.value) {
    const idx = vehicles.value.findIndex(v => v.id === editingVehicle.value.id)
    if (idx !== -1) {
      vehicles.value[idx] = {
        ...vehicles.value[idx],
        name: form.value.name,
        multiplier: Number(form.value.multiplier).toFixed(2) + 'x',
        occupancyLimit: Number(form.value.occupancyLimit),
        status: form.value.status,
      }
    }
  } else {
    vehicles.value.push({
      id: Date.now(),
      name: form.value.name,
      icon: IconCar,
      iconColor: '#6366f1',
      iconBg: '#eef2ff',
      multiplier: Number(form.value.multiplier).toFixed(2) + 'x',
      occupancyLimit: Number(form.value.occupancyLimit),
      occupancyPct: 0,
      barColor: '#22c55e',
      status: form.value.status,
    })
  }
  closeModal()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  font-family: 'DM Sans', sans-serif;
  background: #f5f6fa;
  min-height: 100vh;
  padding: 32px 40px;
  color: #1a1d27;
}

/* Header */
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #0f1117;
}

.page-subtitle {
  font-size: 13.5px;
  color: #6b7280;
  margin-top: 4px;
}

/* Buttons */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #3b6ef8;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(59, 110, 248, 0.25);
}

.btn-primary:hover {
  background: #2a5ce8;
}

.btn-secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 9px 18px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-icon {
  font-size: 18px;
  line-height: 1;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.7px;
  color: #9ca3af;
  text-transform: uppercase;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -1px;
  line-height: 1;
}

.stat-sub {
  font-size: 12.5px;
  margin-top: 6px;
}

.sub-positive {
  color: #10b981;
}

.sub-neutral {
  color: #9ca3af;
}

/* Table Card */
.table-card {
  background: #fff;
  border-radius: 18px;
  padding: 0 0 0 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px 18px;
  border-bottom: 1px solid #f3f4f6;
}

.table-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  border-bottom: 1px solid #f3f4f6;
}

.data-table th {
  padding: 10px 28px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-align: left;
  letter-spacing: 0.3px;
  background: #fafafa;
}

.data-table td {
  padding: 18px 28px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.table-row:last-child td {
  border-bottom: none;
}

.table-row:hover td {
  background: #fafbff;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #1a1d27;
}

.vehicle-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.multiplier {
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  font-size: 13.5px;
  color: #374151;
}

/* Progress Bar */
.progress-bar {
  width: 160px;
  height: 7px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12.5px;
  font-weight: 600;
}

.status-active {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status-paused {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
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

/* Table Footer */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  border-top: 1px solid #f3f4f6;
}

.table-count {
  font-size: 13px;
  color: #9ca3af;
}

.pagination {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 7px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn--active {
  background: #3b6ef8;
  color: #fff;
  border-color: #3b6ef8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 17, 23, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #9e1818;
  border-radius: 18px;
  width: 440px;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.modal-close {
  width: 30px;
  height: 30px;
  background: #f3f4f6;
  border: none;
  border-radius: 7px;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-input {
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  padding: 9px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
  background: #fff;
}

.form-input:focus {
  border-color: #3b6ef8;
  box-shadow: 0 0 0 3px rgba(59, 110, 248, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid #f3f4f6;
}

/* Modal div */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s;
}

.modal-enter-from .modal {
  transform: translateY(-16px) scale(0.97);
}

.modal-leave-to .modal {
  transform: translateY(8px) scale(0.97);
}

/* Toast */
.toast-success {
  position: absolute;
  bottom: 75px;
  left: 50%;
  transform: translateX(-50%);
  background: #182541d3;
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

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .data-table th,
  .data-table td {
    padding: 12px 16px;
  }

  .progress-bar {
    width: 80px;
  }
}
</style>
