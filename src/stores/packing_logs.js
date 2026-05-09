import { defineStore} from 'pinia';
import api from '@/api/api';
import { ref } from 'vue';

export const usePackingLogsStore = defineStore('packingLogs',() => {
    const slotMax = ref(0);
    const currentSlot = ref(0);
    const revenue = ref(0);
    const recentActivities = ref([]);
    const vehicleTypes = ref([])
    const getCapacitySlot = async () =>{
        try{
            const res = await api.get('/sl/get-slots-behavior');
            slotMax.value = res.data.data.slot_limit.total_slot;
            currentSlot.value = res.data.data.current_slot;
        }
        catch(e){
            console.error('Error fetching capacity slot:', e);
        }
    }
    const getRevenue = async () => {
        try{
            const res = await api.get('/plates/calculate-revenue');   
            revenue.value = res.data.data.total_revenue;
        }
        catch(e){
            console.error('Error fetching revenue:', e);
        }
    }
    const getRecentActivities = async () => {
        try{
            recentActivities.value = [];
            const res = await api.get('/plates/recent-parking-logs');
            recentActivities.value.push(...res.data.data);
        }
        catch(e){
            console.error('Error fetching recent activities:', e);
        }
    }
    const getVehicleTypes = async () =>{
        try{
            vehicleTypes.value = [];
            const res = await api.get('/vt/vehicle-type');
            vehicleTypes.value.push(...res.data.data);
        }
        catch(e){
            console.log(e);
        }
    }
    return {
        slotMax,
        currentSlot,
        revenue,
        recentActivities,
        vehicleTypes,
        getCapacitySlot,
        getRevenue,
        getRecentActivities,
        getVehicleTypes
    }
})
