import { defineStore } from 'pinia';
import api from '@/api/api';
import { ref, computed, reactive } from 'vue';

export const useSlotStore = defineStore('slots', ()=> {
    const slots = ref();
    const editSlot = async (id, payload) => {
        const res = await api.put(`/sl/update-slot-limit/${id}`,payload);
        return res.data;
    }
    return{
        slots,
        editSlot
    }
})