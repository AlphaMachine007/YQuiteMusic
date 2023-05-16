import { defineStore } from 'pinia'
import api from '@/api'

export const useAlbum = defineStore('album',{
    state:()=>{
        return{

        }
    },
    actions:{
        async getAlbumById(albumId){
            const result = await api.music.reqGetAlbumById({albumId});
            return result;
        }
    },
    getters:{

    }
})