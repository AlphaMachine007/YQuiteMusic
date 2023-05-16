<template>
    <el-carousel :interval="4000" type="card" :height="carouselHeight">
        <el-carousel-item v-for="item in contentStore.carouselImgs" :key="item.encodeId">
            <!-- <h3 text="2xl" justify="center">{{ item }}</h3> -->
            <img :src="item.imageUrl" alt="" class="banner">
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
    import { useMainContent } from '@/store/mainContent';
    const contentStore = useMainContent()

    defineProps({
        carouselHeight:String
    })
</script>

<style lang="less" scoped>
.banner{
    width: 100%;
    height: 100%;
}
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>