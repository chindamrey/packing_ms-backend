<template>

  <div class="screen">
    <div class="card">
      <div></div>
      <div class="plate">
        <p class="plate__label">Plate number</p>
        <p class="plate__number">{{ carInfo.plate }}</p>

      </div>

      <!-- Meta Grid -->
      <div class="meta">
        <div class="meta__row">
          <p class="meta__key">Entry Time</p>
          <p class="meta__val">{{ carInfo.entryTime }}</p>
        </div>
        <div class="meta__row">
          <p class="meta__key">Exit Time</p>
          <p class="meta__val">{{ carInfo.exitTime }}</p>
        </div>
        <div class="meta__row">
          <p class="meta__key">Vehicle Type</p>
          <p class="meta__val">{{ carInfo.vehicle }}</p>
        </div>
        <div class="meta__row">
          <p class="meta__key">Duration</p>
          <p class="meta__val">{{ carInfo.duration }}</p>
        </div>
        <div class="meta__row">
          <p class="meta__key">Status</p>
          <p class="meta__val">{{ carInfo.status }}</p>
        </div>
        <div class="meta__row">
          <p class="meta__key">Discount($)</p>
          <p class="meta__val">{{ carInfo.discount }}</p>
        </div>
      </div>

      <!-- Payment Box -->
      <div class="payment">
        <p class="payment__label">Total Payment</p>
        <div class="payment__amount">
          <span class="sym">$</span>{{ carInfo.amount }}
        </div>
      </div>
      <button class="btn" @click="print">Print Receipt</button>
    </div>

    <!-- Confirmation Overlay -->
    <Transition name="fade">
      <div v-if="false" class="overlay" @click="isDone = false">
        <div class="confirm-card" @click.stop>
          <div class="confirm-icon">
            <IconCheckLg />
          </div>
          <h2>Session Finalized</h2>
          <p>
            Your parking session for <strong>{{ carInfo.plate }}</strong> has been completed successfully.
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { formatDateTime } from '../../utils/dateFormater.js'

const SOCKET_URL = 'ws://localhost:8765'

let socket = null

const parseSocketData = (rawData) => {
  if (typeof rawData !== 'string') return rawData

  try {
    return JSON.parse(rawData)
  } catch (error) {
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

  const hours = duration.hours ?? 0
  const minutes = duration.minutes ?? 0
  const seconds = duration.seconds ?? 0

  return `${hours}h ${minutes}m ${seconds}s`
}

const updateCarInfo = (payload) => {
  if (!payload) return

  const sessionData = payload.data?.data ?? payload.data ?? payload
  const entryInfo = sessionData.entry_info ?? sessionData.entryInfo ?? {}
  const duration = sessionData.duration ?? payload.duration

  carInfo.plate = payload.plate ?? entryInfo.plate_number ?? entryInfo.plateNumber ?? carInfo.plate
  carInfo.entryTime = safeDateTime(entryInfo.entry_time ?? entryInfo.entryTime)
  carInfo.exitTime = safeDateTime(entryInfo.exit_time ?? entryInfo.exitTime)
  carInfo.vehicle = entryInfo.vehicle_type ?? entryInfo.vehicleType ?? '--'
  carInfo.duration = formatDuration(duration)
  carInfo.amount = sessionData.finalFee ?? sessionData.totalFee ?? '0.00'
  carInfo.status = entryInfo.status ?? payload.status ?? '--'
  carInfo.discount = sessionData.discount ?? sessionData.discount_amount ?? 0
}

const connectWebSocket = () => {
  socket = new WebSocket(SOCKET_URL)

  socket.onopen = () => {
    console.log('Connected to exit summary websocket')
  }

  socket.onmessage = (event) => {
    console.log('Raw exit summary websocket data:', event.data)
    const data = parseSocketData(event.data)
    console.log('Received from server:', data)
    updateCarInfo(data)
  }

  socket.onerror = (error) => {
    console.error('Exit summary websocket error:', error)
  }
}

const closeWebSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}

// ── Sub-components (inline renderless icons) ──────────────────────────────────
const IconBolt = {
  template: `
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.3"
         stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  `
}

