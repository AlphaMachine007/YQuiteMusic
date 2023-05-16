<template>
    <div class="content-title">
        <el-icon v-show="!isCollapse" class="changeCol" @click="foldCol">
            <Fold />
        </el-icon>
        <el-icon v-show="isCollapse" class="changeCol" @click="expandCol">
            <Expand />
        </el-icon>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: des.path }" v-for="des in descriptions">
                {{ des.meta.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import { Fold, Expand } from '@element-plus/icons-vue';
import { reactify } from '@vueuse/shared';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
defineProps({
    isCollapse: Boolean
})
const emit = defineEmits(['changeCollapse'])
function foldCol() {
    emit('changeCollapse', true)
}
function expandCol() {
    emit('changeCollapse', false)
}

const router = useRouter();
const route = useRoute();
let descriptions = ref(route.matched)

// 监听路由，发生变化则修改descriptions
watch(()=>route.matched,(newValue)=>{
    descriptions.value = newValue
})

</script>

<style lang="less" scoped>
.content-title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .changeCol {
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>