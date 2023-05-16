import request from "@/utils/request";
// 获取carousel的banner
const reqGetBanner = () => request({url:'/mainContent/getBanner',method:'get'})
// 获取歌单推荐
const reqGetCommend = () => request({url:'/mainContent/getPlayListComm',method:'get'})
// 获取所有榜单简介
const reqGetAllTopList = () => request({url:'/mainContent/getAllTopList',method:'get'});
export default{
    reqGetBanner,
    reqGetCommend,
    reqGetAllTopList
}