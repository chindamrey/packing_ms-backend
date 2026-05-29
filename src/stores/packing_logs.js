import { defineStore } from 'pinia';
import api from '@/api/api';
import { ref,computed, reactive } from 'vue';

export const usePackingLogsStore = defineStore('packingLogs', () => {
    const slotMax = ref(0);
    const currentSlot = ref(0);
    const slotId = ref(0);
    const revenue = ref(0);
    const recentActivities = ref([]);
    const allParkingLogs = ref([]);
    const vehicleTypes = ref([])
    const allStatusInfo = ref();
    const currentPage = ref(1);
    const perPage = ref(5);
    const total = ref(0);
    const totalPages = ref(0);

    // getters
    const rangeStart = computed(() =>
        (currentPage.value - 1) * perPage.value + 1
    )

    const rangeEnd = computed(() =>
        Math.min(currentPage.value * perPage.value, total.value)
    )


    const getCapacitySlot = async () => {
        try {
            const res = await api.get('/sl/get-slots-behavior');
            slotMax.value = res.data.data.slot_limit.total_slot;
            currentSlot.value = res.data.data.current_slot;
            slotId.value = res.data.data.slot_limit.id;
            return res.data.data.slot_limit.total_slot;
             
        }
        catch (e) {
            console.error('Error fetching capacity slot:', e);
        }
    }
    const getRevenue = async () => {
        try {
            const res = await api.get('/plates/calculate-revenue');
            revenue.value = res.data.data.total_revenue;
        }
        catch (e) {
            console.error('Error fetching revenue:', e);
        }
    }
    const getRecentActivities = async () => {
        try {
            
            recentActivities.value = [];
            const res = await api.get('/plates/recent-parking-logs', {
                params: {
                    page: currentPage.value,
                    limit: perPage.value,

                }
            });
            recentActivities.value.push(...res.data.data);
            // logs.value = res.data.data
            console.log('response api : ',res.data);
            
            total.value = res.data.total
            totalPages.value = res.data.totalPage
        }
        catch (e) {
            console.error('Error fetching recent activities:', e);
        }
    }
    const getAllParkingLogs = async () => {
        try {
            allParkingLogs.value = [];

            const firstPage = await api.get('/plates/recent-parking-logs', {
                params: {
                    page: 1,
                    limit: 100,
                }
            });

            const firstPageRows = firstPage.data.data ?? [];
            const pageCount = firstPage.data.totalPage ?? 1;
            allParkingLogs.value.push(...firstPageRows);

            for (let page = 2; page <= pageCount; page++) {
                const res = await api.get('/plates/recent-parking-logs', {
                    params: {
                        page,
                        limit: 100,
                    }
                });
                allParkingLogs.value.push(...(res.data.data ?? []));
            }

            return allParkingLogs.value;
        }
        catch (e) {
            console.error('Error fetching all parking logs:', e);
            allParkingLogs.value = [];
            return [];
        }
    }
    const getVehicleTypes = async () => {
        try {
            vehicleTypes.value = [];
            const res = await api.get('/vt/vehicle-type');
            vehicleTypes.value.push(...res.data.data);
        }
        catch (e) {
            console.log(e);
        }
    }

    const getAllStatus = async () => {
        try {

            const res = await api.get('/plates/parking-logs');
            allStatusInfo.value = res.data;
        } catch (e) {
            console.log(e);


        }
    }

    const setPage = (page) => {
        currentPage.value = page
        getRecentActivities(perPage.value,currentPage.value)
    }

    return {
        slotMax,
        currentSlot,
        revenue,
        recentActivities,
        allParkingLogs,
        vehicleTypes,
        perPage,
        currentPage,
        total,
        totalPages,
        allStatusInfo,
        rangeEnd,
        rangeStart,
        slotId,
        getCapacitySlot,
        getRevenue,
        getRecentActivities,
        getAllParkingLogs,
        getVehicleTypes,
        getAllStatus,
        setPage,

    }
})
