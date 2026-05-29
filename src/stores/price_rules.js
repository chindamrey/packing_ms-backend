import { defineStore } from 'pinia';
import api from '@/api/api';
import { ref } from 'vue';

export const usePriceRulesStore = defineStore('priceRulesStore', () => {
    const priceRules = ref();
    const getAllPriceRules = async () => {
        try {
            const res = await api.get('/pr/price-rules');
            priceRules.value = res.data.data;
        } catch (e) {
            console.log(e);


        }
    }

    const createPriceRule = async (payload) => {
        try {
            const res = await api.post('/pr/price-rule', payload);
            return res.data;
        } catch (e) {
            console.log(e);

        }
    }

    const getPriceRuleById = async (id) => {
        try {
            const res = await api.get(`/pr/price-rule/${id}`);
            priceRules.value = res.data;
        } catch (e) {
            console.log(e);

        }
    }

    const editPriceRuleById = async (id, payload) => {
        try {
            const res = await api.put(`/pr/price-rule/${id}`, payload);
            return res.data;
        } catch (e) {
            console.log(e);

        }
    }

    
    const removePriceRuleById = async (id) => {
        try {
            const res = await api.delete(`/pr/price-rule/${id}`);
            return res.data;
        } catch (e) {
            console.log(e);

        }
    }



        return {
            priceRules,
            getAllPriceRules,
            createPriceRule,
            getPriceRuleById,
            editPriceRuleById,
            removePriceRuleById
        }

    })