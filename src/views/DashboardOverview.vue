<template>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="page-title">Operational Overview</h1>
        <p class="page-subtitle">Real-time status for Central Parking Garage • Sector A-D</p>
      </div>
      <div class="header-actions">

      </div>
    </div>

    <!-- Top Row -->
    <div class="top-grid">

      <!-- Current Occupancy -->
      <div class="card card--occupancy">
        <div class="card-head">
          <span class="card-title">Current Occupancy</span>
          <div class="card-icon card-icon--blue">
            <button class="btn-create" @click="createSlot">

              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">

                <!-- Circle -->
                <circle cx="12" cy="12" r="9" />

                <!-- Plus sign -->
                <path d="M12 8v8" />
                <path d="M8 12h8" />

              </svg>
            </button>
          </div>
        </div>
        <div class="occupancy-body">
          <!-- Donut Chart -->
          <!-- Donut Chart -->
          <div class="donut-wrap">
            <svg viewBox="0 0 100 100" class="donut-svg">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e8edf5" stroke-width="10" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" stroke-width="10" stroke-linecap="round"
                :stroke-dasharray="`${occupancyPct * 2.98} ${238.8}`" stroke-dashoffset="59.7"
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
            <div class="capacity-tag" :style="{ color: capacityStatus.color }">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                :stroke="capacityStatus.color" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              {{ capacityStatus.label }}
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
          <div v-for="(bar, i) in revenueBars" :key="i" class="mini-bar-wrap"
            :title="`${bar.fullLabel}: $ ${formatMoney(bar.revenue)}`">
            <div class="mini-bar" :class="{ 'mini-bar--active': bar.active }" :style="{ height: bar.h + 'px' }"></div>
            <span class="mini-bar-label">{{ bar.label }}</span>
          </div>
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
            <div class="card-sub">{{ trendSubtitle }}</div>
          </div>
        </div>

        <div class="chart-filters">
          <button v-for="period in reportPeriods" :key="period.value" class="report-period"
            :class="{ 'report-period--active': activeReportPeriod === period.value }"
            @click="setActiveReportPeriod(period.value)">
            {{ period.label }}
          </button>
        </div>
        <div v-if="activeReportPeriod === 'custom'" class="custom-report-range custom-report-range--chart">
          <label class="custom-date-field">
            <span>From</span>
            <input v-model="customReportStart" type="date" />
          </label>
          <label class="custom-date-field">
            <span>Until</span>
            <input v-model="customReportEnd" type="date" />
          </label>
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
                  <div v-if="hoveredBar === i" class="bar-tooltip">{{ bar.count }} {{ bar.count === 1 ? 'car' : 'cars' }}</div>
                </Transition>
                <div class="trend-bar" :class="{ 'trend-bar--active': bar.active }" :style="{ height: bar.height + '%' }">
                </div>
              </div>
            </div>
            <div class="x-axis">
              <span v-for="xl in xLabels" :key="xl" class="x-label">{{ xl }}</span>
            </div>
          </div>
        </div>

        <div class="today-report">
          <div class="today-report__item">
            <span class="today-report__label">Cars</span>
            <strong class="today-report__value">{{ periodReport.totalCars }}</strong>
          </div>
          <div class="today-report__item">
            <span class="today-report__label">In Parking</span>
            <strong class="today-report__value today-report__value--blue">{{ periodReport.inParking }}</strong>
          </div>
          <div class="today-report__item">
            <span class="today-report__label">Revenue</span>
            <strong class="today-report__value today-report__value--green">$ {{ formatMoney(periodReport.revenue)
              }}</strong>
          </div>
          <button class="btn-report-export" @click="exportTodayReportToExcel">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Excel
          </button>
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
        <router-link :to="{ name: 'system-logs' }" class="view-link">View Full Log</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, h, onMounted, computed } from 'vue'
import { usePackingLogsStore } from '@/stores/packing_logs'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'vue-router'


dayjs.extend(relativeTime);
dayjs.extend(utc)
dayjs.extend(timezone)

const router = useRouter();
const packingLogsStore = usePackingLogsStore()

