<template>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="page-title">Operational Overview</h1>
        <p class="page-subtitle">Real-time status for Central Parking Garage • Sector A-D</p>
      </div>
      <div class="header-actions">
        <button class="btn-today">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Today
        </button>
        <button class="btn-export" @click="exportData">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Data
        </button>
      </div>
    </div>

    <!-- Top Row -->
    <div class="top-grid">

      <!-- Current Occupancy -->
      <div class="card card--occupancy">
        <div class="card-head">
          <span class="card-title">Current Occupancy</span>
          <div class="card-icon card-icon--blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-3h8l3 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />
            </svg>
          </div>
        </div>
        <div class="occupancy-body">
          <!-- Donut Chart -->
          <div class="donut-wrap">
            <svg viewBox="0 0 100 100" class="donut-svg">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e8edf5" stroke-width="10" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" stroke-width="10" stroke-linecap="round"
                :stroke-dasharray="`${occupancyPct * 2.388} ${238.8}`" stroke-dashoffset="59.7"
                style="transition: stroke-dasharray 0.8s ease;" />
            </svg>
            <div class="donut-label">{{ occupancyPct }}%</div>
          </div>
          <div class="occupancy-info">
            <div class="avail-label">AVAILABLE SLOTS</div>
            <div class="avail-count">
              <span class="avail-num">{{ packingLogsStore.currentSlot }}</span>
              <span class="avail-total">/ {{ packingLogsStore.slotMax }}</span>
            </div>
            <div class="capacity-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              Near Capacity
            </div>
          </div>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="card card--revenue">
        <div class="card-head">
          <div>
            <span class="card-title">Total Revenue</span>
            <div class="card-sub">All time</div>
          </div>
          <div class="card-icon card-icon--green">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
        <div class="revenue-amount">$ {{ packingLogsStore.revenue }}</div>

        <!-- Mini Bar Chart -->
        <div class="mini-chart">
          <div v-for="(bar, i) in revenueBars" :key="i" class="mini-bar" :class="{ 'mini-bar--active': bar.active }"
            :style="{ height: bar.h + 'px' }"></div>
        </div>
      </div>

      <!-- System Alerts -->
      <div class="card card--alerts d-none">
        <div class="card-head">
          <span class="card-title">System Alerts</span>
          <span class="critical-badge">2 CRITICAL</span>
        </div>
        <div class="alerts-list">
          <div class="alert-item alert-item--red">
            <div class="alert-icon alert-icon--red">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div class="alert-body">
              <div class="alert-title">Gate 3 Malfunction</div>
              <div class="alert-desc">Hardware sensor failure detected 14m ago.</div>
            </div>
          </div>
          <div class="alert-item alert-item--yellow">
            <div class="alert-icon alert-icon--yellow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div class="alert-body">
              <div class="alert-title">Payment Terminal Offline</div>
              <div class="alert-desc">Kiosk #04 connection timeout in Sector B.</div>
            </div>
          </div>
        </div>
        <button class="view-link">View All Alerts</button>
      </div>

    </div>

    <!-- Bottom Row -->
    <div class="bottom-grid">

      <!-- Occupancy Trends -->
      <div class="card card--trends">
        <div class="card-head">
          <div>
            <span class="card-title">Occupancy Trends</span>
            <div class="card-sub">Historical data for the last 24 hours</div>
          </div>
          <div class="trend-tabs">
            <button v-for="t in trendTabs" :key="t" class="trend-tab"
              :class="{ 'trend-tab--active': activeTrend === t }" @click="activeTrend = t">{{ t }}</button>
          </div>
        </div>

        <!-- Bar Chart -->
        <div class="bar-chart">
          <div class="bar-y-axis">
            <span v-for="l in yLabels" :key="l" class="y-label">{{ l }}</span>
          </div>
          <div class="bars-area">
            <div class="grid-lines">
              <div v-for="l in yLabels" :key="l" class="grid-line"></div>
            </div>
            <div class="bars-row">
              <div v-for="(bar, i) in trendBars" :key="i" class="trend-bar-wrap" @mouseenter="hoveredBar = i"
                @mouseleave="hoveredBar = null">
                <Transition name="tooltip">
                  <div v-if="hoveredBar === i" class="bar-tooltip">{{ bar.pct }}%</div>
                </Transition>
                <div class="trend-bar" :class="{ 'trend-bar--active': bar.active }" :style="{ height: bar.pct + '%' }">
                </div>
              </div>
            </div>
            <div class="x-axis">
              <span v-for="xl in xLabels" :key="xl" class="x-label">{{ xl }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card card--activity">
        <div class="card-head">
          <span class="card-title">Recent Activity</span>
        </div>
        <div class="activity-list">
          <div v-for="act in packingLogsStore.recentActivities" :key="act.id" class="activity-item">
            <div class="act-icon-wrap" :class="`act-icon--${act.status}`">
              <component :is="act.status === 'IN' ? EntryIcon : ExitIcon" />
            </div>
            <div class="act-body">
              <div class="act-title">{{ act.plate_number }}</div>
              <div class="act-desc">Vehicle {{ act.vehicle_type }}</div>
            </div>
            <div class="act-time">{{ getTimeAgo(act) }}</div>
          </div>
        </div>
        <button class="view-link">View Full Log</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { usePackingLogsStore } from '@/stores/packing_logs'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'


dayjs.extend(relativeTime);
dayjs.extend(utc)
dayjs.extend(timezone)

const packingLogsStore = usePackingLogsStore()

const getTimeAgo = (act) => {
  const date = act.exit_time ?? act.entry_time
  return dayjs(date).subtract(7, 'hour')
  .from(dayjs());
}
onMounted(async () => {
  console.log('render');
  await packingLogsStore.getCapacitySlot();
  await packingLogsStore.getRevenue();
  await packingLogsStore.getRecentActivities();
  occupancyPct.value = Math.round((packingLogsStore.currentSlot / packingLogsStore.slotMax) * 100)
})
// ── Occupancy ─────────────────────────────────────────────────────────────────
const occupancyPct = ref(0)


// ── Revenue Bars ──────────────────────────────────────────────────────────────
const revenueBars = ref([
  { h: 18, active: false }, { h: 22, active: false }, { h: 20, active: false },
  { h: 36, active: true }, { h: 24, active: false }, { h: 28, active: false },
  { h: 40, active: true },
])

// ── Trend Chart ───────────────────────────────────────────────────────────────
const trendTabs = ['24h', '7d', '30d']
const activeTrend = ref('24h')
const hoveredBar = ref(null)

const yLabels = ['100%', '75%', '50%', '25%', '0%']
const xLabels = ['00:00', '06:00', '12:00', '18:00', '23:59']

const trendBars = ref([
  { pct: 12, active: false }, { pct: 8, active: false }, { pct: 10, active: false },
  { pct: 22, active: false }, { pct: 30, active: false }, { pct: 48, active: false },
  { pct: 62, active: false }, { pct: 80, active: true }, { pct: 92, active: true },
  { pct: 78, active: true }, { pct: 72, active: true }, { pct: 60, active: true },
  { pct: 50, active: false }, { pct: 46, active: false }, { pct: 52, active: false },
  { pct: 55, active: false }, { pct: 62, active: false }, { pct: 80, active: true },
  { pct: 85, active: true }, { pct: 88, active: true }, { pct: 70, active: true },
  { pct: 55, active: false }, { pct: 38, active: false }, { pct: 30, active: false },
  { pct: 22, active: false }, { pct: 16, active: false }, { pct: 28, active: false },
  { pct: 12, active: false },
])

// ── Activity Icons ─────────────────────────────────────────────────────────────
const EntryIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#16a34a', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' }),
  h('polyline', { points: '10 17 15 12 10 7' }),
  h('line', { x1: 15, y1: 12, x2: 3, y2: 12 }),
])
const ExitIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#2563eb', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
  h('polyline', { points: '16 17 21 12 16 7' }),
  h('line', { x1: 21, y1: 12, x2: 9, y2: 12 }),
])
const DenyIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#dc2626', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('circle', { cx: 12, cy: 12, r: 10 }),
  h('line', { x1: 4.93, y1: 4.93, x2: 19.07, y2: 19.07 }),
])


