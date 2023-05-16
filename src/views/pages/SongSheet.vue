<template>
    <div class="songSheet-panel">
        <div class="songSheet-head">
            <div class="message-left">
                <span class="message-item">
                    <span class="item-title">歌单名称:</span>
                    <span v-if="!isEdit" id="sheet-name">
                        {{ songSheetStore.sheetDetail.sheetName }}
                    </span>
                    <el-input v-else minlength="1" maxlength="10" v-model="songSheetStore.sheetDetail.sheetName" placeholder="请输入歌单名称(必填)"
                        clearable @change=""></el-input>
                </span><br />
                <span id="sheet-creator">创建人:{{ songSheetStore.sheetDetail.sheetCreator }}</span><br />
                <span id="create-time">创建时间:{{ songSheetStore.sheetDetail.sheetCreatedTime ?
                    songSheetStore.sheetDetail.sheetCreatedTime.split(' ')[0] : '' }}</span><br />
                <span id="play-num">播放量:{{ songSheetStore.sheetDetail.playNum }}</span>
            </div>
            <div class="message-center">
                <div class="cover-box">
                    <img :src="JSON.stringify(songSheetStore.sheetDetail) != '{}' && songSheetStore.sheetDetail.sheetContent.length > 0 ? (songSheetStore.sheetDetail.picUrl && songSheetStore.sheetDetail.picUrl != '' ? songSheetStore.sheetDetail.picUrl : songSheetStore.sheetDetail.sheetContent[songSheetStore.sheetDetail.sheetContent.length - 1].album.picUrl) : '/src/assets/avatar.jpg'"
                        alt="cover">
                </div>
            </div>
            <div class="message-right">
                <span class="message-item">
                    <span class="item-title">描述:</span>
                    <span v-if="!isEdit">
                        {{ songSheetStore.sheetDetail.sheetDescribe }}
                    </span>
                    <el-input v-else maxlength="100" type="textarea" v-model="songSheetStore.sheetDetail.sheetDescribe" placeholder="请输入描述"
                        clearable @change=""></el-input>
                </span>
            </div>
        </div>
        <div class="songSheet-content">
            <el-card shadow="always">
                <div class="btn-group">
                    <el-button color="#80d95b" style="color:aliceblue" :icon="CaretRight" @click="playAll">
                        播放全部
                    </el-button>
                    <el-button v-show="!songSheetStore.sheetDetail.isAlbum" :class="{ 'collect-btn': isCollectSheet }" @click="collectOrRemoveSheet"
                        :icon="isCollectSheet ? StarFilled : Star" :disabled="!songSheetStore.sheetDetail.isCollect">
                        {{ isCollectSheet ? '已收藏' : '收藏' }}
                    </el-button>
                    <el-button v-if="!isEdit" @click="editSongSheet" :icon="EditPen"
                        :disabled="songSheetStore.sheetDetail.isCollect">
                        编辑歌单
                    </el-button>
                    <el-button v-else type="primary" @click="saveEdit" :icon="Edit">
                        保存
                    </el-button>

                </div>
                <div class="favorite-list">
                    <el-table :data="songSheetStore.sheetDetail.sheetContent" stripe style="max-width: 98%;"
                        @cell-mouse-enter="showOperater" @cell-mouse-leave="HideOperater">
                        <el-table-column label="歌名" prop="name">
                            <template #default="scope">
                                <div class="music-title">
                                    <div>
                                        <span>{{ scope.row.name }}</span>
                                    </div>
                                    <el-icon :size="20" v-show="scope.row.isShowOpe" @click="playingMusic(scope.row)">
                                        <VideoPlay />
                                    </el-icon>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column label="歌手">
                            <template #default="scope">
                                <span v-for="(singer, index) in scope.row.singer">
                                    <a class="singer-name">{{ singer.name }}</a><span
                                        v-if="index != scope.row.singer.length - 1">/</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="专辑" prop="album.name" />
                        <el-table-column label="时长" prop="time" width="100">
                            <template #default="scope">
                                <div class="time-delete">
                                    <div v-show="!scope.row.isShowOpe">
                                        <span>{{ scope.row.time }}</span>
                                    </div>
                                    <el-icon :size="18" v-show="scope.row.isShowOpe"
                                        @click="deleteFavoriteMusic(scope.row)">
                                        <Delete />
                                    </el-icon>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { useSongSheet } from '@/store/songSheet';