const getTimeAgo = (act) => {
  const date = act.exit_time ?? act.entry_time
  return dayjs(date).subtract(7, 'hour')
    .from(dayjs());
}
let slotId = ref()
onMounted(async () => {
  console.log('render');
  await packingLogsStore.getCapacitySlot();
  await packingLogsStore.getRevenue();
  await packingLogsStore.getRecentActivities();
  await fetchOccupancyLogs();
  slotId.value = await packingLogsStore.slotId;

  occupancyPct.value = getOccupancyPercent(packingLogsStore.currentSlot)
})

const createSlot = () => {
  console.log('the id of slot button', slotId.value)
  router.push({ name: 'slots.edit', params: { id: slotId.value } })

}

// ── Occupancy ─────────────────────────────────────────────────────────────────
const occupancyPct = ref(0)

const capacityStatus = computed(() => {
  const pct = occupancyPct.value

  if (packingLogsStore.currentSlot <= 0) {
    return { label: 'Empty', color: '#16a34a' }
  }

  if (pct >= 100) {
    return { label: 'Full Capacity', color: '#dc2626' }
  }

  if (pct >= 85) {
    return { label: 'Near Capacity', color: '#ef4444' }
  }

  if (pct >= 60) {
    return { label: 'Filling Up', color: '#d97706' }
  }

  return { label: 'Available', color: '#16a34a' }
})


// ── Revenue Bars ──────────────────────────────────────────────────────────────
const getLogRevenue = (log) => Number(log.total_fee ?? log.totalFee ?? 0)

const revenueBars = computed(() => {
  const months = Array.from({ length: 7 }, (_, index) => {
    const month = dayjs().subtract(6 - index, 'month')
    const revenue = occupancyLogs.value.reduce((sum, log) => {
      const exitTime = getLogExitTime(log)
      if (!exitTime || !dayjs(exitTime).isSame(month, 'month')) return sum
      return sum + getLogRevenue(log)
    }, 0)

    return {
      label: month.format('MMM'),
      fullLabel: month.format('MMMM YYYY'),
      revenue,
    }
  })

  const maxRevenue = Math.max(...months.map((month) => month.revenue), 0)

  return months.map((month) => ({
    h: maxRevenue > 0 ? Math.max(8, Math.round((month.revenue / maxRevenue) * 44)) : 8,
    active: month.revenue > 0,
    label: month.label,
    fullLabel: month.fullLabel,
    revenue: month.revenue,
  }))
})

// ── Trend Chart ───────────────────────────────────────────────────────────────
const hoveredBar = ref(null)
const occupancyLogs = ref([])
const isTrendLoading = ref(false)
const reportPeriods = [
  { label: 'Today', value: 'today' },
  { label: '7 Days', value: '7d' },
  { label: '14 Days', value: '14d' },
  { label: '30 Days', value: '30d' },
  { label: 'Custom', value: 'custom' },
]
const activeReportPeriod = ref('today')
const customReportStart = ref(dayjs().startOf('month').format('YYYY-MM-DD'))
const customReportEnd = ref(dayjs().format('YYYY-MM-DD'))

const getOccupancyPercent = (occupied) => {
  if (!packingLogsStore.slotMax) return 0
  return Math.min(100, Math.round((Number(occupied || 0) / packingLogsStore.slotMax) * 100))
}

const normalizeLogs = (payload) => {
  const data = payload?.data?.data ?? payload?.data ?? payload
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.parking_logs)) return data.parking_logs
  if (Array.isArray(data?.logs)) return data.logs
  return []
}

const fetchOccupancyLogs = async () => {
  try {
    isTrendLoading.value = true
    const logs = await packingLogsStore.getAllParkingLogs()
    occupancyLogs.value = normalizeLogs(logs)
  } catch (e) {
    console.error('Error fetching occupancy trend logs:', e)
    occupancyLogs.value = []
  } finally {
    isTrendLoading.value = false
  }
}

const setActiveReportPeriod = (period) => {
  activeReportPeriod.value = period
  hoveredBar.value = null
}

const trendSubtitle = computed(() => {
  if (isTrendLoading.value) return 'Loading report from parking logs'
  return `Occupancy report for ${reportRange.value.label.toLowerCase()}`
})

