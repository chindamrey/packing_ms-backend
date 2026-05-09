<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="page-title">Price Rule Management</h1>
        <p class="page-subtitle">Configure dynamic tariff adjustments for special dates and events.</p>
      </div>
      <button class="btn-create" @click="openModal()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Create New Pricing Rule
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">LIVE RULES</div>
        <div class="stat-main">
          <span class="stat-value stat-value--blue">{{ String(liveCount).padStart(2, '0') }}</span>
          <span class="stat-badge badge--green">+1 vs Last Month</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">SCHEDULED</div>
        <div class="stat-main">
          <span class="stat-value">{{ scheduledCount }}</span>
          <span class="stat-note">Q4 Roadmap</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">AVG. ADJUSTMENT</div>
        <div class="stat-main">
          <span class="stat-value">18.5%</span>
          <span class="stat-note">Peak Periods</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">REVENUE IMPACT</div>
        <div class="stat-main">
          <span class="stat-value stat-value--green">$14.2k</span>
          <span class="stat-badge badge--green-light">This Week</span>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="tab-group">
          <button
            v-for="tab in tabs" :key="tab.value"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === tab.value }"
            @click="activeTab = tab.value; currentPage = 1"
          >{{ tab.label }}</button>
        </div>
        <div class="toolbar-right">
          <button class="btn-tool" @click="filterOpen = !filterOpen">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter
          </button>
          <button class="btn-tool" @click="exportCSV">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      <!-- Filter Panel -->
      <Transition name="slide">
        <div v-if="filterOpen" class="filter-panel">
          <label>Application</label>
          <select v-model="filterApp" class="fsel">
            <option value="">All</option>
            <option v-for="a in applicationTypes" :key="a">{{ a }}</option>
          </select>
          <label>Status</label>
          <select v-model="filterStatus" class="fsel">
            <option value="">All</option>
            <option>Live</option>
            <option>Scheduled</option>
          </select>
          <button class="btn-clear" @click="filterApp = ''; filterStatus = ''">Clear</button>
        </div>
      </Transition>

      <!-- Table -->
      <table class="data-table">
        <thead>
          <tr>
            <th>Rule Name</th>
            <th>Application</th>
            <th>Adjustment</th>
            <th>Status</th>
            <th>Date Range</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in paginatedRules" :key="rule.id" class="data-row">
            <td>
              <div class="rule-name-cell">
                <span class="rule-bar" :style="{ background: rule.barColor }"></span>
                <div>
                  <div class="rule-name">{{ rule.name }}</div>
                  <div class="rule-zone">{{ rule.zone }}</div>
                </div>
              </div>
            </td>
            <td><span class="app-tag">{{ rule.application }}</span></td>
            <td>
              <span class="adjustment" :class="adjustmentClass(rule.adjustment)">{{ rule.adjustment }}</span>
            </td>
            <td>
              <span class="status-pill" :class="rule.status === 'Live' ? 'pill--live' : 'pill--scheduled'">
                <span v-if="rule.status === 'Live'" class="live-dot"></span>
                {{ rule.status }}
              </span>
            </td>
            <td>
              <div class="date-range">
                <span class="dr-main">{{ rule.dateRange }}</span>
                <span class="dr-sub">{{ rule.dateSub }}</span>
              </div>
            </td>
            <td>
              <div class="row-actions">
                <button class="action-btn" title="Edit" @click="openModal(rule)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn action-btn--del" title="Delete" @click="deleteRule(rule.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedRules.length === 0">
            <td colspan="6" class="empty">No pricing rules found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Footer -->
      <div class="table-footer">
        <span class="foot-count">Showing {{ rangeStart }} to {{ rangeEnd }} of {{ filteredRules.length }} active pricing rules</span>
        <div class="pagination">
          <button class="pg" :disabled="currentPage === 1" @click="currentPage--">&#8249;</button>
          <button v-for="p in totalPages" :key="p" class="pg" :class="{ 'pg--on': p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pg" :disabled="currentPage === totalPages" @click="currentPage++">&#8250;</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="modalOpen" class="overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-head">
            <h3>{{ editing ? 'Edit Pricing Rule' : 'Create New Pricing Rule' }}</h3>
            <button class="modal-x" @click="closeModal">×</button>
          </div>
          <div class="modal-body">
            <div class="field-row">
              <div class="field">
                <label>Rule Name</label>
                <input v-model="form.name" class="finput" placeholder="e.g. Independence Day Special" />
              </div>
              <div class="field">
                <label>Zone / Location</label>
                <input v-model="form.zone" class="finput" placeholder="e.g. Downtown Zone A & B" />
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Application Type</label>
                <select v-model="form.application" class="finput">
                  <option v-for="a in applicationTypes" :key="a">{{ a }}</option>
                </select>
              </div>
              <div class="field">
                <label>Status</label>
                <select v-model="form.status" class="finput">
                  <option>Live</option>
                  <option>Scheduled</option>
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Adjustment (e.g. +20%, -15%, Flat $10)</label>
                <input v-model="form.adjustment" class="finput" placeholder="+20%" />
              </div>
              <div class="field">
                <label>Bar Color</label>
                <select v-model="form.barColor" class="finput">
                  <option value="#2563eb">Blue</option>
                  <option value="#f59e0b">Amber</option>
                  <option value="#d1d5db">Gray</option>
                  <option value="#10b981">Green</option>
                  <option value="#ef4444">Red</option>
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Date Range</label>
                <input v-model="form.dateRange" class="finput" placeholder="e.g. Jul 01 – Jul 05 or Fri – Sun" />
              </div>
              <div class="field">
                <label>Date Sub-label</label>
                <input v-model="form.dateSub" class="finput" placeholder="e.g. 2024 (Annual)" />
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-save" @click="saveRule">{{ editing ? 'Save Changes' : 'Create Rule' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Data ─────────────────────────────────────────────────────────────────────

