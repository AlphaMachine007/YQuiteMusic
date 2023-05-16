import { defineStore } from 'pinia'
import api from '@/api'

export const useSongSheet = defineStore('songSheet',{
    state:()=>{
        return{
            songSheetInfo:[],
            searchSongSheetInfo:[],
            sheetDetail:{}
        }
    },
    actions:{
        async getSongSheet(){
            const result = await api.music.reqGetSongSheet();
            if(result.state === 200){
                this.songSheetInfo = result.data;
            }
        },
        async getSongSheetById(userId){
            const result = await api.music.reqGetSongSheetById({userId});
            if(result.state === 200){
                this.searchSongSheetInfo = result.data;
            }
        }
    },
    getters:{

    }
})