const trendBuckets = computed(() => {
  const range = reportRange.value

  if (activeReportPeriod.value === 'today') {
    return Array.from({ length: 24 }, (_, hour) => {
      const start = range.start.add(hour, 'hour')
      return {
        start,
        end: start.add(1, 'hour'),
        label: start.format('h A'),
      }
    })
  }

  const dayCount = Math.max(1, range.end.startOf('day').diff(range.start.startOf('day'), 'day') + 1)
  return Array.from({ length: dayCount }, (_, day) => {
    const start = range.start.startOf('day').add(day, 'day')
    return {
      start,
      end: start.add(1, 'day'),
      label: start.format('D MMM'),
    }
  })
})

const getLogEntryTime = (log) => log.entry_time ?? log.entryTime ?? log.created_at ?? log.createdAt
const getLogExitTime = (log) => log.exit_time ?? log.exitTime
const parseLogDate = (value) => {
  if (!value) return null

  const date = dayjs(value)
  return date.isValid() ? date : null
}

const logEnteredBucket = (log, bucket) => {
  const entry = parseLogDate(getLogEntryTime(log))
  return entry && !entry.isBefore(bucket.start) && entry.isBefore(bucket.end)
}

const trendEntryCounts = computed(() => trendBuckets.value.map((bucket) =>
  occupancyLogs.value.filter((log) => logEnteredBucket(log, bucket)).length
))

const yAxisMax = computed(() => {
  const maxCount = Math.max(...trendEntryCounts.value, 0)
  return Math.max(4, Math.ceil(maxCount / 4) * 4)
})

const yLabels = computed(() => {
  const step = yAxisMax.value / 4
  return Array.from({ length: 5 }, (_, index) => Math.round(yAxisMax.value - step * index))
})

const trendBars = computed(() => {
  const maxCount = yAxisMax.value

  return trendEntryCounts.value.map((count) => {
    const height = count > 0 && maxCount > 0 ? Math.max(4, Math.round((count / maxCount) * 100)) : 0
    return {
      count,
      height,
      active: count > 0,
    }
  })
})

const xLabels = computed(() => {
  const buckets = trendBuckets.value
  if (activeReportPeriod.value === 'today') {
    return buckets
      .filter((bucket, index) => index === 0 || index === buckets.length - 1 || index % 6 === 0)
      .map((bucket) => bucket.label)
  }

  if (buckets.length <= 7) return buckets.map((bucket) => bucket.label)

  return buckets
    .filter((bucket, index) => index === 0 || index === buckets.length - 1 || (index + 1) % 7 === 0)
    .map((bucket) => bucket.label)
})

const reportRange = computed(() => {
  const now = dayjs()

  if (activeReportPeriod.value === 'custom') {
    const startInput = dayjs(customReportStart.value)
    const endInput = dayjs(customReportEnd.value)
    const start = startInput.isValid() ? startInput.startOf('day') : now.startOf('day')
    const end = endInput.isValid() ? endInput.endOf('day') : now.endOf('day')
    const from = start.isAfter(end) ? end.startOf('day') : start
    const until = start.isAfter(end) ? start.endOf('day') : end

    return {
      label: `${from.format('DD/MM/YYYY')} - ${until.format('DD/MM/YYYY')}`,
      start: from,
      end: until,
    }
  }

  if (activeReportPeriod.value === 'today') {
    return {
      label: 'Today',
      start: now.startOf('day'),
      end: now.endOf('day'),
    }
  }

  const days = Number(activeReportPeriod.value.replace('d', ''))
  return {
    label: `Last ${days} Days`,
    start: now.subtract(days - 1, 'day').startOf('day'),
    end: now.endOf('day'),
  }
})

const periodLogs = computed(() => {
  const range = reportRange.value
  return occupancyLogs.value.filter((log) => {
    const entry = parseLogDate(getLogEntryTime(log))
    return entry && !entry.isBefore(range.start) && !entry.isAfter(range.end)
  })
})

const periodReport = computed(() => {
  const totalCars = periodLogs.value.length
  const inParking = periodLogs.value.filter((log) => !getLogExitTime(log) || log.status === 'IN').length
  const revenue = periodLogs.value.reduce((sum, log) => {
    if (!getLogExitTime(log)) return sum
    return sum + Number(log.total_fee ?? log.totalFee ?? 0)
  }, 0)

  return {
    totalCars,
    inParking,
    revenue,
  }
})

const formatMoney = (value) => Number(value || 0).toFixed(2)

