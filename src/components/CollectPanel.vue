<template>
    <div>
        <div class="Favorite" @click="addToMyFavorite">
            <div class="favoriteImg">
                <img src="@/assets/avatar.jpg" alt="">
            </div>
            <span>我的最爱</span>
        </div>
        <el-table :data="songSheetStore.songSheetInfo" border stripe>
            <el-table-column>
                <template #default="scope" label="歌单">
                    <div class="Favorite" @click="addToSongSheet(scope.row)">
                        <div class="favoriteImg">
                            <img :src="scope.row.sheetContent.length > 0 ? scope.row.sheetContent[scope.row.sheetContent.length-1].album.picUrl : '/src/assets/back.jpg'" alt="">
                        </div>
                        <span>{{ scope.row.sheetName }}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { usePlayList } from '@/store/playList';
import { useUser } from '@/store/user';
import { useSongSheet } from '@/store/songSheet';
import api from '@/api';
import { ElMessage } from 'element-plus';

const playListStore = usePlayList();
const userStore = useUser();
const songSheetStore = useSongSheet();

const emit = defineEmits(['closeDialog']);

async function addToMyFavorite() {
    const addData = {
        id: playListStore.preToAdd.id,
        name: playListStore.preToAdd.name,
        singer: playListStore.preToAdd.ar || playListStore.preToAdd.singer,
        album: playListStore.preToAdd.al || playListStore.preToAdd.album,
        time: playListStore.preToAdd.dt || playListStore.preToAdd.time,
        isShowOpe: false
    }
    const result = await api.user.reqAddMyFavorite(addData);
    if (result.state === 200) {
        ElMessage.success('添加成功');
        userStore.getMyFavorite();
    } else {
        ElMessage.error('添加失败')
    }
}
async function addToSongSheet(row){
    console.log(row);
    const addData = {
        songSheetId:row._id,
        id: playListStore.preToAdd.id,
        name: playListStore.preToAdd.name,
        singer: playListStore.preToAdd.ar || playListStore.preToAdd.singer,
        album: playListStore.preToAdd.al || playListStore.preToAdd.album,
        time: playListStore.preToAdd.dt || playListStore.preToAdd.time,
        isShowOpe: false
    }
    const result = await api.music.reqAddToSongSheet(addData);
    if(result.state === 200){
        ElMessage.success('添加成功');
        songSheetStore.getSongSheet();
        emit('closeDialog');
    }else{
        ElMessage.error('添加失败');
    }
}
</script>

<style lang="less" scoped>
.Favorite {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;

    .favoriteImg {
        width: 100px;
        padding: 10px;

        img {
            width: 100%;
            height: 80px;
        }
    }

    span {
        margin-left: 20px;
        font-size: 18px;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.Favorite:hover {
    background-color: #EFEFEF;
}
</style>