// ── Export ────────────────────────────────────────────────────────────────────
function exportData() {
  const data = recentActivity.value.map(a => `${a.title},${a.desc},${a.time}`).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([`Title,Details,Time\n${data}`], { type: 'text/csv' }))
  a.download = 'operational-overview.csv'
  a.click()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page {
  font-family: 'Inter', sans-serif;
  background: #f0f2f7;
  min-height: 100vh;
  padding: 32px 36px 60px;
  color: #0d1117;
  position: relative;
}

/* ── Header ── */
.header {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 26px;
  gap: 12px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.7px;
  color: #0d1117;
}

.page-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-today {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-today:hover {
  background: #f9fafb;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.btn-export:hover {
  background: #1d4ed8;
}

/* ── Card Base ── */
.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8eaef;
  padding: 22px 24px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.card-sub {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon--blue {
  background: #eff4ff;
}

.card-icon--green {
  background: #f0fdf4;
}

/* ── Top Grid ── */
.top-grid {
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 18px;
  margin-bottom: 18px;
}

/* ── Occupancy Card ── */
.occupancy-body {
  display: flex;
  align-items: center;
  gap: 24px;
}

.donut-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  transform: rotate(0deg);
}

.avail-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.avail-count {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: 8px;
}

.avail-num {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -1px;
}

.avail-total {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

.capacity-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
}

/* ── Revenue Card ── */
.revenue-amount {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -1.5px;
  margin-bottom: 8px;
}

.revenue-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.rev-badge {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 2px 8px;
}

.rev-from {
  font-size: 12.5px;
  color: #9ca3af;
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 44px;
}

.mini-bar {
  flex: 1;
  background: #e8edf5;
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
}

.mini-bar--active {
  background: #2563eb;
}

/* ── Alerts Card ── */
.critical-badge {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  letter-spacing: 0.3px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border-left: 3px solid transparent;
}

.alert-item--red {
  background: #fff5f5;
  border-left-color: #ef4444;
}

.alert-item--yellow {
  background: #fffbeb;
  border-left-color: #f59e0b;
}

.alert-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon--red {
  background: #fee2e2;
}

.alert-icon--yellow {
  background: #fef3c7;
}

.alert-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.alert-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.view-link {
  width: 100%;
  background: none;
  border: none;
  color: #2563eb;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  padding: 6px 0;
  transition: color 0.15s;
}

.view-link:hover {
  color: #1d4ed8;
}

/* ── Bottom Grid ── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 18px;
}

/* ── Trends Card ── */
.card--trends {
  padding-bottom: 8px;
}

.trend-tabs {
  display: flex;
  gap: 4px;
}

.trend-tab {
  padding: 5px 12px;
  border-radius: 7px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.trend-tab--active {
  background: #f0f5ff;
  border-color: #bfcfff;
  color: #2563eb;
}

/* Bar Chart Layout */
.bar-chart {
  display: flex;
  gap: 8px;
  height: 280px;
  padding-bottom: 28px;
  position: relative;
}

.bar-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 0;
  width: 36px;
  flex-shrink: 0;
  padding-top: 4px;
}

.y-label {
  font-size: 10.5px;
  color: #c4c9d4;
  font-weight: 500;
  text-align: right;
  line-height: 1;
}

.bars-area {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.grid-lines {
  position: absolute;
  inset: 0;
  bottom: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.grid-line {
  width: 100%;
  height: 1px;
  background: #f0f2f7;
}

.bars-row {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  padding-bottom: 4px;
  position: relative;
  z-index: 1;
}

.trend-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.trend-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: #dde5f5;
  transition: height 0.5s ease, background 0.15s;
  min-height: 4px;
}

.trend-bar--active {
  background: #2563eb;
}

.trend-bar-wrap:hover .trend-bar {
  background: #1d4ed8;
}

.bar-tooltip {
  position: absolute;
  top: -26px;
  background: #0d1117;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.bar-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #0d1117;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  padding: 6px 0 2px;
}

.x-label {
  font-size: 10.5px;
  color: #c4c9d4;
  font-weight: 500;
}

/* ── Activity Card ── */
.card--activity {
  display: flex;
  flex-direction: column;
}

.activity-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 8px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.act-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.act-icon--IN {
  background: #f0fdf4;
}

.act-icon--OUT {
  background: #eff4ff;
}

.act-icon--DENY {
  background: #fff5f5;
}

.act-body {
  flex: 1;
  min-width: 0;
}

.act-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.act-desc {
  font-size: 11.5px;
  color: #9ca3af;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.act-time {
  font-size: 11.5px;
  color: #c4c9d4;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── FAB ── */
.fab {
  position: fixed;
  bottom: 32px;
  right: 36px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #2563eb;
  border: none;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  z-index: 100;
}

.fab:hover {
  background: #1d4ed8;
  transform: scale(1.06);
  box-shadow: 0 8px 28px rgba(37, 99, 235, 0.45);
}

.fab:active {
  transform: scale(0.96);
}

/* ── Tooltip transition ── */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .top-grid {
    grid-template-columns: 1fr 1fr;
  }

  .card--alerts {
    grid-column: span 2;
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 16px 14px 60px;
  }

  .top-grid {
    grid-template-columns: 1fr;
  }

  .card--alerts {
    grid-column: span 1;
  }

  .page-title {
    font-size: 22px;
  }
}
</style>