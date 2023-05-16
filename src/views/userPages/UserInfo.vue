<template>
    <div class="info-content">
        <div class="borderBox"></div>
        <div class="info-panel">
            <el-card shadow="always" :body-style="{ padding: '20px' }" class="info-card">
                <el-descriptions title="个人资料" border class="info-table" :column="2">
                    <el-descriptions-item class="form-box">
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <User />
                                </el-icon>
                                用户名
                            </div>
                        </template>
                        <span v-show="!isModify">{{ userStore.user.name }}</span>
                        <el-input v-show="isModify" v-model="userStore.user.name" maxlength="18"></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item class="form-box">
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Iphone />
                                </el-icon>
                                电话
                            </div>
                        </template>
                        <span v-show="!isModify">{{ userStore.user.account }}</span>
                        <el-input v-show="isModify" v-model="userStore.user.account" maxlength="11"></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item class="form-box">
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Headset />
                                </el-icon>
                                性别
                            </div>
                        </template>
                        <span v-show="!isModify">{{ userStore.user.sex ? '男' : '女' }}</span>
                        <el-select v-show="isModify" v-model="userStore.user.sex" placeholder="请选择性别" filterable @change="">
                            <el-option label="男" :value="1">
                            </el-option>
                            <el-option label="女" :value="0">
                            </el-option>
                        </el-select>
                        
                    </el-descriptions-item>
                    <el-descriptions-item class="form-box">
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Location />
                                </el-icon>
                                身份
                            </div>
                        </template>
                        <span v-show="!isModify">{{ userStore.user.status }}</span>
                        <el-select v-show="isModify" v-model="userStore.user.status" filterable>
                            <el-option v-for="item in userStore.status"
                                :key="item.value"
                                :label="item.status"
                                :value="item.status">
                            </el-option>
                        </el-select>
                        
                    </el-descriptions-item>
                    <el-descriptions-item class="form-box">
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <ChatDotRound />
                                </el-icon>
                                自我描述
                            </div>
                        </template>
                        <span v-show="!isModify">{{ userStore.user.description }}</span>
                        <el-input v-show="isModify" type="textarea" v-model="userStore.user.description"></el-input>
                    </el-descriptions-item>
                </el-descriptions>
                <div class="btn-group">
                    <el-button v-show="!isModify" type="danger" size="default" @click="isModify = true" class="modifyBtn">修改</el-button>
                    <el-button v-show="isModify" size="default" @click="isModify = false">取消</el-button>
                    <el-button v-show="isModify" type="primary" size="default" @click="saveUserInfo">保存</el-button>
                </div>
            </el-card>
        </div>
        <div class="borderBox"></div>
    </div>
</template>

<script setup>
import { useUser } from '@/store/user';
import { onMounted } from 'vue';
import { User,Iphone,Location,Headset,ChatDotRound } from '@element-plus/icons-vue'
// 修改信息flag
const isModify = ref(false)
const userStore = useUser()

onMounted(()=>{
    userStore.getStatus()
})

async function saveUserInfo(){
    let result = await userStore.updateUserInfo(userStore.user)
    if(result.state === 200){
        ElMessage.success('修改成功')
    }else{
        ElMessage.error('修改失败，请稍后再试')
    }
    isModify.value = false
}
</script>

<style lang="less" scoped>
.info-content {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #F1F1F1;

    .borderBox {
        width: 5%;
    }

    .info-panel {
        background-color: white;
        width: 80%;

        .info-card{
            .info-table {
                width: 100%;
                // .cell-item {
                //     display: flex;
                //     align-items: center;
                // }
    
                .form-box {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .btn-group{
                width: 100%;
                display: flex;
                justify-content: center;

                .modifyBtn{
                    width: 10%;
                }
            }
        }
    }
}
</style>