import { defineStore } from 'pinia'
import api from '@/api'
import { setToken, getToken, removeToken } from "@/utils/token";
import { getavatarUrl } from '@/utils/changeBufferToUrl';
// useMain  可以是 useUser、useCart 之类的名字 
// defineStore('main',{..}) 在devtools 就使用 main 这个名

export const useUser = defineStore('user', {
    // 相当于data
    state: () => {
        return {
            user: {
            },
            token: getToken(),
            status: [],
            fansList:[],
            focusList:[]
        }
    },
    // 相当于计算属性
    getters: {

    },
    // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
    actions: {
        async userLogin(account, password) {
            let result = await api.user.reqUserLogin({ account, password })
            if (result.state === 200) {
                this.user = result.data.sendUser
                setToken(result.data.token)
                return result;
            } else {
                return { state: 403, message: '登陆失败' }
            }
        },
        async getUserInfo() {
            const result = await api.user.reqUserByToken()
            if (result.state === 200) {
                this.user = result.data.sendUser
                return result
            } else {
                return { state: 403, message: '登陆失败' }
            }
        },
        userRegist(account, password) {
            return api.user.reqUserRegist({ account, password })
        },
        userLogout() {
            this.user = {}
            this.token = ''
            removeToken()
        },
        handleToken() {
            this.token = getToken()
        },
        async getStatus() {
            let result = await api.user.reqStatus()
            if (result.state === 200) {
                this.status = result.data
            }
        },
        // 修改登录用户信息
        async updateUserInfo() {
            const {avatar,myFavorite,...sendUser} = this.user;
            const result = await api.user.reqUpdateUserInfo(sendUser);
            if (result.state === 200) {
                this.user = result.data.userInfo;
                setToken(result.data.token);
                this.getAvatar();
                this.getMyFavorite();
            }
            return result
        },
        // 修改用户信息
        async updateUser(user){
            const {avatar,myFavorite,...sendUser} = user;
            const result = await api.user.reqUpdateUserInfo(sendUser);
        },
        // 上传头像
        async updateAvatar(avatar) {
            const result = await api.user.reqUpdateAvatar(avatar);
            if (result.state === 200) {
                this.user.avatar = result.data.dataURL
            }
            return result
        },
        async getAvatar(){
            const result = await api.user.reqGetAvatar()
            if(result.state === 200){
                this.user.avatar = result.data.dataURL
            }
        },
        // 获取我的最爱
        async getMyFavorite(){
            const result = await api.user.reqMyFavorite()
            if(result.state === 200){
                this.user.myFavorite = result.data.myFavorite
            }
        },
        // 获取关注列表
        async getFocusList(){
            const result = await api.user.reqGetFocusList();
            if(result.state === 200){
                result.data.focusList.forEach(element => {
                    if(element.avatar){
                        getavatarUrl(element.avatar,url=>{
                            element.avatar = url;
                        })
                    }else{
                        element.avatar = '/src/assets/avatar.jpg';
                    }
                });
                this.focusList = result.data.focusList;
            }
        },
        // 获取粉丝列表
        async getFansList(){
            const result = await api.user.reqGetFansList();
            if(result.state === 200){
                this.fansList = result.data.fansList;
            }
        },
        // 关注用户
        async focusUser(userInfo){
            const result = await api.user.reqFocusUser({userInfo,focusUserInfo:this.user});
            return result;
        },
        // 取消关注
        async unFocusUser(userInfo){
            const result = await api.user.reqUnFocusUser({userInfo,unFocusUserInfo:this.user});
            return result;
        }
    },
})

