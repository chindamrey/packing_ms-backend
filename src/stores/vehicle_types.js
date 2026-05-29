import { defineStore } from 'pinia';
import api from '@/api/api';
import { ref } from 'vue';

export const useVehicleTypeStore = defineStore('vehicleTypes', () => {
    const vehicleType = ref();
    
const getAllVehicleTypes = async () => {
        try {
            const res = await api.get('/vt/vehicle-type');
            vehicleType.value = res.data.data;
        } catch (e) {
            console.log(e);
        }
    }

    const getVehicleTypeById = async (id) => {
        try {
            const res = await api.get(`/vt/vehicle-type/${id}`);
            vehicleType.value = res.data.data[0];
        } catch (e) {
            console.log(e);

        }
    }
    const createVehicleType = async (payload) => {
        try {
            // console.log('in store ', payload);

            const res = await api.post('/vt/vehicle-type', payload)
            return res.data;
        } catch (e) {
            console.log(e);

        }
    }

    const editVehicleTypeById = async(id,payload) =>{
        try {
            const res = await api.put(`/vt/vehicle-type/${id}`,payload);
            return res.data;
            console.log('in store ',res.data);
            
        } catch (e) {
            console.log(e);
            
            
        }
    }
    
    const removeVehicleTypeById = async (id) =>{
        try {
            const res = await api.delete(`/vt/vehicle-type/${id}`);
            return res.data;
        } catch (e) {
            console.log(e);
            
            
        }
    }
    return {
        vehicleType,
        getVehicleTypeById,
        createVehicleType,
        editVehicleTypeById,
        removeVehicleTypeById,
        getAllVehicleTypes
    }
})