<template>

    <aside class="sidebar">
        <!-- Main Nav -->
        <nav class="nav-main">
            <ul>
                <!-- <li v-for="item in navItems" :key="item.id">
                    <base-button class="nav-item" :class="{ active: activeItem === item.id }" @click="setActive(item.id)">
                        <span class="nav-icon" v-html="item.icon"></span>
                        <span class="nav-label">{{ item.label }}</span>
                        <span v-if="activeItem === item.id" class="nav-indicator"></span>
                    </base-button>
                </li> -->
                <li class="nav-item">
                    <router-link class="nav-link" to="/dashboard" exact-active-class="active"><svg width="18"
                            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>Dashboard</router-link>
                </li>

                <li class="nav-item">
                    <router-link class="nav-link" to="/dashboard/vehicle-types" exact-active-class="active"><svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5" />
                            <circle cx="16" cy="17" r="2" />
                            <circle cx="9" cy="17" r="2" />
                            <path d="M13 17H11M7 17H3" />
                        </svg>Vehicle
                        Types</router-link>
                </li>

                <li class="nav-item">
                    <router-link class="nav-link" to="/dashboard/vip-plates" exact-active-class="active"><svg width="18"
                            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a10 10 0 0 1 0 20M12 2a10 10 0 0 0 0 20" />
                            <path d="M2 12h20" />
                        </svg>VIP
                        Plates</router-link>
                </li>

                <li class="nav-item">
                    <router-link class="nav-link" to="/dashboard/price-rules" exact-active-class="active"><svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>Price
                        Rules</router-link>
                </li>

                <li class="nav-item">
                    <router-link class="nav-link" to="/dashboard/system-logs" exact-active-class="active"><svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="3" width="20" height="18" rx="2" />
                            <path d="M6 8h12M6 12h8M6 16h5" />
                        </svg>System
                        Logs</router-link>
                </li>
            </ul>
        </nav>

        <!-- Footer Nav -->
        <div class="nav-footer">
            <div class="divider"></div>
            <ul>
                <!-- <li v-for="item in footerItems" :key="item.id">
                    <base-button class="nav-item" :class="{ active: activeItem === item.id }" @click="setActive(item.id)">
                        <span class="nav-icon" v-html="item.icon"></span>
                        <span class="nav-label">{{ item.label }}</span>
                    </base-button>
                </li> -->
                
                <li class="nav-item">
                    <button class="nav-link" @click="logoutModal = true"><svg width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>Logout</button>
                </li>
            </ul>
        </div>
    </aside>

    <!--Delete Vehicle Type Modal -->

    <BaseModal v-if="logoutModal" title="Confirm Logout" @close="logoutModal = false">
        <p>Are you sure you want to logout?</p>
        <template #footer>
            <BaseButton @click="logoutModal = false" variant="secondary">Cancel</BaseButton>
            <BaseButton @click="comfirmLogout" variant="dangerous" class="ms-2" :loading="isLoading">
                Logout
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

</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { useAuthStore } from '@/stores/auth';
import  {useRouter} from 'vue-router';


const router = useRouter();
const authStore = useAuthStore();
const logoutModal = ref(false);
const isLoading = ref(false);
const showSuccess = ref(false);
const msg = ref('')

const comfirmLogout = async () => {
    isLoading.value = true;
    try {
        showSuccess.value = true;
        const res = await authStore.logout();
        msg.value = res.msg;
        router.push('/login');
    }
    catch (e) {
        console.log(e);

    }
    finally{
        setTimeout(() =>{
            showSuccess.value = false;
            logoutModal.value = false;
        },1500)
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.app-shell {
    display: flex;
    height: calc(100vh - 56px);
    background: #192952;
    font-family: 'DM Sans', sans-serif;
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar {
    height: calc(100vh - 56px);
    width: 240px;
    min-width: 240px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e8eaf0;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.04);
    padding: 10px 0;
    position: relative;
    z-index: 100;
}




/* Nav */
nav ul,
.nav-footer ul {
    list-style: none;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.nav-link {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    transition: background 0.15s ease, color 0.15s ease;
    text-align: left;
    color: #5a6178;
}

.nav-link:hover {
    background: #f4f6fb;
    color: #1a1f36;
}

.nav-link.active {
    background: #eef1fd;
    color: #3b5bdb;
}

.nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    opacity: 0.85;
}

.nav-link.active .nav-icon {
    opacity: 1;
}

.nav-label {
    font-size: 13.5px;
    font-weight: 500;
    letter-spacing: -0.005em;
}

.nav-indicator {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 18px;
    background: #3b5bdb;
    border-radius: 2px 0 0 2px;
}

/* Footer */
.nav-footer {
    margin-top: auto;
}

.divider {
    height: 1px;
    background: #e8eaf0;
    margin: 0 20px 16px;
}

/* Content area */
.content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c92a4;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
}

.content-placeholder {
    padding: 20px 28px;
    border: 1px dashed #c8cedf;
    border-radius: 10px;
    color: #adb5c7;
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
    z-index: 10;
}

.toast-success svg {
    color: #10b981;
}
</style>