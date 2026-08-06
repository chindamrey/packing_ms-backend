<template>
  <div class="terminal-wrapper">
    <!-- LEFT PANEL -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">P</div>
        <div class="brand-text">
          <span class="brand-name">NIB PARK</span>
          <span class="brand-sub">PREMIUM PARKING</span>
        </div>
      </div>
      <div v-if="!showQrCard" class="slot-card">
        <div class="slot-card-header">
          <div>

            <div class="slot-label">AVAILABLE SLOTS</div>
            <div class="slot-number">{{ capacity.totalCapacity - capacity.slotsInUse }}</div>
          </div>

          <span
            :class="['status-badge', capacity.totalCapacity - capacity.slotsInUse > 0 ? 'badge-green' : 'badge-red']">{{
              capacity.totalCapacity - capacity.slotsInUse > 0 ? 'AVAILABLE' : 'FULL' }}</span>
        </div>
      </div>

      <div v-if="!showQrCard" class="usage-card">

        <div class="usage-stats">
          <div class="usage-item">
            <span class="usage-key">SLOTS IN USAGE</span>
            <span class="usage-val">{{ capacity.slotsInUse.toLocaleString() }}</span>
          </div>
          <div class="divider-v"></div>
          <div class="usage-item">
            <span class="usage-key">TOTAL CAPACITY</span>
            <span class="usage-val">{{ capacity.totalCapacity.toLocaleString() }}</span>
          </div>
        </div>
        <div class="capacity-bar">
          <div class="capacity-fill" :style="{ width: capacity.slotsInUse / capacity.totalCapacity * 100 + '%' }"></div>
        </div>
      </div>

      <!-- QR Payment -->

      <div v-else-if="showQrCard" class="qr-card">
        <div class="section-label">SCAN TO PAY</div>
        <div class="qr-frame" :class="{ 'qr-frame--paid': qrPaidOverlayVisible }">
          <KhqrCard :qr-image-src="qrPaymentSrc">{{ finalTotal }}</KhqrCard>
          <Transition name="qr-paid-overlay">
            <div v-if="qrPaidOverlayVisible" class="qr-paid-overlay">
              <span class="qr-paid-overlay__badge">PAID</span>
              <span class="qr-paid-overlay__text">Payment received</span>
            </div>
          </Transition>

        </div>
        <div class="qr-meta">
          <span class="qr-plate">{{ vehicle.plate }}</span>
        </div>
      </div>
    </aside>

    <!-- RIGHT PANEL -->
    <main class="main-panel">
      <header class="terminal-header">
        <div class="terminal-status">
          <span :class="['pulse-dot', wsConnected ? 'dot-green' : 'dot-red']"></span>
          Terminal #{{ terminalInfo.id }} • {{ wsConnected ? 'Secure Link Active' : 'Connecting…' }}
        </div>
        <div class="card-header">
          <span class="card-label">GATE </span>
          <span class="status-chip" :class="gateStatus ? 'chip-green' : 'chip-red'">
            <span class="chip-dot"></span>

            {{ gateStatus ? 'OPEN' : 'CLOSED' }}

          </span>
        </div>

        <div class="terminal-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {{ currentTime }}
        </div>
      </header>

      <div class="content-area">
        <!-- Plate -->
        <div class="plate-section">
          <div class="plate-label">PLATE NUMBER</div>
          <div class="plate-display">
            <span class="plate-text">{{ vehicle.plate }}</span>
          </div>
        </div>

        <!-- Session Info -->
        <div class="session-card">
          <div class="session-item">
            <span class="session-key">ARRIVAL</span>
            <div class="session-val">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              {{ session.arrival }}
            </div>
          </div>
          <div class="session-item">
            <span class="session-key">DEPARTURE</span>
            <div class="session-val">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              {{ session.departure }}
            </div>
          </div>
          <div class="session-grid">
            <div class="session-item">
              <span class="session-key">DURATION</span>
              <div class="session-val">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {{ session.duration }}
              </div>
            </div>
            <div class="session-item">
              <span class="session-key">VEHICLE</span>
              <div class="session-val">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                  <rect x="2" y="9" width="20" height="11" rx="2" />
                  <path d="M5 9V7a7 7 0 0114 0v2" />
                </svg>
                {{ vehicle.type }}
              </div>
            </div>
          </div>

          <div class="payment-status-row">
            <span class="payment-key">Car Status</span>
            <span :class="['payment-badge', session.paymentStatus === 'IN' ? 'badge-green' : 'badge-red']">
              <span class="badge-dot"></span>
              {{ session.paymentStatus }}
            </span>
          </div>

          <!-- Discount row (shown only when discount > 0) -->
          <div v-if="session.discount > 0" class="discount-row">
            <span class="payment-key">Discount</span>
            <span class="discount-val">-${{ Number(session.discount).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Total Due -->
        <div class="total-card">
          <div class="total-label">TOTAL PAYMENT</div>
          <div class="total-amount">
            <span class="currency">$</span>
            <span class="amount">{{ formattedTotal }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { formatDateTime } from '../../utils/dateFormater.js'
import KhqrCard from '../../components/KhqrCard.vue'
import api from '../../api/api.js'
import { usePackingLogsStore } from '../../stores/packing_logs.js'
import { usePaymentStore } from '../../stores/payment.js'


// ── Terminal meta ──────────────────────────────────────────────
const SOCKET_URL = 'ws://localhost:8765'
const RESTART_DELAY_SECONDS = ref(3000)
const DEFAULT_GATE_COUNTDOWN_SECONDS = ref(RESTART_DELAY_SECONDS.value)
const PAYMENT_GATE_COUNTDOWN_SECONDS = ref(RESTART_DELAY_SECONDS.value)

const terminalInfo = ref({ id: '402' })
const currentTime = ref('')
const wsConnected = ref(false)
const packingLogsStore = usePackingLogsStore()
let socket = null
const gateStatus = ref(false)
const gateCountdown = ref(null)
const gateCountdownDuration = ref(RESTART_DELAY_SECONDS.value)
const paymentSuccessVisible = ref(false)
const paymentSuccessMessage = ref('Dear client, you paid successfully. The gate will open now.')
const paymentGateReleased = ref(false)
const qrPaidOverlayVisible = ref(false)
const qrCardHidden = ref(false)
const gateMessage = ref('--')
let gateCountdownTimer = null
const payments = usePaymentStore();
let paymentSuccessTimer = null
let paymentVerifyTimer = null
let finalTotal = ref(0)
let md5_hash = ref(null);
let status = ref(false);
let isVerifying = false;
// Capacity state


let capacity = reactive({
  availableSlots: 0,
  slotsInUse: 0,
  totalCapacity: 0,
})

function updateTime() {
  const now = new Date()
  currentTime.value =
    now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' +
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

let clockTimer
onMounted(() => {
  updateTime();
  getCarCapacity();
  clockTimer = setInterval(updateTime, 1000)
})
onUnmounted(() => {
  clearInterval(clockTimer)
  clearGateCountdownTimer()
  closeWebSocket()
})

// ── Facility data ──────────────────────────────────────────────

const occupancyPercent = computed(() =>
  Math.round((capacity.slotsInUse / capacity.totalCapacity) * 100)
)
const getCarCapacity = async () => {
  try {
    const res = await api.get('/plates/all-entry');
    // console.log('data test ; ', res.data.data);
    const data = res.data.data;
    // console.log("Car capacity:", data);
    capacity.slotsInUse = data?.total;
    capacity.totalCapacity = data.slot_limit?.total_slot;

    capacity.availableSlots = capacity.slotsInUse < capacity.totalCapacity ? capacity.totalCapacity - capacity.slotsInUse : 0;
    // console.log('all plates : ', data);

  } catch (error) {
    console.error(error);
  }
};
const slotStatus = computed(() => {
  const pct = occupancyPercent.value
  if (pct < 70) return { label: 'PLENTY SPACE', class: 'badge-green' }
  if (pct < 90) return { label: 'FILLING UP', class: 'badge-yellow' }
  return { label: 'ALMOST FULL', class: 'badge-red' }
})

// Animated slot counter
const animatedSlots = ref(0)
onMounted(() => {
  const target = capacity.availableSlots
  const step = Math.ceil(target / 40)
  const t = setInterval(() => {
    animatedSlots.value = Math.min(animatedSlots.value + step, target)
    if (animatedSlots.value >= target) clearInterval(t)
  }, 30)

})

// ── Vehicle / session state ────────────────────────────────────
const vehicle = reactive({
  plate: '--',
  type: '--',
})

const session = reactive({
  arrival: '--',
  departure: '--',
  duration: '--',
  paymentStatus: '--',
  total: '0.00',
  discount: 0,
})

// ── Derived / formatted ────────────────────────────────────────
const formattedTotal = computed(() =>
  Number(session.total || 0).toFixed(2)
)

const normalizedPaymentStatus = computed(() =>
  String(session.paymentStatus || '').trim().toUpperCase()
)

const showParkingStats = computed(() =>
  !['OUT', 'LEFT', 'EXIT', 'DEPARTED'].includes(normalizedPaymentStatus.value)
)

const showQrCard = computed(() =>
  (['OUT', 'LEFT', 'EXIT', 'DEPARTED'].includes(normalizedPaymentStatus.value) && !payments.paid && !qrCardHidden.value) || qrPaidOverlayVisible.value
)

const requiresPaymentCheck = computed(() => normalizedPaymentStatus.value === 'OUT')
const effectiveGateStatus = computed(() =>
  requiresPaymentCheck.value ? paymentGateReleased.value : gateStatus.value
)

const paymentBadgeClass = computed(() => ({
  'badge-ready': session.paymentStatus === 'Ready for Payment',
  'badge-paid': session.paymentStatus === 'Paid',
  'badge-pending': session.paymentStatus === 'Pending',
}))

// ── QR Code ────────────────────────────────────────────────────
const qrPaymentSrc = ref();

// const qrPaymentSrc = computed(() => packingLogsStore.paymentQrSrc || qrPaymentBase64.value)



// ── WebSocket helpers ──────────────────────────────────────────
const parseSocketData = (rawData) => {
  if (typeof rawData !== 'string') return rawData
  try {
    return JSON.parse(rawData)
  } catch {
    console.error('Invalid websocket data:', rawData)
    return null
  }
}

const safeDateTime = (value) => {
  if (!value) return '--'
  const formatted = formatDateTime(value)
  return formatted.includes('NaN') ? '--' : formatted
}

const formatDuration = (duration) => {
  if (!duration) return '--'
  const h = duration.hours ?? 0
  const m = duration.minutes ?? 0
  const s = duration.seconds ?? 0
  return `${h}h ${m}m ${s}s`
}

// ── Map incoming WebSocket payload → local state ───────────────
const clearGateCountdownTimer = () => {
  if (gateCountdownTimer) {
    clearInterval(gateCountdownTimer)
    gateCountdownTimer = null
  }
}


const closeGateCountdown = () => {
  gateCountdown.value = null
  clearGateCountdownTimer()
}

const clearPaymentSuccessTimer = () => {
  if (paymentSuccessTimer) {
    clearTimeout(paymentSuccessTimer)
    paymentSuccessTimer = null
  }
}

const clearPaymentVerifyTimer = () => {
  if (paymentVerifyTimer) {
    clearInterval(paymentVerifyTimer)
    paymentVerifyTimer = null
  }
}

const closeGate = () => {
  // gateStatus.value = false
  paymentGateReleased.value = false
  gateCountdownDuration.value = RESTART_DELAY_SECONDS.value
  closeGateCountdown()
}

const resetPaymentSuccessModal = () => {
  paymentSuccessVisible.value = false
  paymentGateReleased.value = false
  qrPaidOverlayVisible.value = false
  clearPaymentSuccessTimer()
}

const showPaymentSuccessModal = (message) => {
  clearPaymentSuccessTimer()
  if (message) {
    paymentSuccessMessage.value = message
  }
  paymentSuccessVisible.value = true

  paymentSuccessTimer = setTimeout(() => {
    paymentSuccessVisible.value = false
    paymentSuccessTimer = null
  }, 2200)
}

const isPaymentPaidResponse = (response) => {
  const statusCandidates = [
    response?.status,
    response?.payment_status,
    response?.data?.status,
    response?.data?.payment_status,
    response?.data?.data?.status,
    response?.data?.data?.payment_status,
  ]

  return statusCandidates.some((value) => {
    const normalized = String(value ?? '').trim().toLowerCase()
    return ['paid', 'success', 'successful', 'completed', 'done', 'true'].includes(normalized)
  })
}


const startPaymentVerification = () => {
  clearPaymentVerifyTimer()

  paymentVerifyTimer = setInterval(async () => {
    if (!md5_hash.value) return  // ✅ guard against null md5
    await verifyPayment({ md5: md5_hash.value })
  }, 1000)
}

const handlePaymentSuccess = () => {
  clearPaymentVerifyTimer()
  session.paymentStatus = 'PAID'
  // gateStatus.value = true
  paymentGateReleased.value = true
  gateCountdownDuration.value = PAYMENT_GATE_COUNTDOWN_SECONDS

  showPaymentSuccessModal('Dear client, you paid successfully. The gate will close again in 15 seconds.')
  startGateCountdown(PAYMENT_GATE_COUNTDOWN_SECONDS)
}

const generateQR = async (payload) => {
  const qr = await payments.generateQR(payload)
  // console.log('md5 : ', qr);
  md5_hash.value = qr.data.md5;

  qrPaymentSrc.value = qr.data?.qrBase64
  qrPaidOverlayVisible.value = false
}


const verifyPayment = async (payload) => {

  if (isVerifying) return;

  isVerifying = true;

  try {
    const res = await payments.verifyPaymentByMd5(payload);
    console.log(res)
    if (res?.data?.responseCode === 0) {
      payments.paid = true;
      gateStatus.value = true;
      payments.RESTART_COUNTDOWN_SECONDS = 15;
      qrPaidOverlayVisible.value = true

      clearInterval(paymentVerifyTimer);
      paymentVerifyTimer = null;

      // Hide overlay and QR card after 5 seconds
      setTimeout(() => {
        qrPaidOverlayVisible.value = false
        qrCardHidden.value = true
        payments.paid = false;
        payments.isPaid = false;
        window.location.reload(true);
      }, 5000)
    }
    console.log('verify payment', payments.paid);
  }
  catch (e) {

    payments.paid = false
  }
  finally {
    isVerifying = false;
  }
};
const startGateCountdown = (seconds) => {
  clearGateCountdownTimer()
  gateCountdown.value = Math.max(0, Math.ceil(Number(seconds) || 0))

  if (gateCountdown.value === 0) {
    closeGateCountdown()
    return
  }

  gateCountdownTimer = setInterval(() => {
    gateCountdown.value = Math.max(0, gateCountdown.value - 1)

    if (gateCountdown.value <= 0) {
      closeGate()
    }
  }, 1000)
}



const updateFromPayload = (payload) => {
  if (!payload) return

  const sessionData = payload.data?.data ?? payload.data ?? payload
  const entryInfo = sessionData.entry_info ?? sessionData.entryInfo ?? {}
  const duration = sessionData.duration ?? payload.duration

  // vehicle
  vehicle.plate = payload.plate ?? entryInfo.plate_number ?? entryInfo.plateNumber ?? vehicle.plate
  vehicle.type = entryInfo.vehicle_type ?? entryInfo.vehicleType ?? '--'

  // session
  session.arrival = safeDateTime(entryInfo.entry_time ?? entryInfo.entryTime)
  session.departure = safeDateTime(entryInfo.exit_time ?? entryInfo.exitTime)
  session.duration = formatDuration(duration)
  session.total = sessionData.finalFee ?? sessionData.totalFee ?? '0.00'
  session.discount = sessionData.discount ?? sessionData.discount_amount ?? 0
  session.paymentStatus = entryInfo.status;

  // gateStatus.value = payload.gate_status === 'open'
  gateMessage.value = payload.gate_message ?? payload.data?.msg ?? gateMessage.value


  if (!gateStatus.value) {
    closeGateCountdown()
  }
}

// ── WebSocket lifecycle ────────────────────────────────────────
const connectWebSocket = () => {
  socket = new WebSocket(SOCKET_URL)

  socket.onopen = () => {

    wsConnected.value = true
  }

  socket.onmessage = (event) => {
    // console.log('Raw exit summary websocket data:', event.data)
    const data = parseSocketData(event.data)
    // console.log('Raw exit summary websocket data:', data)
    if (data.plate !== null) {
      getCarCapacity()
    }
    if (data.data?.data?.entry_info?.status === 'IN') {
      gateStatus.value = true
    }
    // In socket.onmessage, replace the bottom block:
    if (data.data?.data?.entry_info?.status === 'OUT') {// ✅ Await QR generation FIRST, then start verification
      generateQR({
        amount: data.data?.data?.finalFee,
        plate_number: data.data?.data?.entry_info?.plate_number,
        currency: 'USD',
      }).then(() => {
        startPaymentVerification()  // ✅ uses your proper cleanup + md5 is ready
      })
     
      gateStatus.value = false

      finalTotal.value = data.data?.data?.finalFee


    }
    if (data) updateFromPayload(data)
  }

  socket.onerror = (error) => {

    wsConnected.value = false
  }

  socket.onclose = () => {
    wsConnected.value = false
  }
}

const closeWebSocket = () => {
  clearGateCountdownTimer()
  clearPaymentSuccessTimer()
  if (socket) {
    socket.close()
    socket = null
  }
}

onMounted(() => {
  RESTART_DELAY_SECONDS.value = payments.RESTART_COUNTDOWN_SECONDS;
  payments.paid = false;
  connectWebSocket()
})

watch(effectiveGateStatus, (isOpen) => {
  if (isOpen && !gateCountdownTimer) {
    startGateCountdown(RESTART_DELAY_SECONDS)
    return
  }

  if (!isOpen) {
    closeGateCountdown()
  }
}, { immediate: true })

// ── Actions ────────────────────────────────────────────────────
function handlePrint() {
  window.print()
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@300;400;600;700&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.terminal-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  font-family: 'Sora', sans-serif;
  background: #f0f2f7;
  overflow: hidden;
}

/* ══ SIDEBAR ══════════════════════════════════════════════════ */
.sidebar {
  width: 450px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #1a2f6e 0%, #0f1f4d 60%, #0a1535 100%);
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  gap: 24px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(99, 140, 255, .15) 0%, transparent 65%);
  pointer-events: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: #3b82f6;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
}

.brand-name {
  display: block;
  color: #e8eeff;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: .02em;
}

.brand-sub {
  display: block;
  color: #6b88cc;
  font-size: 9px;
  letter-spacing: .18em;
  margin-top: 2px;
}

.section-label {
  color: #6285db;
  font-size: 11.5px;
  letter-spacing: .2em;
  font-weight: 600;
}

.slot-card {
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .09);
  border-radius: 14px;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.slot-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.check-icon {
  width: 30px;
  height: 30px;
  border: 1.5px solid rgba(255, 255, 255, .25);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #7baaff;
}

.status-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .15em;
  padding: 4px 10px;
  border-radius: 20px;
}

.badge-green {
  background: rgba(34, 197, 94, .18);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, .3);
}

.badge-yellow {
  background: rgba(234, 179, 8, .18);
  color: #fbbf24;
  border: 1px solid rgba(234, 179, 8, .3);
}

.badge-red {
  background: rgba(239, 68, 68, .18);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, .3);
}

