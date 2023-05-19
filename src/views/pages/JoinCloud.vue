<template>
    <div class="cloud-panel">
        <div class="join-box">
            <div class="box-left">
            </div>
            <div class="box-right">
                <div class="unlogin" v-show="!cloudMusicStore.cloudUser.isLogin">
                    <span>请扫描下方二维码登录网易云音乐账号</span>
                    <img :src="QRImg" alt="">
                    <span v-show="isExpire" style="color: #ea8482;">已过期</span>
                </div>
                <div class="login" v-show="cloudMusicStore.cloudUser.isLogin">
                    <h2>账号信息</h2>
                    <img :src="cloudMusicStore.cloudUser.profile ? cloudMusicStore.cloudUser.profile.avatarUrl : '/src/assets/avatar.jpg'"
                        alt="avator">
                    <span>账号名称:{{ cloudMusicStore.cloudUser.profile ? cloudMusicStore.cloudUser.profile.nickname : '匿名'
                    }}</span>
                    <span>性别:{{ cloudMusicStore.cloudUser.profile ? (cloudMusicStore.cloudUser.profile.gender ? '🚹' : '🚺'
                    ) : '🚹' }}</span>
                    <span>所在地区邮编:{{ cloudMusicStore.cloudUser.profile ? cloudMusicStore.cloudUser.profile.city : '000000'
                    }}</span>
                    <span>创建时间:{{ (new Date(cloudMusicStore.cloudUser.profile ? cloudMusicStore.cloudUser.profile.createTime
                        : 0)).toLocaleString() }}</span>
                    <el-button type="warning" size="small" @click="importCloudPlayList">导入歌单</el-button>

                    <el-button type="danger" size="small" @click="cloudLogout">退出登录</el-button>
                </div>
            </div>
        </div>
        <el-dialog v-model="isImport" width="35%">
            <el-table :data="accountPlayList" border stripe ref="multipleTableRef" max-height="350"
                @selection-change="handleSelectionChange" v-loading="loadImport">
                <el-table-column type="selection" width="55" />
                <el-table-column label="歌单">
                    <template #default="scope">
                        <div class="playlist-item">
                            <img :src="scope.row.coverImgUrl" alt="">
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <template #footer>
                <el-button @click="isImport = false;" style="margin-right: 12px;">取消</el-button>
                <el-button type="primary" @click="importList">导入</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import { useCloudMusic } from '@/store/cloudMusic';
import { useCollectSheet } from '@/store/collectSheet'; 
import { useUser } from '@/store/user';
import api from '@/api';
import transformTime from '@/utils/transformTime';
import { ElMessage } from 'element-plus';

const cloudMusicStore = useCloudMusic();
const collectSheetStore = useCollectSheet();
const userStore = useUser();

const QRImg = ref('/src/assets/logo.png');
const isExpire = ref(false);
const isImport = ref(false);
const loadImport = ref(false);
const accountPlayList = ref([]);
const importPlayList = ref([]);

onMounted(() => {
    Login();
})

async function Login() {
    let timer;
    isExpire.value = false;
    const cookie = localStorage.getItem('cookie');
    const cloudStatus = await cloudMusicStore.getLoginStatus(cookie);
    cloudMusicStore.cloudUser.account = cloudStatus.account;
    cloudMusicStore.cloudUser.profile = cloudStatus.profile;
    if (cloudStatus.profile == null) {
        const result = await cloudMusicStore.getUnikey();
        let key = '';
        if (result.code == 200) {
            key = result.data.unikey;
        };
        const resultB = await cloudMusicStore.getQRCode(key);
        if (resultB.code == 200) {
            QRImg.value = resultB.data.qrimg;
        };
        timer = setInterval(async () => {
            const statusRes = await cloudMusicStore.checkQRCode(key);
            if (statusRes.code == 800) {
                isExpire.value = true;
                clearInterval(timer);
            } else if (statusRes.code == 803) {
                clearInterval(timer);
                const loginRes = await cloudMusicStore.getLoginStatus(statusRes.cookie);
                cloudMusicStore.cloudUser.account = loginRes.account;
                cloudMusicStore.cloudUser.profile = loginRes.profile;
                cloudMusicStore.cloudUser.isLogin = true;
                localStorage.setItem('YQ_CLOUD_STATUS', true);
                localStorage.setItem('cookie', statusRes.cookie);
                const playListRes = cloudMusicStore.getCloudPlayList(cloudMusicStore.cloudUser.account.id);
                ElMessageBox.confirm('检测到云账户中歌单，是否导入', '导入歌单', {
                    confirmButtonText: '导入',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    importCloudPlayList();
                }).catch(() => {
                    ElMessage.info('取消导入')
                })
            }
        }, 3000)
    }
}
async function cloudLogout() {
    const cookie = localStorage.getItem('cookie');
    const result = await cloudMusicStore.cloudLogout(cookie);
    if (result.code == 200) {
        cloudMusicStore.cloudUser.isLogin = false;
        localStorage.setItem('YQ_CLOUD_STATUS', false);
        localStorage.removeItem('cookie');
        cloudMusicStore.getVisitorCookie();
        ElMessage.success('退出云账号成功');
        Login();
    }
}
function handleSelectionChange(selection) {
    importPlayList.value = selection;
}
async function importCloudPlayList() {
    const playListRes = await cloudMusicStore.getCloudPlayList(cloudMusicStore.cloudUser.account.id);
    if (playListRes.code == 200) {
        accountPlayList.value = playListRes.playlist;
        isImport.value = true;
    }
}
async function importList(){
    loadImport.value = true;
    let collectList = [];
    collectList = importPlayList.value.map(elem=>{
        return elem.id
    })
    for(const element of collectList){
        await collectToSheet(element);
    }
    await collectSheetStore.getCollectSheet();
    loadImport.value = false;
    ElMessage.success('导入成功');
    isImport.value = false;
}
async function collectToSheet(id) {
    const sendCollectSheet = {
        _id:id,
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
    return result;
}
</script>

<style lang="less" scoped>
.cloud-panel {
    width: 100%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2e2ba;

    .join-box {
        width: 70%;
        display: flex;
        height: 500px;
        background-color: #f2e2ba;
        border-radius: 10px;
        border: 1px solid #DFDFDF;

        .box-left {
            width: 50%;
            height: 100%;
            background: url('../../assets/musicPanel/flamingos-2.gif') no-repeat;
            background-size: cover;
            border-radius: 10px;
        }

        .box-right {
            width: 50%;
            height: 100%;
            border-radius: 10px;

            .login,
            .unlogin {
                width: 100%;
                height: 100%;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: whitesmoke;
            }

            .unlogin {
                span {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 30px;
                }

                img {
                    width: 60%;
                    margin-bottom: 10px;
                }
            }

            .login {
                span {
                    line-height: 30px;
                    font-size: 20px;
                    margin-bottom: 5px;
                    margin-top: 5px;
                    font-family: '华文新魏';
                }
                img {
                    width: 100px;
                    height: 100px;
                }
            }
        }
    }

    .playlist-item {
        display: flex;
        align-items: center;

        img {
            width: 50px;
            height: 50px;
        }

        span {
            margin-left: 20px;
        }
    }
}
.el-button {
    margin-left: 0 !important;
    margin-top: 10px;
}
</style>
