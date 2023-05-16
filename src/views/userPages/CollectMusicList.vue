<template>
    <div>
        <el-card shadow="always">
            <sheetComponent :sheetStore="collectSheetStore.collectSheetInfo" :funcObj="funcObj"></sheetComponent>
        </el-card>
    </div>
</template>

<script setup>
import api from '@/api';
import sheetComponent from '@/components/sheetComponent.vue';
import { useCollectSheet } from '@/store/collectSheet';
const collectSheetStore = useCollectSheet();
const funcObj = {
    removeFunc(id){
        return api.music.reqRemoveCollectSheet({sheetId:id});
    },
    getFunc() {
        return collectSheetStore.getCollectSheet();
    }
}
onMounted(()=>{
    collectSheetStore.getCollectSheet();
})
</script>

<style lang="less" scoped></style>