.slot-label {
  color: #6285db;
  font-size: 10.5px;
  letter-spacing: .16em;
  margin-bottom: 8px;
}

.slot-number {
  font-family: 'DM Mono', monospace;
  font-size: 40px;
  font-weight: 500;
  color: #ffffff;
  line-height: 0.8;
}

.usage-card {
  background: rgba(255, 255, 255, .05);
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 14px;
  padding: 16px 18px;
}

.usage-icon {
  color: #6b88cc;
  margin-bottom: 12px;
}

.usage-stats {
  display: flex;
  align-items: center;
}

.usage-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.usage-key {
  color: #6285db;
  font-size: 9.5px;
  letter-spacing: .15em;
}

.usage-val {
  color: #ffffff;
  font-family: 'DM Mono', monospace;
  font-size: 16px;
  font-weight: 500;
}

.divider-v {
  width: 1px;
  background: rgba(255, 255, 255, .1);
  align-self: stretch;
  margin: 0 16px;
}

.capacity-bar {
  height: 3px;
  background: rgba(255, 255, 255, .1);
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;
}

.capacity-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(.4, 0, .2, 1);
}

/* QR card */
.qr-card {
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .09);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(8px);
}

.qr-frame {
  position: relative;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  display: inline-flex;
}

.qr-frame canvas {
  display: block;
  border-radius: 4px;
}

