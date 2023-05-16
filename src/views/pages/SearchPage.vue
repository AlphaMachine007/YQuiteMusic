<template>
    <div class="searchPane">
        <div class="searchBox">
            <el-card shadow="always" class="searchCard">
                <el-button color="#2B8CF7" :icon="CaretRight" v-show="searchList.length && activeTab == '1'"
                    class="playall-btn" @click="playAll">播放全部</el-button>

                <el-tabs v-model="activeTab" type="border-card" @tab-change="changeTab">
                    <el-tab-pane label="单曲" name="1">
                        <el-empty v-if="search.keywords == ''" description="请输入搜索关键词"/>
                        <el-table v-else :data="searchList" stripe style="width: 100%" v-loading="search.loading">
                            <el-table-column width="40">
                                <template #default="scope">
                                    <el-icon class="playBtn" @click="addAndPlay(scope.row)">
                                        <VideoPlay />
                                    </el-icon>
                                </template>
                            </el-table-column>
                            <el-table-column label="歌曲">
                                <template #default="scope">
                                    <a href="" class="song-name">{{ scope.row.name }}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="歌手">
                                <template #default="scope">
                                    <span v-for="(singer, index) in scope.row.ar">
                                        <a class="singer-name">{{ singer.name }}</a><span
                                            v-if="index != scope.row.ar.length - 1">/</span>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="al.name" label="专辑" />
                            <el-table-column prop="dt" label="时长" />
                            <el-table-column label="操作">
                                <template #default="scope">
                                    <el-tooltip content="添加到播放列表" placement="bottom" effect="light">
                                        <el-icon size="18" class="edit-icon" @click="addToPlayList(scope.row)">
                                            <Plus />
                                        </el-icon>
                                    </el-tooltip>

                                    <el-tooltip content="收藏" placement="bottom" effect="light">
                                        <el-icon size="18" class="edit-icon" @click="addToCollectPlayLists(scope.row)">
                                            <FolderAdd />
                                        </el-icon>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="歌手" name="100">
                        <el-empty v-if="search.keywords == ''" description="请输入搜索关键词"/>
                        <div v-else class="artistPanel" v-loading="search.loading">
                            <div class="artistBox" v-for="artist in search.searchArr">
                                <img :src="artist.picUrl" alt="">
                                <span>{{ artist.name }}</span>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="歌单" name="1000">
                        <el-empty v-if="search.keywords == ''" description="请输入搜索关键词"/>
                        <el-table v-else :data="playList" stripe v-loading="search.loading" @cell-mouse-enter="showOperater"
                            @cell-mouse-leave="HideOperater">
                            <el-table-column width="40">
                                <template #default="scope">
                                    <el-icon class="playBtn">
                                        <VideoPlay />
                                    </el-icon>
                                </template>
                            </el-table-column>
                            <el-table-column label="歌单">
                                <template #default="scope">
                                    <div class="banner-title">
                                        <img :src="scope.row.coverImgUrl" alt="" style="width: 80px;height: 80px;">
                                        <a @click="checkSheetContent(scope.row)">{{ scope.row.name }}</a>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100">
                                <template #default="scope">
                                    <div v-show="scope.row.showOper">
                                        <el-tooltip content="添加到播放列表" placement="bottom" effect="light">
                                            <el-icon size="18" class="edit-icon" @click="SAddToPlayList(scope.row)">
                                                <Plus />
                                            </el-icon>
                                        </el-tooltip>
                                        <el-tooltip content="收藏到歌单" placement="bottom" effect="light">
                                            <el-icon size="18" class="edit-icon" @click="collectToSheet(scope.row)">
                                                <FolderAdd />
                                            </el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="歌曲数" prop="trackCount" />
                            <el-table-column label="创建者" prop="creator.nickname" />
                            <el-table-column label="播放量" prop="playCount" sortable width="100" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="专辑" name="10">
                        <el-empty v-if="search.keywords == ''" description="请输入搜索关键词"/>
                        <div v-else class="albumPanel">
                            <div class="albumBox" v-for="album in search.searchArr" @click="gotoAlbum(album)">
                                <div class="bannerBox">
                                    <img :src="album.picUrl" alt="" class="album-banner">
                                    <img src="../../assets/play.svg" alt="" class="play-mask">
                                </div>
                                <span class="album-title">{{ album.name }}</span>
                                <span class="album-publishTime">{{ (new Date(album.publishTime)).toLocaleDateString()
                                }}</span>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="用户" name="517">
                        <el-empty v-if="search.keywords == ''" description="请输入搜索关键词"/>
                        <div v-else class="artistPanel" v-loading="search.loading">
                            <div class="artistBox" v-for="user in search.searchArr" @click="toSearchUser(user)">
                                <img :src="user.avatar ? (user.avatar.length > 25 ? user.avatar : '/src/assets/avatar.jpg') : '/src/assets/avatar.jpg'"
                                    alt="">
                                <span>{{ user._doc ? user._doc.name : (user.name ? user.name : '') }}</span>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="pagination">
                    <Pagination />
                </div>
            </el-card>
        </div>
        <el-dialog v-model="showCollect" title="收藏到歌单" width="30%">
            <CollectPanel @closeDialog="closeDialog"></CollectPanel>
        </el-dialog>

    </div>
