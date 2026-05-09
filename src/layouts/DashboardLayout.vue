<template>
    <div class="admin-layout">

        <NavBar />
        <div class="d-flex">

            <SideBar />

            <!-- Main Content -->
            <main class="content">

                <router-view></router-view>
            </main>
        </div>
    </div>
</template>
<script setup>

import SideBar from '../components/layout/SideBar.vue';
import NavBar from '../components/layout/NavBar.vue';
</script>
<style scoped>
.content {
    width:100%;
    background: #f0f2f7;
    /* margin-left: 250px; */
    overflow-y: scroll;
    /* padding: 1.5rem; */
    transition: margin-left 0.3s ease;
    height: calc(100vh - 56px);
}

.admin-layout {
    min-height: 100vh;
    /* background: red; */
    flex-direction: row;
}
</style>