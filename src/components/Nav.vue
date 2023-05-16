<template>
    <el-menu default-active="2" class="el-menu-vertical-demo"
        :collapse="isCollapse">
        <el-menu-item index="1" @click="gotoHomePage">
            <el-icon><icon-menu /></el-icon>
            <template #title>主页</template>
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>我的音乐</span>
            </template>
            <el-menu-item-group title="本地音乐">
                <el-menu-item index="2-1" @click="gotoMyFavorite">我的最爱</el-menu-item>
                <!-- <el-menu-item :index="'2-'+(index+2)" v-for="(songSheet,index) in songSheetStore.songSheetInfo" :key="index" @click="gotoSheetPage(songSheet)">{{ songSheet.sheetName }}</el-menu-item> -->
            </el-menu-item-group>
        </el-sub-menu>

        <el-menu-item index="3" @click="addSongSheet">
            <el-icon>
                <Plus />
            </el-icon>
            <template #title>
                创建歌单
            </template>
        </el-menu-item>
        <el-sub-menu index="4">
            <template #title>
                <el-icon>
                    <Star />
                </el-icon>
                <span>收藏歌单</span>
            </template>
            <el-menu-item-group>
                <el-menu-item v-show="index <= 3" class="collect-title" :message="collectSheet.sheetName" :index="'4-'+(index+1)" v-for="(collectSheet,index) in collectSheetStore.collectSheetInfo" :key="index" @click="gotoCollectSheet(collectSheet)">
                    <template #title>
                        <span>{{ collectSheet.sheetName.length <=6 ? collectSheet.sheetName : collectSheet.sheetName.slice(0,5)+ '...' }}</span>
                    </template>
                </el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="5" @click="gotoDiscovery">
            <el-icon>
                <Stopwatch />
            </el-icon>
            <template #title>
                发现
            </template>
        </el-menu-item>
        <el-menu-item index="6" @click="importPlayListFromUrl">
            <el-icon>
                <Link />
            </el-icon>
            <template #title>
                导入歌单
            </template>
        </el-menu-item>
    </el-menu> 
</template>

<script setup>
import router from '@/routes';
import {
    Menu as IconMenu,
    Location,
    Star,
    Plus,
    Stopwatch,
    Link
} from '@element-plus/icons-vue'
import { useSongSheet } from '@/store/songSheet';
import { useCollectSheet } from '@/store/collectSheet';

defineProps({
    isCollapse: Boolean
});
const emit = defineEmits(['showAddSheet','showImportPlayList']);

const songSheetStore = useSongSheet();
const collectSheetStore = useCollectSheet();

function gotoHomePage(){
    router.push({path:'/home'})
};
function gotoMyFavorite(){
    router.push({path:'/home/userpage/mymusic'})
};
function addSongSheet(){
    emit('showAddSheet',true);
};
function gotoSheetPage(sheet){
    songSheetStore.sheetDetail = sheet;
    localStorage.setItem('YQ_SONGSHEET_INFO',JSON.stringify(sheet));
    router.push({path:'/home/songsheet'})
};
function gotoCollectSheet(sheet){
    sheet.isCollect = true;
    songSheetStore.sheetDetail = sheet;
    localStorage.setItem('YQ_SONGSHEET_INFO',JSON.stringify(sheet));
    router.push({path:'/home/songsheet'})
}
function gotoDiscovery(){
    router.push({path:'/home/discovery'});
}
function importPlayListFromUrl(){
    emit('showImportPlayList',true);
}
</script>

<style lang="less" scoped>
.nav {
    border-right: 1px #DFDFDF solid;
    .el-menu-vertical-demo {
        border: 0;
    }
}
</style>
<style>
.collect-title span{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>