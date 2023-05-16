import { defineStore } from 'pinia'
import api from '@/api'

export const useCollectSheet = defineStore('collectSheet',{
    state:()=>{
        return{
            collectSheetInfo:[],
            searchCollectSheetInfo:[],
            sheetDetail:{}
        }
    },
    actions:{
        async getCollectSheet(){
            const result = await api.music.reqCollectSheet();
            if(result.state === 200){
                this.collectSheetInfo = result.data.collectSheetInfo;
            }
        },
        async getCollectSheetById(userId){
            const result = await api.music.reqCollectSheetById({userId});
            if(result.state === 200){
                this.searchCollectSheetInfo = result.data.collectSheetInfo;
            }
        },
        async collectFromSheet(sheetObj){
            const result = await api.music.reqCollectFromSheet(sheetObj);
            return result;
        }
    },
    getters:{

    }
})