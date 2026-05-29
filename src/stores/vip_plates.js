import { defineStore } from 'pinia';
import api from '@/api/api';
import { ref } from 'vue';
// import { L } from 'vue-router/dist/index-D_VEAp3P.js';

export const useVipPlatesStore = defineStore('vehicleTypes', () => {
    const vipPlates = ref();
    const getAllVipPlates = async () => {
        try {
            const res = await api.get('/vip/all-vip');
            vipPlates.value = res.data.data;
        } catch (e) {
           console.log(e);
            
        }
    }

    const addVipPlate = async (payload) => {
        try {
            const res = await api.post('/vip/vip-plates',payload);
            return res.data.data;
        } catch (e) {
            console.log(e);
            
        }
    }

    const getVipPlateById = async (id) => {
        try {
            const res = await api.get(`/vip/get-vip/${id}`);
            vipPlates.value = res.data.data;
        } catch (e) {
            console.log(e);
            
        }
    }

    const editVipPlate = async (id,payload) => {
        try {
           const res = await api.put(`/vip/vip-plate/${id}`,payload);
           return res.data;
        } catch (e) {
            console.log(e);
            
        }
    }

    const deleteVipPlate = async (id) => {
        try {
            const res = await api.delete(`/vip/vip-plate/${id}`);
            return res.data;
        } catch (e) {
            console.log(e);
            
        }
    }
    return{
        vipPlates,
        getAllVipPlates,
        addVipPlate,
        getVipPlateById,
        editVipPlate,
        deleteVipPlate
    }
})