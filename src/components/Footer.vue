<template>
    <div class="foot-content">
        <div class="play-btn-group">
            <a class="play-btn" @click="preMusic">
                <img src="../assets/上一首.svg" alt="pre">
            </a>
            <a class="play-btn play-btn-change" @click="changeMusicState">
                <img src="../assets/音符.svg" alt="play" v-show="!playListStore.isPlaying">
                <img class="playingBtn" src="../assets/play.gif" alt="pause" v-show="playListStore.isPlaying">
            </a>
            <a class="play-btn" @click="nextMusic">
                <img src="../assets/下一首.svg" alt="next">
            </a>
        </div>
        <div class="music-player">
            <img :src="playListStore.playingMusic && playListStore.playingMusic.album ? playListStore.playingMusic.album.picUrl : '/src/assets/logo.png'"
                alt="title-page" class="title-page" @click="gotoMusicPanel">
            <div class="title-slider">
                <div>
                    <span>{{ playListStore.playingMusic && playListStore.playingMusic.name }}</span>
                    <span>{{ currentTime }}/<span>{{ musicTime }}</span></span>
                </div>
                <el-slider v-model="process" size="small" @input="getMusicProcess" :format-tooltip="showTime">
                </el-slider>
            </div>
        </div>
        <audio v-show="false" id="music-container"
            :src="playListStore.playingMusic && playListStore.playingMusicInfo.length ? playListStore.playingMusicInfo[0].url : ''"
            ref="musicContainer"></audio>
        <div class="music-sound">
            <el-dropdown class="sound-box">
                <img :src="sound <= 0 ? '/src/assets/静音.svg' : '/src/assets/音量.svg'" alt="sound" class="sound-btn">
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            <el-slider v-model="sound" size="small" vertical height="100px" @input="changeSound">
                            </el-slider>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown trigger="click" placement="top" :hide-on-click="false">
                <span class="el-dropdown-link">
                    <img src="../assets/列表.svg" alt="musicLists" class="sound-btn">
                </span>
                <template #dropdown>
                    <el-dropdown-menu class="dropList">
                        <span style="font-size: 16px;margin-left: 10px;font-weight: 600;">播放列表</span>
                        <el-dropdown-item style="width: 50vw;">
                            <template #default>
                                <el-table style="height: 50vh" :data="userPlayList" :cell-class-name="tableCellClassName"
                                    stripe class="tableList" @cell-mouse-enter="showOperater"
                                    @cell-mouse-leave="HideOperater" @cell-click="playMusic">
                                    <el-table-column width="30">
                                        <template #default="scope">
                                            <el-icon
                                                v-show="playListStore.playingMusic && playListStore.playingMusic.index ? playListStore.playingMusic.index == scope.row.index : false">
                                                <Headset />
                                            </el-icon>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" align="center">
                                        <template #default="scope">
                                            <span
                                                :style="playListStore.playingMusic && playListStore.playingMusic.index ? (playListStore.playingMusic.index == scope.row.index ? { 'color': '#40a9ff' } : { 'color': 'black' }) : { 'color': 'black' }">{{
                                                    scope.row.name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="right">
                                        <template #default="scope">
                                            <div v-show="scope.row.isShowOpe">
                                                <el-tooltip content="收藏" placement="bottom" effect="light">
                                                    <el-icon size="18" class="edit-icon" @click="collectMusic(scope.row)">
                                                        <FolderAdd />
                                                    </el-icon>
                                                </el-tooltip>
                                                <el-tooltip content="下载" placement="bottom" effect="light">
                                                    <el-icon size="18" class="edit-icon" @click="downloadMusic(scope.row)">
                                                        <Download />
                                                    </el-icon>
                                                </el-tooltip>
                                                <el-tooltip content="删除" placement="bottom" effect="light">
                                                    <el-icon size="18" class="edit-icon"
                                                        @click="deleteFromPlayMusic(scope.row)">
                                                        <Delete />
                                                    </el-icon>
                                                </el-tooltip>
                                            </div>

                                        </template>
                                    </el-table-column>
                                    <el-table-column align="right">
                                        <template #default="scope">
                                            <span v-for="(singer, index) in scope.row.singer">
                                                <a>{{ singer.name }}</a><span
                                                    v-if="index != scope.row.singer.length - 1">/</span>
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="time" width="100" />
                                </el-table>
                            </template>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-dialog v-model="showCollect" width="30%">
            <CollectPanel @closeDialog="closeDialog"></CollectPanel>
        </el-dialog>

    </div>
</template>

<script setup>
import router from '@/routes';
import { FolderAdd, Delete, Download, Headset } from '@element-plus/icons-vue';
import { usePlayList } from '@/store/playList';
import api from '@/api';
import CollectPanel from './CollectPanel.vue';
import { ElMessage } from 'element-plus';

// 判断歌曲播放状态

let musicTime = ref("00:00");
let currentTime = ref("00:00");
let process = ref(0);
let sound = ref(0);

const showCollect = ref(false);

const musicContainer = ref(null);

const playListStore = usePlayList();
const userPlayList = ref(getUserPlayList());

function closeDialog() {
    showCollect.value = false
}
function gotoMusicPanel() {
    playListStore.inPanel = true;
    router.push({ path: '/home/musicpanel' });
};
function getUserPlayList(listTemp = playListStore.playList) {
    return listTemp.map((elem) => {
        elem.isShowOpe = false;
        return elem;
    })
};
function showOperater(row) {
    row.isShowOpe = true;
};
function HideOperater(row) {
    row.isShowOpe = false;
};
function playMusic(row, column) {
    if (column.property === 'name') {
        playListStore.playingMusicIndex = row.index;
        playListStore.playingMusic = row;
        playListStore.currentTime = 0;
        playListStore.currentIndex = 0;
        process.value = 0;
        localStorage.setItem('YQ_PLAYINGMUSIC', JSON.stringify(row));
    }
};
// 上一首
function preMusic() {
    if (playListStore.playingMusicIndex > 0) {
        playListStore.playingMusicIndex -= 1;
        playListStore.playingMusic = playListStore.playList[playListStore.playingMusicIndex];
        playListStore.currentTime = 0;
        playListStore.currentIndex = 0;
        process.value = 0;
    }
}
// 下一首
function nextMusic() {
    if (playListStore.playingMusicIndex < playListStore.playList.length - 1) {
        playListStore.playingMusicIndex += 1;
        playListStore.playingMusic = playListStore.playList[playListStore.playingMusicIndex];
        playListStore.currentTime = 0;
        playListStore.currentIndex = 0;
        process.value = 0;
    }
}
// 播放/暂停歌曲
function changeMusicState() {
    if (playListStore.isPlaying) {
        musicContainer.value.pause();
        playListStore.isPlaying = false;
    } else {
        musicContainer.value.play();
        playListStore.isPlaying = true;
    }
};
// 收藏歌曲
function collectMusic(row) {
    showCollect.value = true;
    playListStore.preToAdd = row;
};
// 下载歌曲
async function downloadMusic(row) {
    const result = await api.music.reqMusicUrl({ musicId: row.id, level: 'lossless' });
    if (result.code == 200) {
        const mp3Url = result.data[0].url
        // 1. 将歌曲的mp3链接封装到一个Blob对象中
        const response = await fetch(mp3Url);
        const blob = await response.blob();

        // 2. 创建一个下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${row.name}.mp3`;
        document.body.appendChild(a);

        // 3. 触发下载动作
        a.click();

        // 4. 下载完成之后，记得在回调函数中释放URL对象
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        ElMessage.error('下载失败')
    }
}
// 从播放列表中删除歌曲
async function deleteFromPlayMusic(row) {
    const result = await api.music.reqRemoveMusicById(row.id);
    if (result.state == 200) {
        ElMessage.success('删除成功');
        playListStore.getPlayList();
    } else {
        ElMessage.error('删除失败');
    }
}

// 切换音量
function changeSound(value) {
    musicContainer.value.volume = value / 100
}

/* 进度条事件 */
function getMusicProcess(value) {
    musicContainer.value.currentTime = (value / 100) * musicContainer.value.duration;
    let closestIndex = null;
    let closestDiff = Infinity;
    let index = 0;
    for (let key in playListStore.lyricObj) {
        let diff = Math.abs(Math.floor(musicContainer.value.currentTime) - key);
        if (diff < closestDiff) {
            closestDiff = diff;
            closestIndex = index;
        }
        index++;
    }
    playListStore.currentIndex = closestIndex;
}
function showTime() {
    return currentTime.value;
}

function tableCellClassName({ row, rowIndex }) {
    row.index = rowIndex;
}
function editLyric(lyric = playListStore.lyric) {
    let lyricArr = lyric.split('[').slice(1);
    let lrcObj = {};
    lyricArr.forEach((elem) => {
        let tempArr = elem.split(']');
        // 分割时间
        let minutes = parseInt(tempArr[0].split(':')[0]);
        let seconds = parseInt(tempArr[0].split(':')[1]);
        tempArr[0] = minutes * 60 + seconds;
        let valueArr = tempArr[1].split('\n')[0];
        lrcObj[tempArr[0]] = valueArr
    })
    return lrcObj;
}
watch(() => playListStore.playingMusic, async (newValue) => {
    if (newValue) {
        playListStore.getLyric();
        playListStore.lyricObj = editLyric(playListStore.lyric);
        await playListStore.getMusicInfo(newValue.id)
        if (playListStore.isPlaying === true) {
            playListStore.isPlaying = false;
            musicContainer.value.pause();
            setTimeout(() => {
                playListStore.isPlaying = true;
                musicContainer.value.play();
            }, 500)
        }
        localStorage.setItem('YQ_PLAYINGMUSIC', JSON.stringify(newValue));
        localStorage.setItem('YQ_PLAYINGMUSIC_INFO', JSON.stringify(playListStore.playingMusicInfo));
    }

})
watch(() => playListStore.lyric, (newValue) => {
    playListStore.lyricObj = editLyric(playListStore.lyric);
})
watch(() => playListStore.playList, (newValue) => {
    userPlayList.value = getUserPlayList(newValue);
});
watch(() => playListStore.playingMusicInfo, (newValue) => {
    if (newValue) {
        const minutes = Math.floor(newValue[0].time / 1000 / 60);
        const seconds = Math.floor(newValue[0].time % 60000 / 1000);
        let zeroM = '', zeroS = '';
        if (minutes < 10) {
            zeroM = '0'
        }
        if (seconds < 10) {
            zeroS = '0'
        }
        musicTime.value = zeroM + minutes + ':' + zeroS + seconds;
        // 音量
        sound.value = musicContainer.value.volume * 100;
        // 监听audio进度条
        musicContainer.value.addEventListener('timeupdate', () => {
            playListStore.currentTime = Math.floor(musicContainer.value.currentTime);
            const m = Math.floor(musicContainer.value.currentTime / 60);
            const s = Math.floor(musicContainer.value.currentTime % 60);
            let zm = '', zs = '';
            if (m < 10) {
                zm = '0'
            }
            if (s < 10) {
                zs = '0'
            }
            currentTime.value = zm + m + ':' + zs + s;
            process.value = (musicContainer.value.currentTime / musicContainer.value.duration) * 100
            if (musicContainer.value.currentTime === musicContainer.value.duration) {
                nextMusic();
            }
        })
    }
})
// 监听歌曲当前时间
watch(() => playListStore.currentTime, (newValue) => {
    if (newValue in playListStore.lyricObj && playListStore.isPlaying && playListStore.inPanel === false && newValue != 0) {
        playListStore.currentIndex++
    }
})
watch(() => playListStore.isPlaying, (newValue) => {
    if (newValue == true) {
        musicContainer.value.play();
    } else {
        musicContainer.value.pause();
    }
})
</script>

<style lang="less" scoped>
.foot-content {
    width: 100%;
    height: 80px;
    border-top: 1px #DFDFDF solid;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .play-btn-group {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 0.2;

        .play-btn {
            img {
                width: 30px;
                height: 30px;
            }
        }

        .play-btn-change {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;

            .playingBtn {
                margin-bottom: 15px;
            }

            img {
                width: 70%;
                height: 70%;
            }
        }
    }

    .music-player {
        display: flex;
        align-items: center;
        flex: 0.65;

        .title-page {
            height: 60px;
            padding: 0.5%;
            cursor: pointer;
        }

        .title-slider {
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            width: 75%;

            div {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }

    .music-sound {
        display: flex;
        align-items: center;
        flex: 0.1;
        margin-right: 1%;

        .sound-btn {
            width: 30px;
            height: 30px;
            margin-right: 20px;
            cursor: pointer;
        }

    }
}

@media screen and (max-width:768px) {
    .sound-box {
        display: none !important;
    }
}
</style>

<style>
.dropList .el-dropdown-menu__item {
    padding: 0;
}
</style>