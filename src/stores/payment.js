import { defineStore } from 'pinia';
import api from '@/api/api';
import { ref, computed, reactive } from 'vue';

export const usePaymentStore = defineStore('payment', () => {

    const md5 = ref(null)
    const RESTART_COUNTDOWN_SECONDS = ref(3000);
    const isPaid = ref(false);
    const paid = ref(false);
    let isWork= ref('hello')

    const generateQR = async (payload) => {
        try {
            const res = await api.post('/pay1/generate', payload);
            md5.value = res.data.md5

            return res.data;

        } catch (e) {
            console.log(e);
        }
    }
    const verifyPaymentByMd5 = async (payload) => {
        try {
            const res = await api.post('/pay1/check', payload);
           
            console.log('in store payment is paid : ',res)
            return res.data;
        } catch (e) {
            console.log(e);
        }
    }

    const paymentIsPaid = async (payload) => {
        console.log('receive payload: ',payload)
        try {
            const res = await api.post('/pay1/isPaid',payload);
            console.log(`Is Paid in store with this md5 : `,res)
            isPaid.value = res.data.result;
            // isPaid.value = res.data.isPaid;paid.value = true;
            return res.data;
        } catch (e) {
            console.log(e)
            
        }
    }
    return { generateQR, verifyPaymentByMd5, paymentIsPaid,isPaid, md5, RESTART_COUNTDOWN_SECONDS ,isWork}
});