<template>
    <div>
        <el-pagination @current-change="changeCurr" @size-change="changeSize" :current-page="searchStore.current" :page-sizes="searchStore.limits"
            :page-size="searchStore.limit" layout="prev, pager, next, jumper, sizes, total" :total="searchStore.count" background
            style="text-align: center;" hide-on-single-page>
        </el-pagination>
    </div>
</template>

<script setup>
import { useSearch } from '@/store/search';
const searchStore = useSearch()

function changeSize(newSize) {
    searchStore.limit = newSize
    searchStore.searchInfo()
};
function changeCurr(newCurr) {
    searchStore.current = newCurr
    searchStore.searchInfo()
};
</script>

<style lang="less" scoped></style>