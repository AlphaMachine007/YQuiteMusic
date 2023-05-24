<template>
    <div class="search-panel">
        <div class="base-info">
            <div class="info-left">
                <img :src="searchUser.userInfo.avatar ? (searchUser.userInfo.avatar.length > 25 ? searchUser.userInfo.avatar : defaultAvatar) : defaultAvatar"
                    alt="">
            </div>
            <div class="info-right">
                <div class="base-top">
                    <span>{{ searchUser.userInfo._doc ? searchUser.userInfo._doc.name : (searchUser.userInfo.name ?
                        searchUser.userInfo.name : '') }}</span>
                    <span
                        v-if="(searchUser.userInfo._doc ? searchUser.userInfo._doc.sex : searchUser.userInfo.sex) == 1">🚹</span>
                    <span v-else>🚺</span>
                    <el-button size="small" @click="chatWithTheUser" :icon="ChatLineRound">私信</el-button>
                    <el-button
                        v-show="!isFocus && (searchUser.userInfo._doc ? searchUser.userInfo._doc._id : searchUser.userInfo._id) != userStore.user._id"
                        type="primary" size="small" @click="focusUser">关注</el-button>
                    <el-button v-show="isFocus" color="lightblue" type="primary" size="small"
                        @click="unFocusUser">已关注</el-button>
                </div>
                <div class="base-center">
                    <div class="focues-box">
                        <span>{{ searchUser.userInfo._doc ? searchUser.userInfo._doc.focusNum :
                            (searchUser.userInfo.focusNum ? searchUser.userInfo.focusNum : 0) }}</span>
                        <span>关注</span>
                    </div>
                    <div class="fans-box">
                        <span>{{ searchUser.userInfo._doc ? searchUser.userInfo._doc.fansNum : (searchUser.userInfo.fansNum
                            ? searchUser.userInfo.fansNum : 0) }}</span>
                        <span>粉丝</span>
                    </div>
                </div>
                <div class="base-bottom">
                    <span>身份: {{ searchUser.userInfo._doc ? searchUser.userInfo._doc.status : (searchUser.userInfo.status
                        ? searchUser.userInfo.status : '未知') }}</span>
                    <span>简介: {{ searchUser.userInfo._doc ? searchUser.userInfo._doc.description :
                        (searchUser.userInfo.description
                            ? searchUser.userInfo.description : '...') }}</span>
                </div>
            </div>
        </div>
        <div class="create-sheet">
            <div class="title">
                创建的歌单
            </div>
            <div class="sheet-content" :class="{ 'flex-center': songSheetStore.searchSongSheetInfo.length <= 0 }">
                <div v-if="songSheetStore.searchSongSheetInfo.length > 0" class="playList-box"
                    @click="checkSongSheet(songSheet)" v-for="songSheet in songSheetStore.searchSongSheetInfo"
                    :key="songSheet._id">
                    <div class="bannerBox">
                        <img :src="songSheet.sheetContent.length > 0 ? songSheet.sheetContent[songSheet.sheetContent.length - 1].album.picUrl : '/src/assets/back.jpg'"
                            alt="" class="play-banner">
                        <img src="../../assets/play.svg" alt="" class="play-mask">
                    </div>
                    <span>{{ songSheet.sheetName }}</span>
                </div>
                <el-empty v-else description="歌单空空如也~" />
            </div>
        </div>
        <div class="collect-sheet">
            <div class="title">
                收藏歌单
            </div>
            <div class="sheet-content" :class="{ 'flex-center': collectSheetStore.searchCollectSheetInfo.length <= 0 }">
                <div class="playList-box" @click="checkSongSheet(songSheet)"
                    v-if="collectSheetStore.searchCollectSheetInfo.length > 0"
                    v-for="songSheet in collectSheetStore.searchCollectSheetInfo">
                    <div class="bannerBox">
                        <img :src="songSheet.sheetContent.length > 0 ? songSheet.sheetContent[songSheet.sheetContent.length - 1].album.picUrl : defaultBack"
                            alt="" class="play-banner">
                        <img src="../../assets/play.svg" alt="" class="play-mask">
                    </div>
                    <span>{{ songSheet.sheetName }}</span>
                </div>
                <el-empty v-else description="歌单空空如也~" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ChatLineRound
} from '@element-plus/icons-vue';
import { useSearchUser } from '@/store/searchUser';
import { useSongSheet } from '@/store/songSheet';
import { useCollectSheet } from '@/store/collectSheet';
import { useUser } from '@/store/user';
import { useChat } from '@/store/chat';
import router from '@/routes';
import defaultAvatar from '@/assets/avatar.jpg';
import defaultBack from '@/assets/back.jpg';

const searchUser = useSearchUser();
const songSheetStore = useSongSheet();
const collectSheetStore = useCollectSheet();
const userStore = useUser();
const chatStore = useChat();

const isFocus = ref(false);

