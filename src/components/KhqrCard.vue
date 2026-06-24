<template>
  <div class="khqr-card">
    <!-- Header -->
    <div class="khqr-header">
      <div class="khqr-logo-text">
        <img class="khqr-logo" src="/khqr.png" alt="KHQR" />
      </div>
    </div>

    <!-- Body -->
    <div class="khqr-body">
      <!-- Merchant slot -->
      <div class="merchant-info">
        <slot name="merchant">
          <!-- <p class="merchant-label">បាន សុរចេទ</p> -->
          <div class="amount-row">
            <span class="amount"><slot></slot></span>
            <span class="currency">USD</span>
          </div>
        </slot>
      </div>

      <!-- Dashed divider with notches -->
      <div class="notch-divider">
        <div class="notch notch-left"></div>
        <div class="dash-line"></div>
        <div class="notch notch-right"></div>
      </div>

      <!-- QR Code slot -->
      <div class="qr-area">
        <slot name="qr">
          <div v-if="resolvedQrImageSrc" class="qr-placeholder">
            <img class="qr-image" :src="resolvedQrImageSrc" alt="Payment QR Code" />
            <img class="qr-center-icon" src="/iconBakong.png" alt="Bakong" />
          </div>
          <!-- Default placeholder QR grid -->
          <div v-else class="qr-placeholder">
            <canvas ref="qrCanvas" width="230" height="230"></canvas>
            <img class="qr-center-icon" src="/iconBakong.png" alt="Bakong" />
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  qrValue: {
    type: String,
    default: '',
  },
  qrImageSrc: {
    type: String,
    default: '',
  },
})

const qrCanvas = ref(null)

const resolvedQrImageSrc = computed(() => {
  const value = props.qrImageSrc.trim()
  if (!value) return ''

  if (value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `data:image/png;base64,${value}`
})

async function renderQR() {
  if (!qrCanvas.value) return
  if (resolvedQrImageSrc.value) return

  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!props.qrValue) {
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return
  }

  await QRCode.toCanvas(canvas, props.qrValue, {
    width: 230,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  })
}

onMounted(async () => {
  await nextTick()
  renderQR()
})

watch(() => props.qrValue, async () => {
  await nextTick()
  renderQR()
})

watch(() => props.qrImageSrc, async () => {
  await nextTick()
  renderQR()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

.khqr-card {
  width: 300px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,.05), 0 10px 30px rgba(0,0,0,.12);
  font-family: 'IBM Plex Sans', 'Noto Sans Khmer', sans-serif;
}

/* ── Header ── */
.khqr-header {
  background: #C8102E;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.khqr-logo-text {
  display: flex;
  align-items: center;
  gap: 0;
}

.khqr-logo {
  display: block;
  height: 70px;
  width: auto;
  object-fit: contain;

}

/* ── Body ── */
.khqr-body {
  padding: 18px 20px 20px;
}

/* ── Merchant Info (slot) ── */
.merchant-info {
  margin-bottom: 16px;
}

/* Default slot styles (consumer can override via slot) */
.merchant-label {
  font-family: 'Noto Sans Khmer', sans-serif;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.amount-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.amount {
  font-size: 26px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.5px;
  line-height: 1;
}

.currency {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

/* ── Notch Divider ── */
.notch-divider {
  display: flex;
  align-items: center;
  margin: 0 -20px 16px;
}

.notch {
  width: 18px;
  height: 18px;
  background: #f3f4f6;
  border-radius: 50%;
  flex-shrink: 0;
}

.notch-left  { margin-left: -9px; }
.notch-right { margin-right: -9px; }

.dash-line {
  flex: 1;
  border-top: 1.5px dashed #d1d5db;
}

/* ── QR Area ── */
.qr-area {
  display: flex;
  justify-content: center;
}

.qr-placeholder canvas {
  display: block;
  border-radius: 8px;
}

.qr-placeholder {
  position: relative;
  display: inline-block;
}

.qr-image {
  display: block;
  width: 230px;
  height: 230px;
  object-fit: contain;
  border-radius: 8px;
}

.qr-center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 45px;
  height: 45px;
  transform: translate(-50%, -50%);
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
  padding: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}
</style>