import { useUser } from '@/store/user';
import { usePlayList } from '@/store/playList';
import { useCollectSheet } from '@/store/collectSheet';
import { CaretRight, Star, VideoPlay, Delete, EditPen, Edit, StarFilled } from '@element-plus/icons-vue';
import api from '@/api';
import { onMounted, onUnmounted } from 'vue';
import transformTime from '@/utils/transformTime';
import { ElMessage } from 'element-plus';
const songSheetStore = useSongSheet();
const userStore = useUser();
const playListStore = usePlayList();
const collectSheetStore = useCollectSheet();


const isEdit = ref(false);
const isCollectSheet = ref(false);

function showOperater(row) {
    row.isShowOpe = true;
};
function HideOperater(row) {
    row.isShowOpe = false;
};
function checkCollect() {
    const result = collectSheetStore.collectSheetInfo.find(elem => {
        return elem._id == songSheetStore.sheetDetail._id;
    });
    if (result) {
        isCollectSheet.value = true;
    }
}
async function playingMusic(row) {
    console.log(row);
    const playList = {
        userId: userStore.user._id,
        playLists: {
            id: row.id,
            name: row.name,
            singer: row.singer,
            album: row.album,
            time: row.time,
            picImg: row.album.picUrl
        }
    }
    const result = await playListStore.addToPlayList(playList)
    if (result.state === 200) {
        ElMessage.success('已添加至播放列表');
    } else if (result.state === 401) {
        ElMessage.error('歌曲已存在歌单中')
    } else {
        ElMessage.error('添加失败');
    }
    await playListStore.getPlayList();
    console.log(playListStore.playList)
    const tempMusic = playListStore.playList.filter((elem) => {
        return elem.id == row.id
    });
    let tempIndex = 0;
    if (tempMusic.length == 0) {
        tempIndex = playListStore.playList.length;
    } else {
        tempIndex = tempMusic[0].index;
    }
    playListStore.playingMusicIndex = tempIndex;
    playListStore.playingMusic = playListStore.playList[tempIndex];
    playListStore.currentTime = 0;
    playListStore.currentIndex = 0;
}
async function deleteFavoriteMusic(row) {
    const data = {
        sheetId: songSheetStore.sheetDetail._id,
        musicId: row.id
    }
    const result = await api.music.reqRemoveFromSheet(data)
    if (result.state === 200) {
        ElMessage.success('删除成功');
        songSheetStore.getSongSheet()
    } else {
        ElMessage.error('删除失败');
    }
}
async function playAll() {
    const result = await playListStore.playAllMusic(songSheetStore.sheetDetail.sheetContent);
    if (result.state === 200) {
        await playListStore.getPlayList();
        playListStore.playingMusicIndex = 0;
        playListStore.playingMusic = playListStore.playList[playListStore.playingMusicIndex];
        playListStore.currentTime = 0;
        playListStore.currentIndex = 0;
        playListStore.isPlaying = false;
        playListStore.isPlaying = true;
    }
}
async function collectOrRemoveSheet() {
    if (!isCollectSheet.value) {
        const sendCollectSheet = {
            _id: songSheetStore.sheetDetail._id,
            userId: userStore.user._id,
            sheetName: '',
            sheetContent: [],
            sheetDescribe: '',
            sheetCreator: '',
            playNum: 0,
            sheetCreatedTime: ''
        }
        const resultA = await api.music.reqGetSheetDetail({ sheetId: songSheetStore.sheetDetail._id });
        if (resultA.code == 200) {
            sendCollectSheet.sheetName = resultA.playlist.name;
            sendCollectSheet.sheetDescribe = resultA.playlist.description;
            sendCollectSheet.sheetCreator = resultA.playlist.creator.nickname;
            sendCollectSheet.playNum = resultA.playlist.playCount;
            sendCollectSheet.sheetCreatedTime = new Date(resultA.playlist.createTime).toLocaleString();
        }
        const resultB = await api.music.reqGetSheetAllMusic({ sheetId: songSheetStore.sheetDetail._id });
        if (resultB.code == 200) {
            sendCollectSheet.sheetContent = resultB.songs.map(elem => {
                return {
                    id: elem.id,
                    name: elem.name,
                    singer: elem.ar,
                    album: elem.al,
                    time: transformTime(elem.dt),
                    isShowOpe: false
                }
            })
        }
        const result = await collectSheetStore.collectFromSheet(sendCollectSheet);
        if (result.state == 200) {
            collectSheetStore.getCollectSheet();
            ElMessage.success('收藏成功');
            isCollectSheet.value = true;
        } else {
            ElMessage.error('收藏失败');
        }
    } else {
        // api.music.reqRemoveCollectSheet({sheetId:id});
        const result =  await api.music.reqRemoveCollectSheet({ sheetId: songSheetStore.sheetDetail._id });
        if(result.state == 200){
            collectSheetStore.getCollectSheet();
            isCollectSheet.value = false;
        }
    }
}
function editSongSheet() {
    isEdit.value = true;
}
async function saveEdit() {
    const result = await api.music.reqModifySongSheet(songSheetStore.sheetDetail);
    if (result.state === 200) {
        ElMessage.success('修改完成');
        isEdit.value = false;
    } else {
        ElMessage.error('修改失败');
    }
}

