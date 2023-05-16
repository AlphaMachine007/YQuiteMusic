import { defineStore } from 'pinia'
import api from '@/api'

export const useSearchUser = defineStore('searchUser',{
    state:()=>{
        return{
            userInfo:{},
        }
    },
    actions:{
        getUserInfo(userInfo){
            this.userInfo = userInfo;
        }
    },
    getters:{

    }
})