const escapeExcelCell = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const formatExportDate = (value) => {
  if (!value) return ''
  const date = dayjs(value)
  return date.isValid() ? date.format('DD/MM/YYYY HH:mm:ss') : ''
}

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
  const data = packingLogsStore.recentActivities.map(a => `${a.plate_number},${a.vehicle_type},${a.status},${a.entry_time},${a.exit_time ?? ''}`).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([`Plate Number,Vehicle Type,Status,Entry Time,Exit Time\n${data}`], { type: 'text/csv' }))
  a.download = 'operational-overview.csv'
  a.click()
}

function exportTodayReportToExcel() {
  const summaryRows = [
    ['Report Period', reportRange.value.label],
    ['Start Date', reportRange.value.start.format('DD/MM/YYYY HH:mm:ss')],
    ['End Date', reportRange.value.end.format('DD/MM/YYYY HH:mm:ss')],
    ['Cars', periodReport.value.totalCars],
    ['In Parking', periodReport.value.inParking],
    ['Revenue', `$ ${formatMoney(periodReport.value.revenue)}`],
  ]

  const detailRows = periodLogs.value.map((log) => [
    log.plate_number ?? log.plateNumber ?? '',
    log.vehicle_type ?? log.vehicleType ?? '',
    log.status ?? '',
    formatExportDate(getLogEntryTime(log)),
    formatExportDate(getLogExitTime(log)),
    formatMoney(log.total_fee ?? log.totalFee ?? 0),
  ])

  const summaryHtml = summaryRows
    .map((row) => `<tr><td>${escapeExcelCell(row[0])}</td><td>${escapeExcelCell(row[1])}</td></tr>`)
    .join('')

  const detailHtml = detailRows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeExcelCell(cell)}</td>`).join('')}</tr>`)
    .join('')

  const worksheet = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <tr><th colspan="2">Parking Report</th></tr>
          ${summaryHtml}
        </table>
        <br>
        <table border="1">
          <tr>
            <th>Plate Number</th>
            <th>Vehicle Type</th>
            <th>Status</th>
            <th>Entry Time</th>
            <th>Exit Time</th>
            <th>Total Fee</th>
          </tr>
          ${detailHtml}
        </table>
      </body>
    </html>
  `

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([worksheet], { type: 'application/vnd.ms-excel' }))
  a.download = `parking-report-${activeReportPeriod.value}-${dayjs().format('YYYY-MM-DD')}.xls`
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

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  /* background: #2563eb; */
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  /* box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25); */
}

.btn-create:hover {
  background: #abc2ff70;
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
  align-items: stretch;
  gap: 5px;
  height: 64px;
}

.mini-bar-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.mini-bar {
  width: 100%;
  background: #e8edf5;
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
}

.mini-bar--active {
  background: #2563eb;
}

.mini-bar-label {
  width: 100%;
  color: #9ca3af;
  font-size: 9.5px;
  font-weight: 600;
  line-height: 1;
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.chart-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: -4px 0 12px;
}

.today-report {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 10px;
  align-items: stretch;
  padding-top: 14px;
  border-top: 1px solid #f3f4f6;
}

.report-periods {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 2px;
}

.report-period {
  padding: 6px 11px;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  background: #fff;
  color: #6b7280;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.report-period--active {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #16a34a;
}

.custom-report-range {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 220px));
  gap: 10px;
  align-items: end;
}

.custom-report-range--chart {
  grid-column: auto;
  margin: -4px 0 12px;
}

.custom-date-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.custom-date-field input {
  height: 36px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 10px;
  color: #111827;
  background: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  outline: none;
}

.custom-date-field input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.today-report__item {
  background: #f8fafc;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 0;
}

.today-report__label {
  display: block;
  color: #9ca3af;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.today-report__value {
  display: block;
  color: #111827;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
}

.today-report__value--blue {
  color: #2563eb;
}

.today-report__value--green {
  color: #16a34a;
}

.btn-report-export {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  align-self: stretch;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-report-export:hover {
  background: #1f2937;
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

  .today-report {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .btn-report-export {
    grid-column: 1 / -1;
    min-height: 38px;
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

  .today-report {
    grid-template-columns: 1fr;
  }

  .custom-report-range {
    grid-template-columns: 1fr;
  }
}
</style>