const IconCheck = {
  template: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="9 12 11.5 14.5 15.5 9.5"/>
    </svg>
  `
}

const IconCheckLg = {
  template: `
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
         stroke="#15a349" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `
}
const print = () => {
  window.print()
}
// ── State ─────────────────────────────────────────────────────────────────────
const isDone = ref(false)

// ── Trip data ─────────────────────────────────────────────────────────────────
const carInfo = reactive({
  plate: '--',
  entryTime: '--',
  exitTime: '--',
  vehicle: '--',
  duration: '--',
  amount: '0.00',
  status: '--',
  discount: 0
})

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  closeWebSocket()
})

// ── Actions ───────────────────────────────────────────────────────────────────
function finalize() {
  isDone.value = true
}
</script>

<style scoped>
/* ── Google Fonts (add to index.html or App.vue if not present) ──────────────
   @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;500;700&family=Syne:wght@700;800&display=swap');
────────────────────────────────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ── Reset ─────────────────────────────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Tokens ─────────────────────────────────────────────────────────────────── */
.screen {
  --bg: #f0f2f7;
  --surface: #FFFFFF;
  --plate-bg: #2664eb;
  --label: #8A94A6;
  --body: #1a2340;
  --accent: #2664eb;
  --accent-lt: #e8eefa;
  --green: #15a349;
  --green-lt: #e4f5ec;
  --radius: 20px;
  --shadow: 0 8px 40px rgba(38, 100, 235, .12), 0 2px 8px rgba(0, 0, 0, .06);

  font-family: 'Inter', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

/* ── Card ───────────────────────────────────────────────────────────────────── */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: 0 8px 40px rgba(38, 100, 235, .10), 0 2px 8px rgba(0, 0, 0, .05);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  animation: rise .55s cubic-bezier(.22, .68, 0, 1.3) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px) scale(.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ── Plate header ───────────────────────────────────────────────────────────── */
.plate {
  background: #2664eb;
  padding: 1.6rem 2rem 1.9rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}



.plate__label {
  font-family: 'Inter', sans-serif;
  font-size: .62rem;

  color: rgba(255, 255, 255, .65);
  text-transform: uppercase;
  margin-bottom: .55rem;
}

.plate__number {
  /* font-family: 'Syne', sans-serif; */
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  /* letter-spacing: .04em; */
  line-height: 1;
}

/* ── Meta grid ──────────────────────────────────────────────────────────────── */
.meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1.7rem 1.8rem 1rem;
  gap: 0;
}

.meta__row {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.2rem;
}

.meta__cell {
  padding-bottom: 1.15rem;
}

.meta__cell:nth-child(odd) {
  padding-right: .5rem;
}

.meta__key {
  font-family: 'Inter', sans-serif;
  font-size: .8rem;
  letter-spacing: .10em;
  color: var(--label);
  /* text-transform: uppercase; */
  margin-bottom: .28rem;
}

.meta__val {
  font-size: .94rem;
  font-weight: 500;
  color: var(--body);
}

/* ── Payment box ────────────────────────────────────────────────────────────── */
.payment {
  margin: 0 1.4rem 1.4rem;
  background: var(--accent-lt);
  border-radius: 14px;
  padding: 1.4rem 1.6rem 1.25rem;
  text-align: center;
}

.payment__label {
  font-family: 'DM Mono', monospace;
  font-size: .62rem;
  letter-spacing: .18em;
  color: var(--label);
  text-transform: uppercase;
  margin-bottom: .65rem;
}

.payment__amount {
  /* font-family: 'Syne', sans-serif; */
  font-size: 3.1rem;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  margin-bottom: .9rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1px;
}

.payment__amount .sym {
  font-size: 1.6rem;
  font-weight: 700;
  align-self: flex-start;
  margin-top: .38rem;
}

/* ── Badge ──────────────────────────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  background: var(--green-lt);
  color: var(--green);
  border: 1px solid rgba(21, 163, 73, .25);
  border-radius: 99px;
  padding: .28rem .9rem;
  font-family: 'DM Mono', monospace;
  font-size: .6rem;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 1.8s ease infinite;
}

.plate__status-chip {
  display: inline-flex;
  align-items: center;
  gap: .42rem;
  border-radius: 99px;
  padding: .3rem 1rem;
  font-family: 'DM Mono', monospace;
  font-size: .62rem;
  font-weight: 500;
  letter-spacing: .1em;
  text-transform: uppercase;
  transition: background .35s, color .35s, border-color .35s;
}

.chip--in {
  background: rgba(21, 163, 73, .5);
  color: #7dfab4;
  border: 1px solid rgba(125, 250, 180, .3);
}

.chip--out {
  background: rgba(255, 0, 0, .5);
  color: rgba(255, 255, 255, .9);
  border: 1px solid rgba(255, 255, 255, .28);
}

.chip__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.8s ease infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: .4;
    transform: scale(.7);
  }
}

/* ── Brand ──────────────────────────────────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  padding: .85rem 1.4rem 1.2rem;
  color: var(--accent);
  font-weight: 500;
  font-size: .9rem;
}

/* ── Done button ────────────────────────────────────────────────────────────── */
.done-wrap {
  padding: 0 1.5rem 1.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .75rem;
}

.btn-done {
  width: 100%;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 99px;
  padding: .95rem 2rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: .02em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .6rem;
  transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
}

.btn-done:hover {
  background: #1a4fc4;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(38, 100, 235, .35);
}

.btn-done:active {
  transform: translateY(0) scale(.98);
}

.hint {
  font-size: .78rem;
  color: var(--label);
}

/* ── Overlay ────────────────────────────────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 16, .65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.confirm-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  max-width: 300px;
  animation: rise .45s cubic-bezier(.22, .68, 0, 1.3) both;
}

.confirm-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--green-lt);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.1rem;
}

.confirm-card h2 {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--body);
  margin-bottom: .4rem;
}

.confirm-card p {
  font-size: .88rem;
  color: var(--label);
  line-height: 1.55;
}

/* ── Transition ─────────────────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media print {
  @page {
    /* Sets the width to standard 3 1/8 inches (80mm) */
    /* 'auto' allows the receipt length to grow dynamically based on content */
    size: 80mm auto;
    margin: 0;
    /* Removes default browser header/footer margins */
  }

  /* Hide everything on the page */
  .screen, .btn {
    visibility: hidden;
  }
.btn{
  display: none;
}
  /* Show only .card and its children */
  .card,
  .card * {
    visibility: visible;
  }

  /* Position .card to fill the print page */

  .card {
    position: fixed;
    top: 0;
    left: 0;
    width: 80mm;
    margin: 0;
    padding: 0;
    box-shadow: none;
    border: none;
    border-radius: 0;
    font-family: 'Courier New', monospace;
    font-size: 13px;
  }



  .overlay {
    display: none !important;
  }
}
</style>
