import { defineStore } from 'pinia'
import api from '@/api'

export const useCloudMusic = defineStore('cloudMusic',{
    state:()=>{
        return{
            cloudUser:{
                account:{},
                profile:{},
                isLogin:JSON.parse(localStorage.getItem('YQ_CLOUD_STATUS')) || false
            }
        }
    },
    actions:{
        async getVisitorCookie(){
            const result = await api.cloudMusic.reqVisitorCookie()
            if(result.code === 200){
                localStorage.setItem('cookie',result.cookie);
            }
        },
        async getLoginStatus(cookie=''){
            const result = await api.cloudMusic.reqLoginStatus({cookie});
            return result;
        },
        async getUnikey(){
            const result = await api.cloudMusic.reqGetUnikey();
            return result;
        },
        async getQRCode(key){
            const result = await api.cloudMusic.reqGetQRCode({key});
            return result;
        },
        async checkQRCode(key){
            const result = await api.cloudMusic.reqQRCodeStatus({key});
            return result;
        },
        async cloudLogout(cookie=''){
            const result = await api.cloudMusic.reqCloudLogout({cookie});
            return result;
        }
        ,async getCloudPlayList(uid){
            const result = await api.cloudMusic.reqCloudPlayList({uid});
            return result;
        }
    },
    getters:{
        

    }
})