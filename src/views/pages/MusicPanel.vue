<template>
    <div class="musicPanel">
        <!-- banner -->
        <div class="banner-box">
            <div class="banner-top">
                <img :src="playListStore.playingMusic.album ? playListStore.playingMusic.album.picUrl : '/src/assets/avatar.jpg'"
                    alt="">
            </div>
            <div class="banner-bottom">
                <div class="banner-icon">
                    <img v-show="isCollectMusic" src="@/assets/musicPanel/collect.svg" alt="collect"
                        @click="removeFavorite" />
                    <img v-show="!isCollectMusic" src="@/assets/musicPanel/collect-filled.svg" alt="collect" @click="addFavorite" />
                    <img src="@/assets/musicPanel/download.svg" alt="download" @click="downloadMusic" />
                    <img src="@/assets/musicPanel/分享.svg" alt="" class="sendToOther" @click="shareTheMusic" />
                </div>
            </div>
        </div>
        <!-- lyric -->
        <div class="lyric-box">
            <div class="lyric-title">
                <span class="title">{{ playListStore.playingMusic.name || "暂时无法获取歌曲名称" }}</span>
                <div>
                    <span>
                        演唱者:
                        <span v-for="(singer, index) in playListStore.playingMusic.singer">
                            {{ singer.name }}<span v-if="index != playListStore.playingMusic.singer.length - 1">/</span>
                        </span>
                        <span v-if="!playListStore.playingMusic.singer">匿名</span>
                    </span>
                    <span>
                        专辑:
                        <span>
                            {{ playListStore.playingMusic.album ? playListStore.playingMusic.album.name : '' }}
                        </span>
                    </span>
                </div>
            </div>
            <div class="lyric-panel" ref="lyricPanel">
                <div class="lyric-content">
                    <p v-for="(item, key, index) in playListStore.lyricObj" :key="key"
                        :class="{ active: index == playListStore.currentIndex }">{{ item === '' ? '-' : item }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { usePlayList } from '@/store/playList'
import { useUser } from '@/store/user';
import api from '@/api';

import { onMounted, onUnmounted } from 'vue';
import transformTime from '@/utils/transformTime';
const playListStore = usePlayList();
const userStore = useUser();
// let lyric = ref(editLyric(playListStore.lyric));
const lyricPanel = ref(null);

const isCollectMusic = ref(false);

// 处理歌词,key为时间,value为歌词对象

// 取消收藏到我的最爱
async function removeFavorite() {
    const result = await api.user.reqDeleteMyFavorite(playListStore.playingMusic.id);
    if (result.state == 200) {
        isCollectMusic.value = false;
        userStore.getMyFavorite();
    }
}

// 收藏到我的最爱
async function addFavorite() {
    const addData = {
        id: playListStore.playingMusic.id,
        name: playListStore.playingMusic.name,
        singer: playListStore.playingMusic.ar || playListStore.playingMusic.singer,
        album: playListStore.playingMusic.al || playListStore.playingMusic.album,
        time: playListStore.playingMusic.dt || playListStore.playingMusic.time,
        isShowOpe: false
    }
    const result = await api.user.reqAddMyFavorite(addData);
    if (result.state === 200) {
        ElMessage.success('添加成功');
        isCollectMusic.value = true;
        userStore.getMyFavorite();
    } else {
        ElMessage.error('添加失败')
    }
}

function checkCollect() {
    if (userStore.user.myFavorite && userStore.user.myFavorite.find(elem => elem.id == playListStore.playingMusic.id)) {
        isCollectMusic.value = true;
    } else {
        isCollectMusic.value = false;
    }
}

async function downloadMusic() {
    const mp3Url = playListStore.playingMusicInfo[0].url;

    // 1. 将歌曲的mp3链接封装到一个Blob对象中
    const response = await fetch(mp3Url);
    const blob = await response.blob();

    // 2. 创建一个下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playListStore.playingMusic.name}.mp3`;
    document.body.appendChild(a);

    // 3. 触发下载动作
    a.click();

    // 4. 下载完成之后，记得在回调函数中释放URL对象
    URL.revokeObjectURL(url);
    document.body.removeChild(a);

}
// 分享音乐
function shareTheMusic() {
    const baseUrl = window.location.origin+window.location.pathname;
    const songId = playListStore.playingMusic.id;
    const shareUrl = `${baseUrl}?songId=${songId}`;
    navigator.clipboard.writeText(shareUrl);
    ElMessage.success('已将分享链接复制到剪切板中~');
}
async function getSongByUrl(){
    if(window.location.href.split('=')){
        const songId = window.location.href.split('=')[1];
        const result = await api.music.reqSongDetailById({songId});
        if(result.code == 200){
            const music = {
                album:result.songs[0].al,
                id:result.songs[0].id,
                isShowOpe:false,
                name:result.songs[0].name,
                singer:result.songs[0].ar,
                time:transformTime(result.songs[0].dt),
            }
            playListStore.playingMusic = music;
        }
    }
}

onMounted(() => {
    getSongByUrl();
    if (JSON.stringify(playListStore.playingMusic) == '{}' || !playListStore.playingMusic) {
        playListStore.playingMusic = JSON.parse(localStorage.getItem('YQ_PLAYINGMUSIC'));
        playListStore.playingMusicInfo = JSON.parse(localStorage.getItem('YQ_PLAYINGMUSIC_INFO'))
    }
    playListStore.getLyric();
    playListStore.inPanel = true;
    checkCollect();
})
onUnmounted(() => {
    playListStore.inPanel = false;
})

// 监听歌曲当前时间
watch(() => playListStore.currentTime, (newValue) => {
    if (newValue in playListStore.lyricObj && playListStore.isPlaying && playListStore.inPanel === true && newValue != 0) {
        playListStore.currentIndex++
        if (playListStore.currentIndex >= 6) {
            lyricPanel.value.scrollTop = (playListStore.currentIndex - 5) * 36;
        }
    }
})
watch(() => playListStore.playingMusic, () => {
    checkCollect();
})
watch(() => userStore.user.myFavorite, () => {
    checkCollect();
})
</script>

<style lang="less" scoped>
.musicPanel {
    width: 100%;
    height: 74vh;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .banner-box {
        height: 80%;
        width: 40%;
        // background-color: aquamarine;
        z-index: 1;
        position: relative;

        .banner-top,
        .banner-bottom {
            width: 65%;
            height: 80%;
            background-color: #fff;
            color: black;
            position: absolute;
        }

        .banner-top {
            top: 5%;
            left: 12%;
            border-radius: 5px;
            z-index: 2;
            box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.2);

            img {
                width: 100%;
                height: 100%;
                border-radius: 5px;
            }
        }

        .banner-bottom {
            // background-color: rgb(116, 239, 116);//112, 206, 179
            background: url('../../assets/banner04.jpg') no-repeat;
            background-size: cover;
            background-position: 20% 40%;
            z-index: 1;
            right: 10%;
            bottom: 5%;
            display: flex;
            justify-content: flex-end;

            .banner-icon {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                img {
                    width: 55px;
                    margin-bottom: 25px;
                    margin-right: 10px;
                    cursor: pointer;
                }
            }
        }
    }

    .lyric-box {
        height: 80%;
        width: 40%;
        z-index: 1;

        .lyric-title {
            text-align: center;
            color: #fff;
            margin-bottom: 20px;

            span {
                font-size: 14px;
                margin: 10px 10px 10px 5px;
                color: #DFDFDF;
            }

            .title {
                font-size: 20px;
                margin-bottom: 20px;
            }
        }

        .lyric-panel {
            height: 50vh;
            display: flex;
            overflow: auto;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            scroll-behavior: smooth;

            .lyric-content {
                height: 100%;
                text-align: center;
                transition: 1s all linear;

                .active {
                    color: #f5ea7e;
                    font-size: 18px;
                    transition: all 1s ease-in-out;
                }

                p {
                    transition: 1s all ease-in-out;
                }
            }

            &::-webkit-scrollbar {
                width: 3px;
                height: 1px;
            }

            // // 滑块部分
            // &::-webkit-scrollbar-thumb {
            //     background-color: #eee;
            // }
        }
    }
}

.musicPanel::before {
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    filter: brightness(0.5);
    background: url('@/assets/homeBack2.jpg') no-repeat;
    background-size: cover;
    background-position: 50%;
}
</style>