.qr-frame--paid {
  box-shadow: 0 0 0 2px rgba(34, 197, 94, .32), 0 18px 40px rgba(15, 23, 42, .18);
}

.qr-paid-overlay {
  position: absolute;
  inset: 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, .82);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  gap: 6px;
  text-align: center;
  color: #fff;
}

.qr-paid-overlay__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #16a34a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .18em;
}

.qr-paid-overlay__text {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, .92);
}

.qr-paid-overlay-enter-active,
.qr-paid-overlay-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.qr-paid-overlay-enter-from,
.qr-paid-overlay-leave-to {
  opacity: 0;
  transform: scale(.96);
}

/* Gate status card */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-bottom: 10px; */
}

.card-label {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.1em;
}

.status-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.chip-green {
  background: #aaf0d1;
  color: #0b7c1a;
}

.chip-red {
  background: #fecaef;
  color: #be185d;
}

.qr-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 4px;
}

.qr-plate {
  font-family: 'DM Mono', monospace;
  color: #ffffff;
  font-size: 13px;
}

.qr-amount {
  font-family: 'DM Mono', monospace;
  color: #4ade80;
  font-size: 15px;
  font-weight: 500;
}

.qr-hint {
  color: #4a6099;
  font-size: 10.5px;
  text-align: center;
  letter-spacing: .03em;
  margin: 0;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4a6099;
  font-size: 11px;
}

