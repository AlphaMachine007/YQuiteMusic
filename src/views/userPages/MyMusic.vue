<template>
    <div class="music-panel">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <el-tabs v-model="activeName" class="tabs-panel">
                <el-tab-pane label="歌曲" name="song">
                    <div class="btn-group">
                        <el-button color="#80d95b" style="color:aliceblue" :icon="CaretRight" @click="playAll">
                            播放全部
                        </el-button>
                        <el-button @click="addToSongSheets" :icon="Plus">
                            添加至
                        </el-button>
                    </div>
                    <div class="favorite-list">
                        <el-table :data="userStore.user.myFavorite" stripe style="width: 98%;"
                            @cell-mouse-enter="showOperater" @cell-mouse-leave="HideOperater">
                            <el-table-column label="歌名" prop="songName">
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
                </el-tab-pane>
                <el-tab-pane label="歌单" name="playlist">
                    <sheetComponent :sheetStore="songSheetStore.songSheetInfo" :funcObj="funcObj" ></sheetComponent>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
    <el-dialog v-model="isAddToOther" class="choosePanel">
        <el-transfer v-model="addToArr" style="text-align: center; display: inline-block"
            :data="songSheetStore.songSheetInfo" target-order="original" filterable :titles="['可选歌单', '已选择']" :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}',
                }" :props="{
            key: '_id',
            label: 'sheetName'
        }"
        @change="checkedItem">
            <template #default="{ option }">
                <div class="transfer-item">
                    <img :src="option.sheetContent.length ? option.sheetContent[option.sheetContent.length - 1].album.picUrl : '/src/assets/avatar.jpg'"
                        alt="">
                    <span>{{ option.sheetName }}</span>
                </div>
            </template>
        </el-transfer>

        <template #footer>
            <el-button @click="isAddToOther = false">取消</el-button>
            <el-button type="primary" @click="submitAdd">添加</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { CaretRight, Plus, VideoPlay, Delete} from '@element-plus/icons-vue';
import { usePlayList } from '@/store/playList';
import { useUser } from '@/store/user';
import { useSongSheet } from '@/store/songSheet';
import { ref } from 'vue';
import api from '@/api';
import sheetComponent from '@/components/sheetComponent.vue';

const playListStore = usePlayList();
const userStore = useUser();
const songSheetStore = useSongSheet();

const isAddToOther = ref(false);
const activeName = ref('song');
const addToArr = ref([]);

const funcObj = {
    removeFunc(id){
        return api.music.reqRemoveSongSheet(id);
    },
    getFunc(){
        return songSheetStore.getSongSheet();
    }
}

function handleRemoveAPI(id){
    return api.music.reqRemoveSongSheet(id);
}
function showOperater(row) {
    row.isShowOpe = true;
};
function HideOperater(row) {
    row.isShowOpe = false;
};
// 播放全部
async function playAll() {
    const result = await playListStore.playAllMusic(userStore.user.myFavorite);
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
async function playingMusic(row) {
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
    const result = await api.user.reqDeleteMyFavorite(row.id);
    console.log(result)
    if (result.state === 200) {
        ElMessage.success('删除成功');
        userStore.getMyFavorite()
    } else {
        ElMessage.error('删除失败');
    }
}

onMounted(()=>{
    userStore.getMyFavorite();
})

// 添加至其他本地歌单中
function addToSongSheets() {
    isAddToOther.value = true

}
function checkedItem(nowValue,direction,moveArr){
    console.log(nowValue,direction,moveArr)
}
async function submitAdd(){
    console.log(addToArr.value)
    const result = await api.music.reqAddToOtherSheet(addToArr.value);
    if(result.state === 200){
        songSheetStore.getSongSheet();
        isAddToOther.value = false;
        ElMessage.success('添加成功');
    }else{
        ElMessage.error('添加失败');
    }
}
</script>

<style lang="less" scoped>
.music-panel {
    width: 100%;
    display: flex;
    flex-direction: column;

    .favorite-list {
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

.choosePanel {
    .transfer-item {
        display: flex;
        align-items: center;
        height: 80px;

        img {
            height: 50px;
        }
    }
}
</style>

<style>


.choosePanel .el-dialog__body{
    display: flex;
    justify-content: center;
    align-items: center;
}

.choosePanel .el-transfer-panel__item {
    height: 80px;
}

.choosePanel .el-transfer-panel__item span {
    top: 16px
}

.tabs-panel .el-tabs__nav-wrap {
    display: flex;
    justify-content: center;
}

.el-tabs__nav-wrap::after {
    height: 1px;
}

.el-tabs__item.is-active {
    color: #80d95b;
}

.el-tabs__item:hover {
    color: #80d95b;
}

.el-tabs__active-bar {
    background-color: #80d95b;
}
</style>