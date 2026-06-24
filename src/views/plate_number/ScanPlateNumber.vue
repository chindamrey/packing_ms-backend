<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="logo">

          <span class="logo-text">Parking System</span>
        </div>
        <div class="divider-v"></div>

      </div>

      <div class="header-center">
        <div class="capacity-badge">
          <span class="capacity-label">CAPACITY</span>
          <div class="capacity-nums">
            <span class="capacity-current">{{ currentCar }}</span>
            <span class="capacity-sep">/</span>
            <span class="capacity-max">{{ capacity.max }}</span>
          </div>
          <div class="capacity-status" :class="{ available: isAvailableSlot }">
            <span class="status-dot"></span>
            {{ isAvailableSlot ? 'AVAILABLE' : 'FULL' }}
          </div>
        </div>
      </div>
      <base-button v-if="isRunning" label="" variant="danger" class="py-2" @click="emergencyStop"
        :disabled="!isRunning">Emergency Stop</base-button>
      <base-button v-else label="" variant="primary" class="py-2" @click="startEntry"
        :disabled="isRunning">Start</base-button>
    </header>

    <!-- Main content -->
    <main class="main">
      <!-- Left: Camera Feed -->
      <section class="camera-section">
        <div class="camera-feed">
          <div class="feed-overlay">
            <div class="feed-badges">
              <span :class="isRunning ? 'badge-live' : 'badge-stop'">
                <span class="live-dot"></span>
                <span v-if="isRunning">Living</span>
                <span v-else>Stoped</span>
              </span>

            </div>

            <!-- Simulated camera image -->
            <div class="camera-bg">
              <video v-if="isEntry" ref="video" autoplay width="840"></video>
              <div v-else class="car-silhouette">
                <div class="plate-detection">
                  <div class="detection-box">
                    <span class="plate-text">{{ exitInfo.plateNumber }}</span>
                    <span class="plate-text d-none">Welcome</span>
                  </div>
                  <div class="corner tl"></div>
                  <div class="corner tr"></div>
                  <div class="corner bl"></div>
                  <div class="corner br"></div>
                </div>
              </div>
            </div>

            <div class="feed-footer">
              <span class="gps-coords">40.7128° N, 74.0060° W</span>
              <span class="timestamp">2023-11-24 14:45:12</span>
              <div class="feed-icons">
                <span class="feed-icon">📹</span>
                <span class="feed-icon">📡</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Entry/Exit buttons -->
        <div class="gate-controls d-none">
          <base-button label="Entry" variant="primary" :loading="isRunning && mode === 'entry'" @click="startEntry"
            :disabled="isRunning" />
          <base-button label="Exit" variant="danger" :loading="isRunning && mode === 'exit'" @click="startExit"
            :disabled="isRunning" />
        </div>
      </section>

      <!-- Right: Info Panel -->
      <aside class="info-panel">
        <!-- Gate Status -->
        <div class="panel-card gate-status-card">
          <div class="card-header">
            <span class="card-label">GATE STATUS</span>
            <span class="status-chip" :class="gateInfo ? 'chip-green' : 'chip-red'">
              <span class="chip-dot"></span>

              {{ gateInfo ? 'OPEN' : 'CLOSED' }}

            </span>
          </div>
          <h2 class="gate-status-title">{{ exitInfo.message }}</h2>
          <p class="gate-status-sub" v-if="isCounting">Gate will close in {{ countdown }}s</p>
         
        </div>

        <!-- Session Summary -->
        <div class="panel-card session-card" ref="receiptRef">
          <div class="card-label">SESSION SUMMARY</div>
          <div class="session-rows">
            <div class="session-row">
              <span class="field-label">Plate Number</span>
              <div class="session-field">
                <span class="field-value bold">{{ exitInfo.plateNumber }}</span>
              </div>
            </div>
            <div class="session-row">
              <span class="field-label">Status</span>
              <div class="session-field">
                <span class="field-value bold">{{ exitInfo.status }}</span>
              </div>
            </div>
            <div class="session-row">
              <span class="field-label">Vehicle Type</span>
              <div class="session-field">
                <span class="field-value bold">{{ exitInfo.vehicleType }}</span>
              </div>
            </div>
            <div class="session-divider"></div>
            <div class="session-row">
              <span class="field-label">Entry Time</span>
              <div class="session-field session-field">
                <span class="field-value">{{ exitInfo.entryTime }}</span>
              </div>

            </div>
            <div v-if="exitInfo.totalFee !== 'null'">
              <div class="session-row">
                <span class="field-label">Exit Time</span>
                <div class="session-field session-field">
                  <span class="field-value">{{ exitInfo.exitTime }}</span>
                </div>
              </div>
              <div class="session-row">
                <span class="field-label">Duration</span>
                <div class="session-field session-field">
                  <span class="field-value">{{ exitInfo.duration }}</span>
                </div>
              </div>
              <div class="session-row">
                <span class="field-label">Billable Hours</span>
                <div class="session-field session-field">
                  <span class="field-value">{{ exitInfo.billableHours }}</span>
                </div>
              </div>

              <div class="session-divider"></div>
              <div class="session-row">
                <div class="session-field">
                  <span class="field-label">Total Fee</span>
                </div>
                <div class="session-field align-right">
                  <span class="field-value fee">{{ exitInfo.totalFee }}</span>
                </div>
              </div>
            </div>
          </div>
          <base-button class="w-100" label="Print Receipt" variant="primary" @click="printReceipt">Print
            Receipt</base-button>
        </div>


      </aside>
    </main>



  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import api from "../../api/api.js";
