<template>
    <div class="homeBack">
        <div class="main">
            <!-- 顶栏 -->
            <el-row>
                <el-col :span="24">
                    <div class="head-bar">
                        <img src="@/assets/logo.png" class="logo" @click="iconEvent">
                        <div class="right-bar">
                            <el-input v-model="search.keywords" placeholder="输入歌曲名 | 歌手名" clearable :prefix-icon="Search"
                                class="searchInput" @keyup.enter.native="gotoSearch"></el-input>
                            <el-dropdown class="user-tag">
                                <span class="el-dropdown-link">
                                    <img :src="userStore.user.avatar ? userStore.user.avatar : '/src/assets/avatar.jpg'"
                                        alt="" class="head-sculpture">
                                    <span style="flex-shrink:0 ">{{ userStore.user.name || '游客' }}</span>
                                    <el-icon class="el-icon--right">
                                        <arrow-down />
                                    </el-icon>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="gotoUserPage">
                                            <el-icon class="el-icon--right">
                                                <user />
                                            </el-icon>
                                            个人资料
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoChat">
                                            <el-icon class="el-icon--right">
                                                <ChatDotRound />
                                            </el-icon>
                                            消息
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoJoinCloud">
                                            <el-icon class="el-icon--right">
                                                <Opportunity />
                                            </el-icon>
                                            登录云账号
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="userLogout">退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row class="content">
                <!-- 侧边栏 -->
                <Nav :isCollapse="isCollapse" @showAddSheet="showAddSheet" @showImportPlayList="showImportPlayList"
                    class="showNav"></Nav>
                <!-- 主体部分 -->
                <div class="content-body">
                    <BreadCrumb :isCollapse="isCollapse" @changeCollapse="changeCollapse"></BreadCrumb>
                    <el-scrollbar :max-height="maxHeight">
                        <router-view></router-view>
                    </el-scrollbar>
                </div>
            </el-row>
            <Footer class="footer"></Footer>
        </div>
        <el-drawer class="menu-drawer" v-model="drawer" title="菜单" direction="ltr" size="50%" :with-header="false">
            <Nav :isCollapse="isCollapse" @showAddSheet="showAddSheet" @showImportPlayList="showImportPlayList"></Nav>
        </el-drawer>
        <el-dialog v-model="isShowAddSheet">
            <div class="inputPanel">
                <span>请输入歌单名称</span><br />
                <el-input v-model="sheetName" placeholder="" clearable style="width: 50%;"></el-input>
            </div>

            <template #footer>
                <el-button @click="isShowAddSheet = false">取消</el-button>
                <el-button type="primary" @click="createSongSheet">确定</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="isShowImportPlayList">
            <div class="inputPanel">
                <span>请输入网易云歌单网址</span><br />
                <el-input v-model="sheetURL" placeholder="请输入URL" clearable style="width: 50%;"></el-input>
            </div>
            <template #footer>
                <el-button @click="isShowImportPlayList = false">取消</el-button>
                <el-button type="primary" @click="importByUrl">导入</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script setup name="home">
import {
    Menu as IconMenu,
    Search,
    ArrowDown,
    ChatDotRound,
    User,
    Opportunity
} from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import router from '@/routes';
import api from '@/api';
import transformTime from '@/utils/transformTime';
// pinia
import { useUser } from '@/store/user';
import { useMainContent } from '@/store/mainContent';
import { useSearch } from '@/store/search';
import { usePlayList } from '@/store/playList';
import { useSongSheet } from '@/store/songSheet';
import { useCollectSheet } from '@/store/collectSheet';
import { useCloudMusic } from '@/store/cloudMusic';

let isShowAddSheet = ref(false);
let isShowImportPlayList = ref(false);
let isCollapse = ref(false);
let maxHeight = ref('600px');
let drawer = ref(false);
let windowWidth = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
let sheetName = ref('');
let sheetURL = ref('');

const userStore = useUser();
const contentStore = useMainContent();
const search = useSearch();
const playListStore = usePlayList();
const songSheetStore = useSongSheet();
const collectSheetStore = useCollectSheet();
const cloudMusic = useCloudMusic();

onMounted(() => {
    localStorage.removeItem('YQ_SEACHKINDS');
    userStore.getUserInfo();
    contentStore.getBanner();
    userStore.getMyFavorite();
    playListStore.getPlayList();
    songSheetStore.getSongSheet();
    collectSheetStore.getCollectSheet();
    if (!cloudMusic.cloudUser.isLogin) {
        cloudMusic.getVisitorCookie();
    }
    if(JSON.stringify(playListStore.playingMusic) == '{}' || !playListStore.playingMusic){
        playListStore.playingMusic = JSON.parse(localStorage.getItem('YQ_PLAYINGMUSIC'));
        playListStore.playingMusicInfo = JSON.parse(localStorage.getItem('YQ_PLAYINGMUSIC_INFO'))
    }
    window.onresize = () => {
        return (() => {
            windowWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        })()
    }
});

