<template>
    <div class="main-title">
        <Carousel carouselHeight="300px"></Carousel>
    </div>
    <div>
        <h2>歌单推荐</h2>
        <div class="music-lists">

            <div class="music-list" v-for="item in contentStore.commendArr" @click="checkSheetContent(item)">
                <img :src="item.picUrl" alt="">
                <span>{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Carousel from '@/components/Carousel.vue';
import { useMainContent } from '@/store/mainContent'
import { onMounted } from 'vue';
import checkSheetContent from '@/utils/checkSheetContent'
const contentStore = useMainContent();
onMounted(() => {
    contentStore.getCommend()
})

function checkSongSheet(row){
    console.log(row)
}

</script>

<style lang="less" scoped>
.main-title {
    span {
        font-size: 20px;
    }
}

.music-lists {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    .music-list {
        width: 20%;
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        cursor: pointer;

        img {
            width: 90%;
            height: 200px;
            border-radius: 5px;
        }
    }
}

@media screen and (max-width:768px) {
    .music-list {
        width: 50% !important;
    }
}
</style>