import BaseButton from '../../components/base/BaseButton.vue';
import BaseModal from '../../components/base/BaseModal.vue';
import { formatDateTime } from '../../utils/dateFormater.js';
import { usePaymentStore } from '../../stores/payment.js'
import { storeToRefs } from 'pinia'



const paymentsStore = usePaymentStore();
const video = ref(null);
const plate = ref("");
const message = ref("");
const result = ref(null);

let socket = null;
let stream = null;
let interval = null;
let mode = "entry";
let canvas = ref(null);
let isEntry = ref(false);
const isRunning = ref(false);
let currentCar = ref(null);
let isAvailableSlot = ref(true);
let gateStatus = ref(false);
const receiptRef = ref(null);
let isPaid = ref(null)

const RESTART_COUNTDOWN_SECONDS = ref(30)
// const EXIT_COUNTDOWN_SECONDS = 20
let countdownDuration = ref(RESTART_COUNTDOWN_SECONDS.value);
let paymentConfirmed = ref(false)
const countdown = ref(30)
const isCounting = ref(false)
let timer = null
let restartTimer = null

// Capacity state
let capacity = reactive({
  current: 142,
  max: null,
  available: true,
})
let gateInfo = ref(false)
// Active session state

const exitInfo = reactive({
  plateNumber: 'null',
  status: '--',
  vehicleType: '--',
  message: '--',
  entryTime: '--',
  exitTime: '--',
  duration: '--',
  billableHours: '--',
  totalFee: 'null',
})

// ✅ storeToRefs preserves reactivity when destructuring
const { md5, paid } = storeToRefs(paymentsStore)  // ✅ reactive refs

// Fires every time parkingTerminal generates a new QR
watch(md5, (newMd5) => {
  console.log('md5 changed:', newMd5)  // you should see this now
  if (!newMd5) return

  // start verifying with the fresh md5
  // startVerifying(newMd5)
})
const clearFrame = () => {
  canvas.value = null;
  plate.value = "";
  message.value = "";
  result.value = null;
  exitInfo.plateNumber = '--';
}

onMounted(async () => {
  // ENTRY_COUNTDOWN_SECONDS.value = usePayments.RESTART_COUNTDOWN_SECONDS;

  startEntry();
  getCarCapacity();
});

onUnmounted(() => {
  clearRestartTimer();
  clearCountdownTimer();
  stopCamera();
});

// ==============get car capacity======================
const getCarCapacity = async () => {
  try {
    const res = await api.get('/plates/all-entry');
    const data = res.data.data;
    // console.log("Car capacity:", data);
    currentCar.value = data.total;
    capacity.max = data.slot_limit.total_slot;

    isAvailableSlot.value = currentCar.value < capacity.max;
  } catch (error) {
    console.error(error);
  }
};

//=============emergency stop camera======================
const emergencyStop = () => {
  clearRestartTimer();
  clearCountdownTimer();
  stopCamera();
  isEntry.value = false;
}

// ================= ENTRY =====================
const startEntry = async () => {
  clearRestartTimer();
  clearCountdownTimer();
  clearFrame();
  mode = "entry";
  gateInfo.value = false
  countdown.value
  // isRunning.value = true;
  isEntry.value = true;
  exitInfo.totalFee = 'null';
  exitInfo.billableHours = '--';
  exitInfo.vehicleType = '--';
  exitInfo.duration = '--';
  exitInfo.totalFee = 'null'
  exitInfo.exitTime = '--';
  exitInfo.entryTime = '--';
  exitInfo.status = '--';
  exitInfo.message = '--';
  await startCamera();
  await getCarCapacity();
};

// ===== EXIT =====
// const startExit = async () => {
//   clearRestartTimer();
//   clearCountdownTimer();
//   clearFrame();
//   mode = "exit";
//   paymentConfirmed.value = false
//   countdownDuration = EXIT_COUNTDOWN_SECONDS
//   isEntry.value = true;