const rules = ref([
  { id: 1, name: 'Independence Day Special', zone: 'Downtown Zone A & B', application: 'Holiday', adjustment: '+20%', status: 'Live', dateRange: 'Jul 01 - Jul 05', dateSub: '2024 (Annual)', barColor: '#2563eb' },
  { id: 2, name: 'Summer Weekend Spike', zone: 'Beachfront Meters', application: 'Weekend', adjustment: '+$5.00', status: 'Scheduled', dateRange: 'Fri - Sun', dateSub: 'Recurring Weekly', barColor: '#f59e0b' },
  { id: 3, name: 'Early Bird Office Special', zone: 'Multi-story Garages', application: 'Early Bird', adjustment: '-15%', status: 'Live', dateRange: '05:00 - 08:30', dateSub: 'Mon - Fri', barColor: '#2563eb' },
  { id: 4, name: 'Winter Frost Surcharge', zone: 'Outdoor Lots', application: 'Seasonal', adjustment: 'Flat $10', status: 'Scheduled', dateRange: 'Dec 01 - Feb 28', dateSub: 'Next Season', barColor: '#d1d5db' },
  { id: 5, name: 'New Year Eve Premium', zone: 'City Center All Zones', application: 'Holiday', adjustment: '+35%', status: 'Scheduled', dateRange: 'Dec 31 - Jan 01', dateSub: 'Annual', barColor: '#2563eb' },
  { id: 6, name: 'Morning Rush Discount', zone: 'Park & Ride Lots', application: 'Early Bird', adjustment: '-10%', status: 'Live', dateRange: '06:00 - 09:00', dateSub: 'Weekdays', barColor: '#10b981' },
  { id: 7, name: 'Concert Night Surge', zone: 'Arena District', application: 'Event', adjustment: '+50%', status: 'Scheduled', dateRange: 'Varies', dateSub: 'Per Event', barColor: '#ef4444' },
  { id: 8, name: 'Black Friday Special', zone: 'Mall Parking Deck', application: 'Holiday', adjustment: '+25%', status: 'Scheduled', dateRange: 'Nov 29', dateSub: 'Annual', barColor: '#2563eb' },
  { id: 9, name: 'Spring Break Surge', zone: 'Beachfront Meters', application: 'Seasonal', adjustment: '+30%', status: 'Live', dateRange: 'Mar 15 - Mar 22', dateSub: 'Annual', barColor: '#f59e0b' },
  { id: 10, name: 'Late Night Discount', zone: 'All Downtown Zones', application: 'Off-Peak', adjustment: '-20%', status: 'Live', dateRange: '22:00 - 06:00', dateSub: 'Daily', barColor: '#10b981' },
  { id: 11, name: 'Sports Game Day', zone: 'Stadium Adjacent', application: 'Event', adjustment: '+45%', status: 'Scheduled', dateRange: 'Game Days', dateSub: 'Per Schedule', barColor: '#ef4444' },
  { id: 12, name: 'Thanksgiving Block', zone: 'Shopping Centers', application: 'Holiday', adjustment: '+15%', status: 'Scheduled', dateRange: 'Nov 27 - Nov 30', dateSub: 'Annual', barColor: '#2563eb' },
  { id: 13, name: 'Midday Valley Rate', zone: 'Business District', application: 'Off-Peak', adjustment: '-12%', status: 'Live', dateRange: '11:00 - 14:00', dateSub: 'Mon - Fri', barColor: '#10b981' },
  { id: 14, name: 'Marathon Sunday Block', zone: 'Race Route Lots', application: 'Event', adjustment: 'Flat $20', status: 'Scheduled', dateRange: 'Apr 14', dateSub: 'Annual', barColor: '#f59e0b' },
  { id: 15, name: 'Rainy Day Discount', zone: 'All Open Lots', application: 'Seasonal', adjustment: '-8%', status: 'Live', dateRange: 'Dynamic', dateSub: 'Weather Triggered', barColor: '#d1d5db' },
  { id: 16, name: 'Airport Shuttle Peak', zone: 'Terminal Lots', application: 'Weekend', adjustment: '+18%', status: 'Live', dateRange: 'Fri - Sun', dateSub: 'Recurring Weekly', barColor: '#2563eb' },
])

