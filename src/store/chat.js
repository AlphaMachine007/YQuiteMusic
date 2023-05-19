import { defineStore } from 'pinia'
import api from '@/api'

export const useChat = defineStore('chat',{
    state:()=>{
        return{
            chatList:[],
            chatingInfo:{},
        }
    },
    actions:{
        async addChat(userInfo){
            const result = await api.chat.reqChatWithUser(userInfo);
            return result;
        },
        async getChatList(){
            const result = await api.chat.reqGetChatList();
            if(result.state === 200){
                this.chatList = result.data;
            }
        }
    },
    getters:{

    }
})