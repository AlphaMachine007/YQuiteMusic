<template>
    <el-dialog v-model="props.showAvatar" width="50%" title="上传头像">
        <div class="avatar-container">
            <div class="avatar-box" v-show="!options.img">
                <el-upload class="avatar-uploader" action="#" accept="image/png, image/jpeg, image/jpg" :auto-upload="false"
                    :show-file-list="false" :on-change="changeAvatar" :drag="true" :limit="1" ref="uploadBox">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload> <!-- http://localhost:3001/user/userinfo/updateAvatar -->
            </div>
            <div v-show="options.img" class="cropper-box">
                <VueCropper ref="cropper" :img="options.img" :autoCrop="options.autoCrop" :fixedBox="options.fixedBox"
                    :canMoveBox="options.canMoveBox" :autoCropWidth="options.autoCropWidth"
                    :autoCropHeight="options.autoCropHeight" :centerBox="options.centerBox" :fixed="options.fixed"
                    :fixedNumber="options.fixedNumber" :canMove="options.canMove" :canScale="options.canScale"
                    class="cropper">
                </VueCropper>
            </div>
        </div>
        <template #footer>
            <span class="avater-footer">
                <div class="reUpload" @click="reUpload">
                    <span v-show="options.img">重新上传</span>
                </div>
                <div>
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="getCrop">确 定</el-button>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { useUser } from '@/store/user';
import { isRef, ref } from 'vue';
// 头像裁切
import 'vue-cropper/dist/index.css'
import { VueCropper } from "vue-cropper";
import {
    Plus
} from '@element-plus/icons-vue'
import { ElMessage, ElStep } from 'element-plus';
const userStore = useUser()
const imageUrl = ref('')
const uploadBox = ref()
const cropper = ref()
const options = reactive({
    img: '', // 原图文件
    autoCrop: true, // 默认生成截图框
    fixedBox: false, // 固定截图框大小
    canMoveBox: true, // 截图框可以拖动
    autoCropWidth: 200, // 截图框宽度
    autoCropHeight: 200, // 截图框高度
    fixed: true, // 截图框宽高固定比例
    fixedNumber: [1, 1], // 截图框的宽高比例
    centerBox: true, // 截图框被限制在图片里面
    canMove: true, // 上传图片不允许拖动
    canScale: true // 上传图片不允许滚轮缩放
})

const props = defineProps({
    showAvatar: Boolean
})
const emit = defineEmits(['closeDialog']);

// 获取上传图片并判断
function changeAvatar(uploadFile, uploadFiles) {
    const isImage = uploadFile.raw.type === 'image/jpeg' || uploadFile.raw.type === 'image/png';
    const isLegal = uploadFile.raw.size / 1024 / 1024 < 5
    if (!isImage) {
        ElMessage.warning("文件格式不符，请选择 jpg、png 格式的图片");
        return false;
    }
    if (!isLegal) {
        ElMessage.warning("文件过大，图片大小不能超过5MB");
        return false;
    }
    let reader = new FileReader();

    reader.readAsDataURL(uploadFile.raw);

    reader.onload = e => {
        options.img = e.target.result; //base64
    }
    uploadBox.value.clearFiles();
}

// 重新上传图片
function reUpload() {
    options.img = '';
}
// 关闭模态框
function closeDialog() {
    emit('closeDialog');
    options.img = '';
}
// 上传图片(并获取裁剪图片)
function getCrop() {
    // console.log(cropper.value)
    // 获取截图的base64数据
    // cropper.value.getCropData(data=>{

    // })
    cropper.value.getCropBlob(async data => {
        // 采用FormData发送数据,后端使用multiparty接收
        let formData = new FormData();
        // 第三个参数是规定以什么为后缀，接口是根据后缀来返回地址格式的
        formData.append("file", data, 'avatar.jpg');
        // 上传接口
        const result = await userStore.updateAvatar(formData)
        if(result.state === 200){
            ElMessage.success('修改成功');
            closeDialog();
        }else{
            ElMessage.error('修改失败')
        }
    })
}
</script>

<style lang="less" scoped>
.avater-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .reUpload {
        margin-right: 10px;
        cursor: pointer;
    }

    .reUpload:hover {
        color: #FCDE5F;
    }
}

.avatar-box {
    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}

// FCDE5F
</style>

<style lang="less">
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;

    .cropper-box {
        position: relative;
        width: 560px;
        height: 350px;

        .cropper {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }
}
</style>