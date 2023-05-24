import { defineStore } from 'pinia'
import api from '@/api'

export const usePlayList = defineStore('playList',{
    state:()=>{
        return{
            playList:localStorage.getItem('YQ_PlayList') || [],
            playingMusic:{},
            playingMusicInfo:[],
            playingMusicIndex:0,
            lyric:"",
            lyricObj:{},
            translatelyric:"",
            currentTime:0,
            currentIndex:0,
            isPlaying:false,
            inPanel:false,
            preToAdd:{},
        }
    },
    actions:{
        async addToPlayList(playList){
            const result = await api.music.reqAddToPlayList(playList);
            return result;
        },
        async getPlayList(){
            const result = await api.music.reqPlayList();
            if(result.state === 200){
                this.playList = result.data.playListsInfo
            }
        },
        async getMusicInfo(musicId){
            const result = await api.music.reqMusicUrl({musicId,level:'lossless'});
            if(result.code === 200){
                this.playingMusicInfo = result.data
            }
        },
        async getLyric(){
            const result = await api.music.reqMusicLyric({id:this.playingMusic.id});
            if(result.code === 200){
                this.lyric = result.lrc.lyric;
                this.translatelyric = result.tlyric ? result.tlyric.lyric || "" : "";
            }
        },
        // 播放全部功能
        async playAllMusic(PlayList){
            const result = await api.music.reqPlayAllMusic(PlayList);
            return result;
        },
        // 添加多首歌曲
        async addManyMusic(musicArr){
            const result = await api.music.reqAddManyToPlayList(musicArr);
            if(result.state === 200){
                ElMessage.success('添加成功');
                await this.getPlayList();
            }else{
                ElMessage.error('添加失败');
            }
        }
    },
    getters:{

    }
})