const applicationTypes = ['Holiday', 'Weekend', 'Early Bird', 'Seasonal', 'Event', 'Off-Peak']
const tabs = [
  { label: 'All Rules', value: 'all' },
  { label: 'Live Only', value: 'live' },
  { label: 'Scheduled', value: 'scheduled' },
]

// ── State ─────────────────────────────────────────────────────────────────────

const activeTab = ref('all')
const filterOpen = ref(false)
const filterApp = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const perPage = 4
const modalOpen = ref(false)
const editing = ref(null)
const form = ref({ name: '', zone: '', application: 'Holiday', adjustment: '', status: 'Live', dateRange: '', dateSub: '', barColor: '#2563eb' })

// ── Computed ──────────────────────────────────────────────────────────────────

const liveCount = computed(() => rules.value.filter(r => r.status === 'Live').length)
const scheduledCount = computed(() => rules.value.filter(r => r.status === 'Scheduled').length)

const filteredRules = computed(() => {
  let rows = rules.value
  if (activeTab.value === 'live') rows = rows.filter(r => r.status === 'Live')
  if (activeTab.value === 'scheduled') rows = rows.filter(r => r.status === 'Scheduled')
  if (filterApp.value) rows = rows.filter(r => r.application === filterApp.value)
  if (filterStatus.value) rows = rows.filter(r => r.status === filterStatus.value)
  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRules.value.length / perPage)))
const paginatedRules = computed(() => filteredRules.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage))
const rangeStart = computed(() => filteredRules.value.length === 0 ? 0 : (currentPage.value - 1) * perPage + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * perPage, filteredRules.value.length))

// ── Methods ───────────────────────────────────────────────────────────────────

function adjustmentClass(adj) {
  if (adj.startsWith('+')) return 'adj--pos'
  if (adj.startsWith('-')) return 'adj--neg'
  return 'adj--flat'
}

function openModal(rule = null) {
  if (rule) {
    editing.value = rule
    form.value = { ...rule }
  } else {
    editing.value = null
    form.value = { name: '', zone: '', application: 'Holiday', adjustment: '', status: 'Live', dateRange: '', dateSub: '', barColor: '#2563eb' }
  }
  modalOpen.value = true
}

function closeModal() { modalOpen.value = false; editing.value = null }

function saveRule() {
  if (!form.value.name) return
  if (editing.value) {
    const idx = rules.value.findIndex(r => r.id === editing.value.id)
    if (idx !== -1) rules.value[idx] = { ...rules.value[idx], ...form.value }
  } else {
    rules.value.unshift({ id: Date.now(), ...form.value })
  }
  closeModal()
}

function deleteRule(id) { rules.value = rules.value.filter(r => r.id !== id) }

