import { defineStore } from 'pinia'
import api from '@/api'
import { setToken, getToken, removeToken } from "@/utils/token";

export const useMainContent = defineStore('mainContent',{

    state: () => {
        return{
            carouselImgs:[],
            commendArr:[],
            topListProfile:[]
        }
    },
    actions: {
        async getBanner(){
            const result = await api.mainContent.reqGetBanner();
            if(result.code === 200){
                this.carouselImgs = result.banners
            }
        },
        async getCommend(){
            const result = await api.mainContent.reqGetCommend();
            if(result.code === 200){
                this.commendArr = result.result
            }
        },
        async getAllTopList(){
            const result = await api.mainContent.reqGetAllTopList();
            if(result.code === 200){
                this.topListProfile = result.list;
            }
        }
    },
    getters: {

    }

})