//   await startCamera();
//   await getCarCapacity();
// };


// ===== START CAMERA =====
const startCamera = async () => {
  if (isRunning.value) return;

  isRunning.value = true;

  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(d => d.kind === 'videoinput')
  // console.log('a device video : ', devices);

  const selectedDeviceId = videoDevices[1].deviceId
  // console.log('available device  : ', videoDevices) // see all cameras + their deviceIds
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: { exact: selectedDeviceId }
    }
  });
  // console.log('stream ', stream);

  video.value.srcObject = stream;

  socket = new WebSocket("ws://localhost:8765");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Raw exit summary websocket data:', data);
    gateInfo.value = data.gate_status === 'open';
    if (data.data?.data?.entry_info?.status === 'OUT') {
      countdown.value =1000;
      gateInfo.value = false;
      const intervalIsPaid = setInterval(() => {
        console.log(' waiting... it paid right : ', paymentsStore.isPaid);
        paymentsStore.paymentIsPaid({ plate_number: data.data?.data?.entry_info?.plate_number, exit_time: data.data?.data?.entry_info?.exit_time });
        if (paymentsStore.isPaid === true) {
          gateInfo.value= true;
          paymentsStore.isPaid = false;
          countdown.value = 15;
          clearInterval(intervalIsPaid);
        }
       
      
      }, 1000)
    }
    if (data.data?.data?.entry_info?.status === 'IN') {
      countdown.value = 30;

    }

    if (data.data?.result == false) {
      exitInfo.message = data.data?.msg || 'No plate detected';
      exitInfo.plateNumber = data?.plate || '--';
      return;
    }

    if (data.plate) {
      clearInterval(interval);
      scheduleScanRestart();
      getCarCapacity();

      exitInfo.plateNumber = data?.plate;
      exitInfo.message = data.gate_message || data.data?.msg;
      exitInfo.entryTime = formatDateTime(data.data.data.entry_info?.entry_time);
      exitInfo.status = data.data.data?.entry_info?.status;
      exitInfo.vehicleType = data.data.data?.entry_info?.vehicle_type || '--';
      exitInfo.exitTime = formatDateTime(data.data.data.entry_info?.exit_time);
      exitInfo.duration = data.data.data?.duration?.hours + "h " + data.data.data?.duration?.minutes + "m " + data.data.data?.duration?.seconds + "s";
      exitInfo.billableHours = data.data.data?.billableHours;
      exitInfo.totalFee = data.data.data?.finalFee || 'null';
    }
  };
  interval = setInterval(sendFrame, 600);
};


// ===== STOP CAMERA =====
const stopCamera = () => {
  isRunning.value = false;
  isEntry.value = false;

  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  if (socket) {
    socket.close();
    socket = null;
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  if (video.value) {
    video.value.srcObject = null;
  }

};

const clearCountdownTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isCounting.value = false;
}

const clearRestartTimer = () => {
  if (restartTimer) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }
}

const scheduleScanRestart = () => {

  stopCamera();
  startCountdown();
  clearRestartTimer();
  restartTimer = setTimeout(() => {


    restartTimer = null;
    gateInfo.value = false;
    clearFrame();
    if (mode === "exit") {
      startExit();
      return;
    }
    startEntry();
  }, countdown.value * 1000);
}


// ===== SEND FRAME =====
const sendFrame = () => {
  if (!socket || socket.readyState !== 1) return;

  canvas.value = document.createElement("canvas");
  const ctx = canvas.value.getContext("2d");

  canvas.value.width = 840;
  canvas.value.height = 680;

  ctx.drawImage(video.value, 0, 0, 840, 680);

  socket.send(JSON.stringify({
    mode,
    image: canvas.value.toDataURL("image/jpeg", 0.8)
  }));
};

