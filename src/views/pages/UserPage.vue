<template>
    <div>
        <div class="user-header">
            <div class="user-avatar">
                <div class="avatar-box" @click="modifyAvatar">
                    <img :src="userStore.user.avatar ? userStore.user.avatar : defaultAvatar" alt="avatar" class="avatar-img">
                    <img src="@/assets/camera.svg" alt="" class="mask-img">
                </div>
                <UploadAvatar :showAvatar="showAvatar" @closeDialog="closeDialog"></UploadAvatar>
                
                <span class="name-title">{{ userStore.user.name }}
                    <img v-if="userStore.user.sex == 0" src="@/assets/female.svg" class="sex-icon">
                    <img v-else src="@/assets/male.svg" class="sex-icon" alt="">
                </span>
                <div class="pub-sub-info">
                    <div class="sub-info">
                        <span>关注</span>
                        <span>{{ userStore.user.focusNum }}</span>
                    </div>
                    <div class="pub-info">
                        <span>粉丝</span>
                        <span>{{ userStore.user.fansNum }}</span>
                    </div>
                </div>
            </div>
            <div class="choose-tags">
                <div class="contentBox">
                    <ul>
                        <li><a @click="gotoInfo">个人资料</a></li>
                        <li><a @click="gotoMyMusic">我的音乐</a></li>
                        <li><a @click="gotoCollect">收藏歌单</a></li>
                        <li><a @click="gotoFocus">关注</a></li>
                        <li><a @click="gotoFans">粉丝</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="user-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import router from '@/routes';
import { useUser } from '@/store/user';
import { ref } from 'vue';
import UploadAvatar from '@/components/UploadAvatar.vue'
import defaultAvatar from '@/assets/avatar.jpg';

const userStore = useUser()
let showAvatar = ref(false)

function gotoInfo() {
    router.push({path:'/home/userpage/userinfo'})
}
function gotoMyMusic() {
    router.push({path:'/home/userpage/mymusic'})
}
function gotoCollect() {
    router.push({path:'/home/userpage/collectmusiclist'})
}
function gotoFocus() {
    router.push({path:'/home/userpage/subscribelist'})
}
function gotoFans() {
    router.push({path:'/home/userpage/fanslist'})
}
// 打开修改头像模态框
function modifyAvatar(){
    showAvatar.value = true
}
// 关闭修改头像模态框
function closeDialog(){
    showAvatar.value = false
}
</script>

<style lang="less" scoped>
li {
    list-style: none;
    display: inline-block;
    margin-right: 30px;

    a {
        color: white;
        font-size: 18px;
    }

    a:hover {
        text-decoration: underline;
    }
}

.user-header {
    height: 300px;
    background: url('@/assets/homeBack2.jpg') no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .user-avatar {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar-box{
            cursor: pointer;

            .mask-img{
                width: 60px;
                height: 60px;
                display: none;
            }
        }

        .avatar-box:hover{
            
            .avatar-img{
                filter: brightness(0.5);
            }
            .mask-img{
                display: block;
                position: absolute;
                filter: brightness(10);
                width: 50%;
                left: 25%;
                top:35px;
            }
        }

        .name-title{
            display: flex;
            align-items: center;
            .sex-icon{
                width: 25px;
                height: 25px;
            }
        }

        span {
            color: white;
            font-size: 22px;
        }

        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }

        .pub-sub-info {
            display: flex;

            span {
                color: white;
                font-size: 20px;
            }

            .sub-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-right: 1px #DFDFDF solid;
                padding-right: 10px;

                span {
                    color: white;
                    font-size: 20px;
                }
            }

            .pub-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-left: 10px;

                span {
                    color: white;
                    font-size: 20px;
                }
            }
        }
    }

    .choose-tags {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;

        .contentBox {}
    }
}

.user-content {
    width: 100%;
}

@media screen and(max-width:768px) {
    li{
        a{
            font-size: 14px;
        }
    }
}
</style>