/* ══ MAIN PANEL ═══════════════════════════════════════════════ */
.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f4f6fb;
  overflow-y: auto;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 36px;
  background: #fff;
  border-bottom: 1px solid #e8eaef;
  font-size: 12px;
  color: #6b7280;
  flex-shrink: 0;
}

.terminal-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Mono', monospace;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.dot-green {
  background: #22c55e;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, .5);
}

.dot-red {
  background: #ef4444;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, .5);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, .5);
  }

  70% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

.terminal-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 11.5px;
}

.chip-green {
  color: #0b7c1a;
}

.chip-red {
  color: #be185d;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 42px 45px;
  gap: 24px;
  max-width: 740px;
  margin: 0 auto;
  width: 100%;
}

/* Plate */
.plate-section {
  text-align: center;
}

.plate-label {
  color: #9ca3af;
  font-size: 12px;
  letter-spacing: .15em;
  margin-bottom: 12px;
}

.plate-display {
  border: 3px solid #1a1a2e;
  border-radius: 10px;
  padding: 12px 40px;
  display: inline-block;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .1), inset 0 1px 0 rgba(255, 255, 255, .8);
}

.plate-text {
  font-family: 'DM Mono', monospace;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: .05em;
  color: #0f172a;
}

/* Session card */
.session-card {
  width: 100%;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8eaef;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .04);
}

