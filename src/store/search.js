import { defineStore } from 'pinia'
import api from '@/api'

export const useSearch = defineStore('search', {
    state: () => {
        return {
            current: 1,//当前页
            offset: 0,//偏移量
            limit: 20,//每页限制条数
            keywords: '',//搜索关键词
            type: 1,//搜索类型，1为单曲
            searchArr: [],//搜索单页返回结果
            count: 0,//搜索返回总条数
            limits: [10, 20, 30, 40, 50],
            loading: false,//加载
            searchKind:0//1为用户，0为其他
        }
    },
    actions: {
        async searchInfo() {
            this.loading = true;
            this.offset = (this.current - 1) * this.limit;
            if (this.keywords != '') {
                const result = await api.search.reqSearch({ keywords: this.keywords, offset: this.offset, limit: this.limit, type: this.type })
                if (result.code === 200) {
                    this.count = result.result.songCount || result.result.artistCount || result.result.playlistCount || result.result.albumCount;
                    this.searchArr = result.result.songs || result.result.artists || result.result.playlists || result.result.albums;
                    this.loading = false
                }
            }

        },
        changeType(newType) {
            this.type = newType;
            this.current = 1;
            this.offset = 0;
        },
        async searchUser() {
            this.loading = true;
            this.offset = (this.current - 1) * this.limit;
            const result = await api.search.reqSearchUser({ keywords: this.keywords, page: this.current, limit: this.limit });
            if (result.state == 200) {
                this.count = result.data.count;
                this.searchArr = result.data.users;
                this.loading = false;
            }
        }
    },
    getters: {

    }
})