function showAddSheet(isClick) {
    isShowAddSheet.value = isClick;
}
function showImportPlayList(isClick) {
    isShowImportPlayList.value = isClick;
}
function changeCollapse(collapse) {
    isCollapse.value = collapse;
}
// 跳转到个人资料
function gotoUserPage() {
    router.push({ path: '/home/userpage' });
}
// 跳转到消息
function gotoChat(){
    router.push({path:'/home/chatroom'});
}
// 跳转到登录云账号
function gotoJoinCloud() {
    router.push({ path: '/home/joincloud' });
}
// 退出登录
function userLogout() {
    router.push('/login');
    userStore.userLogout();
}
function iconEvent() {
    if (window.innerWidth <= 768) {
        drawer.value = true;
    } else {
        router.push({ path: '/home' });
    }
}
// 搜索
async function gotoSearch() {
    localStorage.setItem('YQ_SEACHKEYWORDS', search.keywords);
    if (JSON.parse(localStorage.getItem('YQ_SEACHKINDS')) == 517) {
        await search.searchUser();
    } else {
        router.push({ path: '/home/searchpage' });
        localStorage.setItem('YQ_SEACHKINDS', 1);
        await search.searchInfo();
    }
}
// 创建歌单
async function createSongSheet() {
    const result = await api.music.reqCreateSongSheet({ sheetName: sheetName.value });
    if (result.state === 200) {
        ElMessage.success('歌单' + sheetName.value + '创建成功');
        songSheetStore.getSongSheet();
        sheetName.value = '';
        isShowAddSheet.value = false;
    } else {
        ElMessage.error('歌单创建失败');
    }
}
// 通过URL导入歌单
function importByUrl() {
    const sheetId = sheetURL.value.split('id=')[1];
    collectToSheet(sheetId);
}
async function collectToSheet(id) {
    const sendCollectSheet = {
        _id: id,
        userId: userStore.user._id,
        sheetName: '',
        sheetContent: [],
        sheetDescribe: '',
        sheetCreator: '',
        playNum: 0,
        sheetCreatedTime: ''
    }
    const resultA = await api.music.reqGetSheetDetail({ sheetId: id });
    if (resultA.code == 200) {
        sendCollectSheet.sheetName = resultA.playlist.name;
        sendCollectSheet.sheetDescribe = resultA.playlist.description;
        sendCollectSheet.sheetCreator = resultA.playlist.creator.nickname;
        sendCollectSheet.playNum = resultA.playlist.playCount;
        sendCollectSheet.sheetCreatedTime = new Date(resultA.playlist.createTime).toLocaleString();
    }
    const resultB = await api.music.reqGetSheetAllMusic({ sheetId: id });
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
        ElMessage.success('导入成功');
        collectSheetStore.getCollectSheet();
        isShowImportPlayList.value = false;
    } else {
        ElMessage.error('导入失败');
    }
}

watch(windowWidth, (newValue, oldValue) => {
    if (newValue > 768) {
        drawer.value = false
    }
})
watch(()=>userStore.user,()=>{
    if(!userStore.user.avatar){
        userStore.getAvatar();
    }
})
</script>

<style lang="less">
.menu-drawer .el-drawer__body {
    padding: 0;
}
</style>

<style lang="less" scoped>
.homeBack {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('@/assets/homeBack2.jpg') no-repeat;
    background-size: cover;
    background-position: 50% 50%;

    .main {
        width: 97%;
        height: 97%;
        border-radius: 1%;
        border: 1px black solid;
        background-color: white;
        display: flex;
        flex-direction: column;

        .content {
            flex: 1;
            flex-wrap: nowrap;

            .content-body {
                padding: 10px;
                flex: 1;
            }
        }

        .flex-grow {
            flex-grow: 1;
        }

        .head-bar {
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px #DFDFDF solid;

            .right-bar {
                display: flex;
                align-items: center;

                .user-tag {
                    width: 200px;
                    margin-left: 10px;
                }

                .searchInput {
                    height: 40px;
                }

                .el-dropdown-link {
                    cursor: pointer;
                    color: var(--el-color-primary);
                    display: flex;
                    align-items: center;

                    span {
                        margin-left: 10px;
                        color: black;
                    }
                }
            }

            .logo {
                cursor: pointer;
                width: 50px;
                height: 50px;
                margin-left: 5px;
            }

            .head-sculpture {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }

    }

    .inputPanel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}


@media screen and (max-width:768px) {
    .showNav {
        display: none;
    }

    .main {
        width: 100% !important;
        height: 100% !important;
        border: 0 !important;

        .content-body {
            margin-bottom: 80px;
        }
    }

    .footer {
        position: fixed;
        bottom: 0;
        background-color: white;
    }

}
</style>