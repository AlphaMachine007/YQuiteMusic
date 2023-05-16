import request from "@/utils/request";
// 获取游客cookie
const reqVisitorCookie = () => request({url:'/playMusic/getVisitorCookie',method:'get'});
// 获取登录状态
const reqLoginStatus = (cookie) => request({url:`/playMusic/getLoginStatus`,method:'post',data:cookie});
// 获取生成二维码的key
const reqGetUnikey = () => request({url:'/playMusic/getLoginUnikey',method:'get'});
// 生成二维码
const reqGetQRCode = (key) => request({url:'/playMusic/getQRCode',method:'post',data:key});
// 检测二维码状态
const reqQRCodeStatus = (key) => request({url:'/playMusic/checkStatus',method:'post',data:key});
// 退出登录
const reqCloudLogout = (cookie) => request({url:'/playMusic/logoutCloud',method:'post',data:cookie});
// 获取用户歌单
const reqCloudPlayList = (uid) => request({url:'/playMusic/getCloudPlayList',method:'post',data:uid});
export default{
    reqVisitorCookie,
    reqLoginStatus,
    reqGetUnikey,
    reqGetQRCode,
    reqQRCodeStatus,
    reqCloudLogout,
    reqCloudPlayList
}