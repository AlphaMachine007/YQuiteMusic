<template>
    <div class="fans-panel">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <template #header>
                <span>粉丝列表</span>
            </template>
            <div v-show="isLoading" v-loading="isLoading"></div>
            <el-table v-show="!isLoading" :data="fansList" stripe>
                <el-table-column>
                    <template #default="scope">
                        <div class="user-box">
                            <img :src="scope.row.avatar" alt="">
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="scope">
                        <span class="description">{{ scope.row.description }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200">
                    <template #default="scope">
                        <el-button size="default" :icon="Message" @click="gotoChat(scope.row)">私信</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script setup>
import { useUser } from '@/store/user';
import { Message } from '@element-plus/icons-vue';
import { useChat } from '@/store/chat';
import router from '@/routes';

const userStore = useUser();
const chatStore = useChat();
const isLoading = ref(true);

onMounted(() => {
    getList();
    isLoading.value = true;
})

let fansList = ref([]);

async function getList() {
    await userStore.getFansList();
    fansList.value = userStore.fansList;
}

async function gotoChat(row) {
    const chatInfo = {
        userA: {
            id: userStore.user._id,
            name: userStore.user.name,
            avatar: userStore.user.avatar ? userStore.user.avatar : '/src/assets/avatar.jpg'
        },
        userB: {
            id: row._id,
            name: row.name,
            avatar: row.avatar
        }
    }
    const result = await chatStore.addChat(chatInfo);
    router.push({path:'/home/chatroom'});
}

watch(() => userStore.fansList, async (newValue) => {
    await userStore.getFocusList();
    fansList.value = newValue;
    isLoading.value = false;
})
</script>

<style lang="less" scoped>
.fans-panel {
    .user-box {
        padding: 0 20px;

        img {
            width: 80px;
            margin-right: 20px;
        }

        span {
            font-weight: 600;
            font-family: '黑体';
        }
    }

    .description {
        font-size: 10px;
        color: #AAA;
    }
}
</style>