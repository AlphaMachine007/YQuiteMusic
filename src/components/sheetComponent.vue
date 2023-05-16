<template>
    <div class="btn-playList">
        <el-button v-if="!isEditPlayList" size="default" @click="changToEdit" :icon="EditPen">编辑歌单</el-button>
        <el-button v-else type="primary" @click="savePlayList" :icon="Edit">保存</el-button>
    </div>
    <div class="playList-panel">
        <div class="playList-box" @click="checkOrDelete(songSheet)"
            v-for="(songSheet, index) in sheetStore" :key="index">
            <div class="bannerBox">
                <img :src="songSheet.sheetContent.length > 0 ? songSheet.sheetContent[songSheet.sheetContent.length - 1].album.picUrl : '/src/assets/back.jpg'"
                    alt="" class="play-banner">
                <img v-if="!isEditPlayList" src="../assets/play.svg" alt="" class="play-mask">
                <img v-else src="../assets/musicPanel/删除.svg" alt="" class="play-mask">
            </div>
            <span>{{ songSheet.sheetName }}</span>
        </div>
    </div>
</template>

<script setup>
import { Edit, EditPen } from '@element-plus/icons-vue';
import { useSongSheet } from '@/store/songSheet';
const songSheetStore = useSongSheet();
const isEditPlayList = ref(false);
const props = defineProps({
    sheetStore:Object,
    funcObj:Object
})
import router from '@/routes';
function checkOrDelete(row) {
    if (isEditPlayList.value) {
        ElMessageBox.confirm('确认永久删除' + row.sheetName + '歌单吗?', 'warning', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' })
            .then(async () => {
                const result = await props.funcObj.removeFunc(row._id);
                if (result.state === 200) {
                    ElMessage.success('删除成功');
                    props.funcObj.getFunc();
                } else {
                    ElMessage.error('删除失败');
                }
            }).catch(() => {
                ElMessage.info('取消删除');
            })
    } else {
        songSheetStore.sheetDetail = row;
        if(router.currentRoute.value.name == 'CollectMusicList'){
            songSheetStore.sheetDetail.isCollect = true
        }
        localStorage.setItem('YQ_SONGSHEET_INFO', JSON.stringify(row));
        router.push({ path: '/home/songsheet' });
    }
}
function changToEdit() {
    isEditPlayList.value = true;
}
function savePlayList() {
    isEditPlayList.value = false;
}
</script>

<style lang="less" scoped>
.playList-panel {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .playList-box {
        width: 20%;
        margin-bottom: 20px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        .bannerBox {
            width: 100%;
            height: 200px;
            margin-bottom: 10px;
            position: relative;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                padding: 0 10px;
                border-radius: 30px;
            }


            .play-mask {
                position: absolute;
                top: 54px;
                left: 30%;
                width: 40%;
                height: 40%;
                display: none;
            }
        }

        .bannerBox:hover {
            .play-banner {
                filter: brightness(0.5);
                transform: scale(1.1);
                transition: transform .75s cubic-bezier(0, 1, .75, 1);
            }

            .play-mask {
                display: block;
            }
        }

        span {
            font-weight: 500;
            line-height: 20px;
        }
    }

    .playList-box:hover {
        span {
            color: #80d95b;
        }
    }

}
</style>
<style>
.btn-playList {
    display: flex;
    justify-content: end;
    margin-bottom: 15px;
}
</style>