function exportCSV() {
  const header = 'Rule Name,Zone,Application,Adjustment,Status,Date Range,Date Sub'
  const rows = rules.value.map(r => `"${r.name}","${r.zone}",${r.application},${r.adjustment},${r.status},"${r.dateRange}","${r.dateSub}"`)
  const csv = [header, ...rows].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'pricing-rules.csv'
  a.click()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f1f3f8;
  min-height: 100vh;
  padding: 32px 40px;
  color: #0d1117;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 12px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #0d1117;
  letter-spacing: -0.3px;
}
.page-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 3px;
}
.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px 20px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.25);
}
.btn-create:hover { background: #1d4ed8; }

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  border: 1px solid #e8eaef;
}
.stat-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.stat-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.stat-value {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -1px;
  color: #0d1117;
  line-height: 1;
}
.stat-value--blue { color: #2563eb; }
.stat-value--green { color: #16a34a; }
.stat-note {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}
.stat-badge {
  font-size: 11.5px;
  font-weight: 600;
  border-radius: 99px;
  padding: 2px 8px;
}
.badge--green { background: #f0fdf4; color: #16a34a; }
.badge--green-light { background: #f0fdf4; color: #16a34a; }

/* Table Card */
.table-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8eaef;
  overflow: hidden;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
  flex-wrap: wrap;
}
.tab-group {
  display: flex;
  gap: 2px;
  background: #f3f4f6;
  border-radius: 9px;
  padding: 3px;
}
.tab-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 7px;
  background: transparent;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.tab-btn--active {
  background: #fff;
  color: #111827;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.toolbar-right { display: flex; gap: 8px; }
.btn-tool {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-tool:hover { background: #f9fafb; }

/* Filter Panel */
.filter-panel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  background: #fafafa;
  border-bottom: 1px solid #f3f4f6;
  font-size: 12.5px;
  color: #374151;
  font-weight: 600;
}
.fsel {
  padding: 5px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12.5px;
  background: #fff;
  outline: none;
  cursor: pointer;
}
.btn-clear {
  padding: 5px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  background: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
}
.btn-clear:hover { background: #f3f4f6; }

/* Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table thead th {
  padding: 11px 22px;
  font-size: 11.5px;
  font-weight: 600;
  color: #9ca3af;
  text-align: left;
  background: #fafafa;
  border-bottom: 1px solid #f3f4f6;
  letter-spacing: 0.2px;
}
.data-table td {
  padding: 18px 22px;
  font-size: 13.5px;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}
.data-row:last-child td { border-bottom: none; }
.data-row:hover td { background: #fafbff; }

/* Rule Name Cell */
.rule-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rule-bar {
  width: 4px;
  height: 38px;
  border-radius: 99px;
  flex-shrink: 0;
}
.rule-name {
  font-weight: 700;
  font-size: 13.5px;
  color: #111827;
}
.rule-zone {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

/* App Tag */
.app-tag {
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  background: #fafafa;
}

/* Adjustment */
.adjustment {
  font-size: 14px;
  font-weight: 700;
}
.adj--pos { color: #16a34a; }
.adj--neg { color: #2563eb; }
.adj--flat { color: #111827; }

/* Status Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12.5px;
  font-weight: 600;
}
.pill--live {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.pill--scheduled {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}
.live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
}

/* Date Range */
.date-range { display: flex; flex-direction: column; gap: 2px; }
.dr-main { font-weight: 600; font-size: 13px; color: #111827; }
.dr-sub { font-size: 11.5px; color: #9ca3af; }

/* Row Actions */
.row-actions { display: flex; gap: 6px; }
.action-btn {
  width: 29px; height: 29px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 7px;
  color: #6b7280;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s, color 0.12s;
}
.action-btn:hover { background: #f3f4f6; color: #374151; }
.action-btn--del:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }

/* Empty */
.empty { text-align: center; padding: 40px !important; color: #9ca3af; font-size: 13.5px; }

/* Footer */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  border-top: 1px solid #f3f4f6;
}
.foot-count { font-size: 12.5px; color: #9ca3af; }
.pagination { display: flex; gap: 4px; }
.pg {
  min-width: 30px; height: 30px;
  padding: 0 5px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 7px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s;
}
.pg:hover:not(:disabled) { background: #f3f4f6; }
.pg:disabled { opacity: 0.35; cursor: not-allowed; }
.pg--on { background: #2563eb; color: #fff; border-color: #2563eb; font-weight: 700; }

/* Modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(13,17,23,0.48);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.modal {
  background: #fff;
  border-radius: 16px;
  width: 560px;
  max-width: 95vw;
  box-shadow: 0 24px 64px rgba(0,0,0,0.14);
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.modal-head h3 { font-size: 15px; font-weight: 700; color: #0d1117; }
.modal-x {
  width: 28px; height: 28px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  display: flex; align-items: center; justify-content: center;
}
.modal-x:hover { background: #e5e7eb; }
.modal-body {
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { font-size: 12px; font-weight: 600; color: #374151; }
.finput {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 11px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
}
.finput:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.09); }
.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px 20px;
  border-top: 1px solid #f3f4f6;
}
.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}
.btn-cancel:hover { background: #f9fafb; }
.btn-save {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-save:hover { background: #1d4ed8; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: max-height 0.2s ease, opacity 0.2s; overflow: hidden; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
.slide-enter-to, .slide-leave-from { max-height: 60px; opacity: 1; }

@media (max-width: 1024px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .page { padding: 16px; }
  .stats-row { grid-template-columns: 1fr 1fr; }
  .field-row { grid-template-columns: 1fr; }
}
</style>