const printReceipt = () => {
  const printContent = receiptRef.value.innerHTML

  const win = window.open('', '', 'width=800,height=600')

  win.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }
          .session-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .session-divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .bold {
            font-weight: bold;
          }
          .fee {
            font-size: 18px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `)

  win.document.close()
  win.print()
}

const startCountdown = () => {
  clearCountdownTimer()
  isCounting.value = true

  timer = setInterval(() => {
    countdown.value--
    // console.log('is paid', usePayments.paid);
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCounting.value = false

      startEntry();
      // action after 15s
      gateInfo.value = false
      // or window.print()
    }
  }, 1000)
}

// Confirm payment for exit mode - call this when payment is completed
</script>
<!-- test auto scan  -->


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app {
  font-family: 'DM Sans', sans-serif;
  background: #f4f5f7;
  min-height: 100vh;
  color: #111827;
  display: flex;
  flex-direction: column;
}

/* ── HEADER ── */
.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 34px;
  height: 34px;
  background: #1e3a5f;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.divider-v {
  width: 1px;
  height: 28px;
  background: #e5e7eb;
}

.access-info {
  display: flex;
  flex-direction: column;
}

.access-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.access-sub {
  font-size: 11px;
  color: #9ca3af;
}

.capacity-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 14px;
}

.capacity-label {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.08em;
}

.capacity-nums {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.capacity-current {
  font-size: 18px;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
}

.capacity-sep {
  font-size: 14px;
  color: #9ca3af;
}

.capacity-max {
  font-size: 14px;
  color: #9ca3af;
  font-family: 'IBM Plex Mono', monospace;
}

.capacity-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: red;
}

.capacity-status.available {
  color: #059669;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: red;

}

.capacity-status.available .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 2px #d1fae5;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-emergency {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1.5px solid #ef4444;
  color: #ef4444;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-emergency:hover {
  background: #fef2f2;
}

.emergency-dot {
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
}

.btn-help {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid #e5e7eb;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
}

/* ── MAIN ── */
.main {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  padding: 20px 24px;
  flex: 1;
}

/* ── CAMERA ── */
.camera-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.camera-feed {
  border-radius: 14px;
  overflow: hidden;
  background: #0f172a;
  position: relative;
  min-height: 600px;
}

.feed-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.feed-badges {
  display: flex;
  gap: 8px;
}

.badge-live {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #00a63e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  letter-spacing: 0.05em;
}

.badge-stop {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  letter-spacing: 0.05em;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1
  }

  50% {
    opacity: 0.3
  }
}

.badge-gate {
  background: rgba(0, 0, 0, 0.5);
  color: #e5e7eb;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
}

/* Fake camera background */
.camera-bg {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0f1f2e 100%);
  margin: 0 -16px;
  position: relative;
  overflow: hidden;
}

.camera-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, transparent, transparent 80px,
      rgba(255, 255, 255, 0.02) 80px, rgba(255, 255, 255, 0.02) 81px),
    repeating-linear-gradient(0deg, transparent, transparent 60px,
      rgba(255, 255, 255, 0.02) 60px, rgba(255, 255, 255, 0.02) 61px);
}

.car-silhouette {
  width: 340px;
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plate-detection {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detection-box {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  padding: 8px 20px;
  position: relative;
}

.plate-text {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.12em;
}

.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: #3b82f6;
  border-style: solid;
}

.corner.tl {
  top: -24px;
  left: -24px;
  border-width: 2px 0 0 2px;
}

.corner.tr {
  top: -24px;
  right: -24px;
  border-width: 2px 2px 0 0;
}

.corner.bl {
  bottom: -24px;
  left: -24px;
  border-width: 0 0 2px 2px;
}

.corner.br {
  bottom: -24px;
  right: -24px;
  border-width: 0 2px 2px 0;
}

.feed-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.feed-icons {
  margin-left: auto;
  display: flex;
  gap: 8px;
  font-size: 14px;
}

/* ── GATE CONTROLS ── */
.gate-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}


/* ── INFO PANEL ── */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  border: 1px solid #e5e7eb;
}

/* Gate status card */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.card-label {
  font-size: 10px;
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

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.gate-status-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.gate-status-sub {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
}

/* Session card */
.session-card .card-label {
  margin-bottom: 16px;
  display: block;
}

.session-rows {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.session-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.session-divider {
  height: 1px;
  background: #f3f4f6;
}

.session-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-field.align-right {
  align-items: flex-end;
}

.field-label {
  font-size: 11px;
  color: #9ca3af;
}

.field-value {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.field-value.bold {
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 15px;
}

.field-value.fee {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

/* Assist card */
.assist-card {
  background: #1e3a5f;
  border-color: #1e3a5f;
}

.assist-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.assist-sub {
  font-size: 13px;
  color: #93c5fd;
  margin-bottom: 14px;
}

/* ── RECENT SESSIONS ── */
.recent-sessions {
  margin: 0 24px 24px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  padding: 20px 24px;
}

.section-title {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.sessions-table {
  width: 100%;
  border-collapse: collapse;
}

.sessions-table th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.08em;
  padding: 0 0 10px;
  border-bottom: 1px solid #f3f4f6;
}

.sessions-table td {
  padding: 16px 0;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
}

.plate-cell {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  color: #111827;
}

.status-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 20px;
}

.status-tag.completed {
  background: #d1fae5;
  color: #059669;
}

/* ── FOOTER ── */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #9ca3af;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #6b7280;
  text-decoration: none;
}

.footer-links a:hover {
  color: #1e3a5f;
}
</style>
