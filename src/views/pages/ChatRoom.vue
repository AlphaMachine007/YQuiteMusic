<template>
    <div class="chat-panel" v-loading="!isConnect">

        <div class="chat-list">
            <div class="list-title">
                <span>消息列表</span>
            </div>
            <div class="list-content">
                <div class="list-item" v-for="chatItem in chatStore.chatList" @click="chatWith(chatItem)">
                    <img :src="chatItem.userA.id == userStore.user._id ? (chatItem.userB.avatar ? chatItem.userB.avatar : '/src/assets/avatar.jpg') : (chatItem.userA.avatar ? chatItem.userA.avatar : '/src/assets/avatar.jpg')"
                        alt="">
                    <span>{{ chatItem.userA.id == userStore.user._id ? chatItem.userB.name : chatItem.userA.name }}</span>
                    <el-icon class="delete-icon" @click="deleteChart(chatItem)">
                        <Close/>
                    </el-icon>
                </div>
            </div>
        </div>
        <div v-show="!isChat" class="chat-box">
            <div class="empty-status">
                <img src="../../assets/musicPanel/empty.jpg" alt="">
                <span>来和好友一起悦享音乐吧~</span>
            </div>
        </div>
        <div v-show="isChat" class="chat-box">
            <div class="chat-content" ref="content">
                <el-scrollbar ref="scrollbar">
                    <div class="chat-item" v-for="message in messages">
                        <div v-show="message.isShowTime" class="time-bar">
                            <span>{{ new Date(message.time).toLocaleString() }}</span>
                        </div>
                        <div :class="{ 'item-box-left': message.id != userStore.user._id, 'item-box-right': message.id == userStore.user._id }"
                            >
                            <div
                                :class="{ 'content-item-left': message.id != userStore.user._id, 'content-item-right': message.id == userStore.user._id }">
                                <div
                                    :class="{ 'avatar-left': message.id != userStore.user._id, 'avatar-right': message.id == userStore.user._id }">
                                    <img :src="chatStore.chatingInfo.userA.id == message.id ? chatStore.chatingInfo.userA.avatar : chatStore.chatingInfo.userB.avatar"
                                        alt="">
                                </div>
                                <div
                                    :class="{ 'message-right': message.id != userStore.user._id, 'message-left': message.id == userStore.user._id }">
                                    <div class="message-content">
                                        <span>{{ message.text }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="chat-input">
                <el-input class="input-panel" type="textarea" :resize="'none'" v-model="inputMessage" clearable @change=""
                    @keyup.enter.native="sendMessage"></el-input>
                <el-button class="send-button" type="primary" @click="sendMessage">发送</el-button>

            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/routes';
import { onMounted, nextTick } from 'vue';
import { useUser } from '@/store/user';
import { useChat } from '@/store/chat';
import { Close } from '@element-plus/icons-vue';
import api from '@/api';
import { ElMessage } from 'element-plus';
const inputMessage = ref('');
const messages = ref([]);
const isConnect = ref(false);
const isChat = ref(false);
const scrollbar = ref(null);
const content = ref(null);
let ws = null;

const userStore = useUser();
const chatStore = useChat();


onMounted(() => {

    // 创建WebSocket连接
    ws = new WebSocket(`ws://localhost:8080?clientId=${userStore.user._id}`);

    // 监听连接
    ws.addEventListener('open', () => {
        isConnect.value = true;
        ElMessage.success('连接成功');
    })
    // 监听消息事件
    ws.addEventListener('message', async (event) => {
        const message = JSON.parse(event.data);
        messages.value.push(message);
        await nextTick();
        scrollbar.value.setScrollTop(scrollbar.value.$el.querySelector('.el-scrollbar__view').offsetHeight);
    });
    // 监听关闭事件
    ws.addEventListener('close', () => {
        ElMessage.success('连接已断开');
        router.push({ path: '/home' });
    })
    // 监听连接异常
    ws.addEventListener('error', (event) => {
        ElMessage.error('连接异常');
    });

    chatStore.getChatList();
})

function chatWith(row) {
    isChat.value = true;
    chatStore.chatingInfo = row;
    messages.value = row.messageContent;
}

function deleteChart(chat){
    const toClientName = userStore.user._id == chat.userA.id ? chat.userB.name : chat.userA.name;
    ElMessageBox.confirm(`确认删除与${toClientName}的会话吗`,'确认删除',{
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
    }).then(async ()=>{
        const result = await api.chat.reqDeleteChat(chat._id);
        if(result.state == 200){
            ElMessage.success('删除成功');
            chatStore.getChatList();
            isChat.value = false;
        }else{
            ElMessage.error('删除失败');
        }
    }).catch(()=>{
        ElMessage.info('取消删除');
    })
}

function sendMessage() {
    const toClientId = chatStore.chatingInfo.userA.id == userStore.user._id ? chatStore.chatingInfo.userB.id : chatStore.chatingInfo.userA.id;
    const message = {
        id: userStore.user._id,
        text: inputMessage.value,
        time: Date.now(),
        isShowTime:false,
    };
    inputMessage.value = '';
    ws.send(`${toClientId}|#${JSON.stringify(message)}`);
}
</script>

<style lang="less" scoped>
.chat-panel {
    width: 100%;
    height: 600px;
    display: flex;
    border-radius: 10px;
    border: 1px solid #AAA;

    .chat-list {
        width: 20%;
        // background-color: #DDD;
        border-right: 1px solid #BBB;

        .list-title {
            padding: 10px;
            border-bottom: 1px solid #DDD;

            span {
                font-size: 20px;
            }
        }

        .list-content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding-top: 10px;

            .list-item {
                width: 95%;
                background-image: linear-gradient(to right, #b9dddb, #94d9d6);
                display: flex;
                align-items: center;
                border-radius: 40px;
                cursor: pointer;
                margin-bottom: 5px;
                transition: 1s all linear;

                img {
                    padding: 5px;
                    width: 80px;
                    border-radius: 50%;
                }

                span {
                    margin-left: 30px;
                    color: whitesmoke;
                    font-weight: 500;
                }
                .delete-icon{
                    cursor: pointer;
                    color: white;
                    margin-left: 40%;
                }
                .delete-icon:hover{
                    color: black;
                    background-color: white;
                    border-radius: 50%;
                }
            }

            .list-item:hover {
                background-image: linear-gradient(to right, #b9dddb, #77b9f6);
            }
        }
    }

    .chat-box {
        width: 80%;
        // background-color: #EEE;
        display: flex;
        flex-direction: column;

        .empty-status {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #94d9d6;

            img {
                width: 400px;
            }

            span {
                margin-top: 10px;
                color: white;
                font-weight: 600;
            }
        }

        .chat-content {
            flex: 1;
            max-height: 100%;
            overflow-y: auto;

            .time-bar {
                display: flex;
                justify-content: center;

                span {
                    color: #AAA;
                }
            }

            .item-box-left {
                width: 100%;
                display: flex;
                justify-content: start;

                .content-item-left {
                    width: 50%;
                    padding: 20px;
                    display: flex;
                    align-items: baseline;

                    .avatar-left {
                        img {
                            width: 50px;
                            border-radius: 50%;
                        }
                    }

                    .message-right {
                        margin-left: 20px;
                        overflow-wrap: break-word;
                        position: relative;

                        .message-content {
                            background-color: #f1f0f0;
                            border-radius: 10px;
                            padding: 10px;

                            span {
                                width: 100%;
                            }
                        }

                        .message-content::after {
                            content: '';
                            position: absolute;
                            border-width: 10px;
                            left: -10px;
                            top: 20px;
                            border-style: solid;
                            border-color: #f1f0f0 transparent transparent transparent;
                        }
                    }
                }
            }


            .item-box-right {
                width: 100%;
                display: flex;
                justify-content: end;

                .content-item-right {
                    width: 50%;
                    padding: 20px;
                    display: flex;
                    align-items: baseline;
                    flex-direction: row-reverse;

                    .avatar-right {
                        img {
                            width: 50px;
                            border-radius: 50%;
                        }
                    }

                    .message-left {
                        margin-right: 20px;
                        overflow-wrap: break-word;
                        position: relative;
                        display: flex;
                        justify-content: end;
                    }

                    .message-content {
                        background-color: #4ca4f5;
                        border-radius: 10px;
                        padding: 10px;

                        span {
                            width: 100%;
                            color: whitesmoke;
                        }
                    }

                    .message-content::after {
                        content: '';
                        position: absolute;
                        border-width: 10px;
                        right: -10px;
                        top: 20px;
                        border-style: solid;
                        border-color: #4ca4f5 transparent transparent transparent;
                    }
                }
            }


        }

        .chat-input {
            height: 16%;
            border-top: 1px solid #BBB;
            display: flex;
            justify-content: center;
            align-items: center;

            .input-panel {
                width: 80%;
            }

            .send-button {
                min-height: 52px;
            }

            // background-color: #FFF;
        }
    }
}
</style>