</template>

<script setup>
import { useSearch } from '@/store/search';
import { useUser } from '@/store/user';
import { usePlayList } from '@/store/playList';
import { useCollectSheet } from '@/store/collectSheet';
import { useSearchUser } from '@/store/searchUser';
import { useAlbum } from '@/store/album';
import { VideoPlay, CaretRight, Plus, FolderAdd } from '@element-plus/icons-vue';
import Pagination from '@/components/Pagination.vue';
import { onUnmounted, onMounted } from 'vue';
import CollectPanel from '@/components/CollectPanel.vue';
import transformTime from '@/utils/transformTime';
import checkSheetContent from '@/utils/checkSheetContent';
import api from '@/api';
import router from '@/routes';

const search = useSearch();
const userStore = useUser();
const playListStore = usePlayList();
const collectSheetStore = useCollectSheet();
const searchUser = useSearchUser();
const albumStore = useAlbum();

const showCollect = ref(false);

const searchList = ref(getSearchList())
const playList = ref(getPlayList())
const activeTab = ref('1');

async function playAll(){
    const sendArr = search.searchArr.map(elem=>{
        return{
            album:elem.al,
            id:elem.id,
            isShowOpe:false,
            name:elem.name,
            singer:elem.ar,
            time:elem.dt
        }
    })
    console.log(sendArr);
    const result = await playListStore.playAllMusic(sendArr);
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

function changeTab(index) {
    if (index == 1) {
        search.changeType(1);
        activeTab.value = '1';
        localStorage.setItem('YQ_SEACHKINDS', 1);
        search.searchInfo()
    } else if (index == 100) {
        search.changeType(100);
        activeTab.value = '100';
        localStorage.setItem('YQ_SEACHKINDS', 100);
        search.searchInfo()
    } else if (index == 1000) {
        search.changeType(1000);
        activeTab.value = '1000';
        localStorage.setItem('YQ_SEACHKINDS', 1000);
        search.searchInfo()
    } else if (index == 10) {
        search.changeType(10);
        activeTab.value = '10';
        localStorage.setItem('YQ_SEACHKINDS', 10);
        search.searchInfo()
    } else {
        search.changeType(517);
        activeTab.value = '517'
        localStorage.setItem('YQ_SEACHKINDS', 517);
        search.searchUser();
    }
}

async function addAndPlay(row){
    const playList = {
        userId: userStore.user._id,
        playLists: {
            id: row.id,
            name: row.name,
            singer: row.ar,
            album: row.al,
            time: row.dt,
        }
    }
    const result = await playListStore.addToPlayList(playList)
    if(result.state == 200){
        await playListStore.getPlayList();
        playListStore.playingMusicIndex = playListStore.playList[playListStore.playList.length-1].index;
        playListStore.playingMusic = playListStore.playList[playListStore.playList.length-1];
        playListStore.currentTime = 0;
        playListStore.currentIndex = 0;
        localStorage.setItem('YQ_PLAYINGMUSIC', JSON.stringify(playListStore.playList[playListStore.playList.length-1]));
    }
}

function getSearchList(searchTemp = search.searchArr) {
    return searchTemp.map((elem) => {
        elem.dt = transformTime(elem.dt);
        return elem
    })
}
function getPlayList(listTemp = search.searchArr) {
    return listTemp.map((elem) => {
        elem.showOper = false;
        return elem;
    });
}

function showOperater(row) {
    row.showOper = true
}
function HideOperater(row) {
    row.showOper = false
}
async function addToPlayList(row) {
    const playList = {
        userId: userStore.user._id,
        playLists: {
            id: row.id,
            name: row.name,
            singer: row.ar,
            album: row.al,
            time: row.dt,
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
    playListStore.getPlayList();
}
function addToCollectPlayLists(row) {
    showCollect.value = true;
    playListStore.preToAdd = row;
}
function closeDialog() {
    showCollect.value = false
}

// 收藏歌单
async function collectToSheet(row) {
    const sendCollectSheet = {
        _id: row.id,
        userId: userStore.user._id,
        sheetName: '',
        sheetContent: [],
        sheetDescribe: '',
        sheetCreator: '',
        playNum: 0,
        sheetCreatedTime: ''
    }
    const resultA = await api.music.reqGetSheetDetail({ sheetId: row.id });
    if (resultA.code == 200) {
        sendCollectSheet.sheetName = resultA.playlist.name;
        sendCollectSheet.sheetDescribe = resultA.playlist.description;
        sendCollectSheet.sheetCreator = resultA.playlist.creator.nickname;
        sendCollectSheet.playNum = resultA.playlist.playCount;
        sendCollectSheet.sheetCreatedTime = new Date(resultA.playlist.createTime).toLocaleString();
    }
    const resultB = await api.music.reqGetSheetAllMusic({ sheetId: row.id });
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
    } else {
        ElMessage.error('收藏失败');
    }
}
async function SAddToPlayList(row) {
    const result = await api.music.reqGetSheetAllMusic({ sheetId: row.id });
    if (result.code == 200) {
        const musicArr = result.songs.map(elem => {
            return {
                id: elem.id,
                name: elem.name,
                singer: elem.ar,
                album: elem.al,
                time: transformTime(elem.dt),
                isShowOpe: false
            }
        })
        playListStore.addManyMusic(musicArr);
    }
}
// 搜索用户界面
function toSearchUser(row) {
    router.push({ path: '/home/searchuserpage' });
    searchUser.getUserInfo(row);
    localStorage.setItem('SEARCHED_USER', JSON.stringify(row));
}
async function gotoAlbum(row) {
    const result = await albumStore.getAlbumById(row.id);
    console.log(result)
    if (result.code == 200) {
        result.isAlbum = true;
        console.log(result);
        checkSheetContent(result);
    }
}
watch(() => search.searchArr, (newValue) => {
    if (newValue && newValue.length > 0) {
        if (newValue[0].hasOwnProperty('mark')) {
            searchList.value = getSearchList(newValue);
        }
        if (newValue[0].hasOwnProperty('coverImgUrl')) {
            playList.value = getPlayList(newValue);
        }
    }
});

watch(() => search.type, (newValue, oldValue) => {
    console.log(newValue, oldValue)
    activeTab.value = newValue + '';
})

onMounted(() => {
    if (search.keywords == '') {
        search.keywords = localStorage.getItem('YQ_SEACHKEYWORDS');
        search.type = localStorage.getItem('YQ_SEACHKINDS');
        if (search.keywords != null && search.keywords != '' && search.keywords != undefined && search.type != 517) {
            search.searchInfo();
        } else {
            search.searchUser();
        }
    }
})

onUnmounted(() => {
    // 离开后删除搜索遗留数据，避免重复处理数据
    search.searchArr = []
    localStorage.removeItem('YQ_SEACHKEYWORDS');
    localStorage.removeItem('YQ_SEACHKINDS');
    search.type = 1;
    search.keywords = '';
})
</script>

<style lang="less" scoped>
.searchPane {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    background-color: #EFEFEF;

    .searchBox {
        width: 80%;

        .searchCard {
            .banner-title {
                display: flex;
                align-items: center;

                a {
                    margin-left: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .pagination {
                display: flex;
                justify-content: center;
                margin-top: 20px;
            }

            .artistPanel {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                .artistBox {
                    width: 20%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                    cursor: pointer;
                    text-align: center;
                    overflow: hidden;

                    img {
                        width: 90%;
                        height: 180px;
                        border-radius: 5px;
                        margin-top: 10px;
                    }
                }

                .artistBox:hover {
                    span {
                        color: #b8b025;
                    }

                    img {
                        transform: translateY(-5px);
                        filter: opacity(0.9);
                    }
                }
            }

            .albumPanel {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                .albumBox {
                    width: 18%;
                    display: flex;
                    flex-direction: column;
                    border-radius: 5px;
                    cursor: pointer;
                    text-align: center;
                    margin: 1%;

                    .bannerBox {
                        width: 100%;
                        height: 180px;
                        overflow: hidden;
                        position: relative;

                        .play-mask {
                            position: absolute;
                            top: 54px;
                            left: 30%;
                            width: 40%;
                            height: 40%;
                            display: none;
                        }

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 5px;
                        }
                    }

                    .bannerBox:hover {

                        .album-banner {
                            filter: brightness(0.5);
                            transform: scale(1.1);
                            transition: transform .75s cubic-bezier(0, 1, .75, 1);
                        }

                        .play-mask {
                            display: block;
                        }
                    }

                    .album-title {
                        font-size: 16px;
                    }

                    .album-publishTime {
                        color: #aaa;
                    }
                }
            }
        }

        .playall-btn {
            margin-bottom: 10px;
        }

        .playBtn {
            cursor: pointer;
        }

        .song-name {
            color: #d3c800; //#b8b025
        }

        .edit-icon {
            margin-right: 10px;
            cursor: pointer;
        }

        .singer-name {
            color: black;
        }
    }


}
</style>