onMounted(() => {
    if (JSON.stringify(songSheetStore.sheetDetail) == '{}' || !songSheetStore.sheetDetail) {
        songSheetStore.sheetDetail = JSON.parse(localStorage.getItem('YQ_SONGSHEET_INFO'));
    }
})

onUnmounted(() => {
    localStorage.removeItem('YQ_SONGSHEET_INFO');
})

watch(() => songSheetStore.sheetDetail, () => {
    checkCollect()
})
watch(() => collectSheetStore.collectSheetInfo, () => {
    checkCollect();
})
</script>

<style lang="less" scoped>
.songSheet-panel {
    width: 100%;

    .songSheet-head {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        position: relative;

        .message-left {
            z-index: 1;
            width: 20%;
            color: white;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;

            >span {
                line-height: 35px;
                display: inline-block;
                padding-right: 30px;
            }

            .message-item {
                display: flex;
                justify-content: right;

                .item-title {
                    min-width: 60px;
                }
            }
        }

        .message-center {
            height: 80%;
            border-radius: 50%;
            padding: 20px;
            border: 2px white solid;
            z-index: 1;
            overflow: hidden;
            text-overflow: ellipsis;

            .cover-box {
                position: relative;
                height: 100%;

                img {
                    height: 100%;
                    border-radius: 50%;
                    border: 2px white solid;
                }
            }

            .cover-box:hover {
                transform: rotateZ(360deg) scale(1.2);
                transition: 0.5s all ease-in-out;
            }
        }

        .message-right {
            z-index: 1;
            width: 20%;
            max-height: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            color: white;
            padding-left: 30px;
        }
    }

    .songSheet-head::before {
        content: '';
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background: url('../../assets/musicPanel/back.jpg') no-repeat;
        filter: brightness(0.6);
        background-size: cover;
        background-position: 0 40%;
    }

    .songSheet-content {
        width: 100%;

        .btn-group {
            .collect-btn {
                :deep(.el-icon) {
                    color: rgb(230, 230, 3) !important;
                }
            }
        }

        .favorite-list {
            width: 100%;
            display: flex;
            justify-content: center;

            .music-title {
                display: flex;
                justify-content: space-between;
                align-items: center;

                i {
                    cursor: pointer;
                }
            }

            .singer-name {
                color: black;
            }

            .time-delete {
                display: flex;
                align-items: center;

                i {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>