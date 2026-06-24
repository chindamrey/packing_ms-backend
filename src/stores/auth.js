import { defineStore } from 'pinia';
import api from '@/api/api';
import { ref, computed, reactive } from 'vue';
import { get } from '@vueuse/core';


export const useAuthStore = ('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const user = ref(null);
    const me = ref(null);
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const login = async (payload) => {

        const res = await api.post('/auth/login', payload);
        // console.log('in login response : ',res.data.data.token);
        
        token.value = res.data.data?.token;
        localStorage.setItem('token', token.value);
        console.log(token.value);
        
        await getProfile();
        console.log('user',user);
        
        return res.data;
    }

    const getProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            user.value = res.data;
        } catch (e) {
            console.log(e);

        }

    }

    const logout = async () => {
        try {
            const res = await api.put("/auth/logout");
            return res.data;
        } finally {
            clearAuth();
        }
    };

    const clearAuth = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
    };

    const getMe =async ()=>{
        const res = await api.get("/auth/me");
        return res.data.data;
    }

    return {
        token,
        user,
        isAuthenticated,
        me,
        login,
        clearAuth,
        logout,
        getProfile,
        getMe
    }

})