function checkSongSheet(row) {
    songSheetStore.sheetDetail = row;
    localStorage.setItem('YQ_SONGSHEET_INFO', JSON.stringify(row));
    router.push({ path: '/home/songsheet' });
}

async function focusUser() {
    const result = await userStore.focusUser(searchUser.userInfo);
    if (result.state === 200) {
        ElMessage.success('感谢关注');
        userStore.getFocusList();
        userStore.getFansList();
        userStore.user.focusNum++;
        await userStore.updateUserInfo();
        searchUser.userInfo.fansNum++;
        await userStore.updateUser(searchUser.userInfo);
        isFocus.value = true;
    } else {
        ElMessage.error('关注失败');
    }
}

async function unFocusUser() {
    const result = await userStore.unFocusUser(searchUser.userInfo);
    if (result.state === 200) {
        ElMessage.success('已取消关注');
        userStore.getFocusList();
        userStore.getFansList();
        userStore.user.focusNum > 0 ? userStore.user.focusNum-- : null;
        await userStore.updateUserInfo();
        searchUser.userInfo.fansNum > 0 ? searchUser.userInfo.fansNum-- : null;
        await userStore.updateUser(searchUser.userInfo);
        isFocus.value = false;
    } else {
        ElMessage.error('取关失败');
    }
}

async function getRelationshipList() {
    await userStore.getFocusList();
    await userStore.getFansList();
    const result = userStore.focusList.find((elem) => {
        return (elem._doc ? elem._doc._id : elem._id) == (searchUser.userInfo._doc ? searchUser.userInfo._doc._id : searchUser.userInfo._id);
    })
    if (result) {
        isFocus.value = true;
    }
}

async function chatWithTheUser() {
    const chatInfo = {
        userA: {
            id: userStore.user._id,
            name: userStore.user.name,
            avatar: userStore.user.avatar ? userStore.user.avatar : '/src/assets/avatar.jpg'
        },
        userB: {
            id: searchUser.userInfo._doc ? searchUser.userInfo._doc._id : searchUser.userInfo._id,
            name: searchUser.userInfo._doc ? searchUser.userInfo._doc.name : searchUser.userInfo.name,
            avatar: searchUser.userInfo.avatar ? searchUser.userInfo.avatar : '/src/assets/avatar.jpg'
        }
    }
    const result = await chatStore.addChat(chatInfo);
    router.push({path:'/home/chatroom'})
}

onMounted(() => {
    if (JSON.stringify(searchUser.userInfo) == '{}' || !searchUser.userInfo) {
        searchUser.userInfo = JSON.parse(localStorage.getItem('SEARCHED_USER'));
    }
    const userId = searchUser.userInfo._doc ? searchUser.userInfo._doc._id : searchUser.userInfo._id;
    songSheetStore.getSongSheetById(userId);
    collectSheetStore.getCollectSheetById(userId);
    getRelationshipList();
})

onUnmounted(() => {
    songSheetStore.searchSongSheetInfo = [];
    collectSheetStore.searchCollectSheetInfo = [];
    searchUser.userInfo = {};
})
</script>

<style lang="less" scoped>
.search-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: url('../../assets/musicPanel/back.jpg');

    .base-info {
        width: 75%;
        padding: 20px;
        margin-top: 10px;
        background: url('../../assets/musicPanel/back.jpg') no-repeat;
        background-size: cover;
        background-position: 50%;
        display: flex;
        border-radius: 10px;

        .info-left {
            border-right: 1px solid #DFDFDF;
            width: 20%;
            min-width: 210px;
            margin-left: 20px;

            img {
                width: 200px;
                height: 200px;
                border: 2px solid white;
            }
        }

        .info-right {
            flex: 1;
            padding-left: 20px;

            .base-top {
                margin-left: 20px;
                display: flex;
                align-items: center;
                margin-bottom: 20px;

                span {
                    font-size: 20px;
                    margin-right: 10px;
                }
            }

            .base-center {
                display: flex;

                .focues-box,
                .fans-box {
                    width: 60px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    span {
                        font-size: 18px;
                    }
                }

                .focues-box {
                    border-right: 1px solid #DFDFDF;
                    margin-left: 20px;
                }
            }

            .base-bottom {
                width: 80%;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-left: 20px;
                margin-top: 20px;

                span {
                    margin-bottom: 10px;
                }
            }
        }
    }

    .collect-sheet,
    .create-sheet {
        width: 75%;
        padding: 20px;
        margin-top: 10px;
        background-color: white;
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        border-radius: 10px;

        .sheet-content {
            width: 100%;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
        }
    }

    .collect-sheet {
        margin-bottom: 10px;
    }

    .base-info:hover,
    .collect-sheet:hover,
    .create-sheet:hover {
        box-shadow: 5px 5px 10px #AAA;
        transition: 0.5s all linear;
    }

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

    .flex-center {
        justify-content: center;
    }
}</style>