<template>
    <div class="discovery-panel">
        <div class="discovery-box" @click="checkSheetContent(list)" v-for="list in mainContent.topListProfile" :key="list.id">
            <div class="discovery-card">
                <div class="box-top">
                    <span>{{ list.name }}</span>
                    <img :src="list.coverImgUrl" alt="">
                </div>
                <div class="box-bottom">
                    <span class="song-title" v-for="(track,index) in list.tracks">{{ index+1 }}<span>{{ track.first.length <=8 ? track.first : track.first.slice(0,8)+'...' }}</span><span>{{ track.second.length <=5 ? track.second : track.second.slice(0,5) + '...' }}</span></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMainContent } from '@/store/mainContent';
import checkSheetContent from '@/utils/checkSheetContent'

const mainContent = useMainContent();
onMounted(() => {
    mainContent.getAllTopList();
})
function gotoSongSheet(row){
    console.log(row);
}
</script>

<style lang="less" scoped>
.discovery-panel {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .discovery-box {
        width: 24%;
        height: 350px;
        margin: 10px 0.5%;
        background-color: rgba(233, 228, 196, 0.3);
        border-radius: 10px;
        padding: 15px 0;
        display: flex;
        justify-content: center;
        cursor: pointer;

        .discovery-card {
            width: 80%;
            background-color: white;
            border-radius: 5px;

            .box-top {
                display: flex;
                flex-direction: column;
                align-items: center;

                img {
                    width: 60%;
                    border-radius: 5px;
                }

                span {
                    margin: 5px 0;
                }
            }

            .box-bottom {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-top: 25px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .song-title{
                    width: 60%;
                    display: flex;
                    justify-content: space-between;
                }
            }
        }

    }

    .discovery-box:hover {
        transform: scale(1.05);
        box-shadow: 5px 5px 10px #AAA;
        transition: all 0.2s ease-in-out;

        .discovery-card {
            img {
                transform: scale(1.05);
            }

            span {
                color: #709368;
            }
        }
    }
}</style>