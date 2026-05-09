<template>
  <transition name="modal">
    <div class="modal-overlay" @click.self="close">
      <div class="modal1">
        <div class="modal-header">
          <h3>{{ title}}</h3>
          <button class="modal-close" @click="close">×</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  size: { type: String, default: "" },
});

const emit = defineEmits(["close"]);

const close = () => emit("close");

const sizeClass = computed(() => (props.size ? `modal-${props.size}` : ""));
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,17,23,0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal1 {
  background: #ffffff;
  border-radius: 18px;
  width: 440px;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
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
  width: 40px; height: 35px;
  background: #e6ecf7d2;
  border: none;
  border-radius: 7px;
  font-size: 28px;
  cursor: pointer;
  color: #788297;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.modal-close:hover { background: #e5e7eb; }
.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.modal-footer{
  background: #f8fafc;
  padding : 15px 20px
}
</style>