.session-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.session-item {
  padding: 16px 22px;
  border-right: 1px solid #f1f3f8;
  border-bottom: 1px solid #f1f3f8;
}

.session-item:nth-child(2),
.session-item:nth-child(4) {
  border-right: none;
}

.session-item:nth-child(3),
.session-item:nth-child(4) {
  border-bottom: none;
}

.session-key {
  display: block;
  color: #9ca3af;
  font-size: 12px;
  letter-spacing: .15em;
  margin-bottom: 6px;
}

.session-val {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1e293b;
  font-size: 15px;
  /* font-weight: 500; */
}

.payment-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  border-top: 1px solid #f1f3f8;
}

.discount-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 22px;
  border-top: 1px solid #f1f3f8;
}

.discount-val {
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}

.payment-key {
  color: #6b7280;
  font-size: 13px;
}

.payment-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.badge-ready {
  color: #f97316;
  background: rgba(249, 115, 22, .1);
  border: 1px solid rgba(249, 115, 22, .25);
}

.badge-paid {
  color: #22c55e;
  background: rgba(34, 197, 94, .1);
  border: 1px solid rgba(34, 197, 94, .25);
}

.badge-pending {
  color: #6b7280;
  background: rgba(107, 114, 128, .1);
  border: 1px solid rgba(107, 114, 128, .2);
}

/* Total card */
.total-card {
  width: 100%;
  background: linear-gradient(130deg, #2251cc 0%, #1e40af 100%);
  border-radius: 16px;
  padding: 24px 32px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(37, 99, 235, .35);
}

.total-label {
  color: rgba(255, 255, 255, .65);
  font-size: 10.5px;
  letter-spacing: .2em;
  margin-bottom: 8px;
}

.total-amount {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
}

.currency {
  color: rgba(255, 255, 255, .7);
  font-size: 26px;
  font-weight: 300;
  padding-top: 10px;
}

.amount {
  font-family: 'DM Mono', monospace;
  font-size: 58px;
  font-weight: 500;
  color: #fff;
  line-height: 1;
  letter-spacing: -.01em;
}

/* Print button */
.pay-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 20px;
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s, transform .1s, box-shadow .2s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .2);
  letter-spacing: .01em;
}

.pay-btn:hover {
  background: #1e293b;
  box-shadow: 0 6px 24px rgba(0, 0, 0, .28);
  transform: translateY(-1px);
}

.pay-btn:active {
  transform: translateY(0);
}

/* ══ PRINT STYLES ═════════════════════════════════════════════ */
</style>
