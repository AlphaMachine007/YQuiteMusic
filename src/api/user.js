import request from "@/utils/request";
// 用户登录
const reqUserLogin = (user) => request({url:'/user/login',method:'post',data:user})
// 用户注册
const reqUserRegist = (user) => request({url:'/user/regist',method:'post',data:user})
// token校验(通过token获取用户信息)
const reqUserByToken = () => request({url:'/user/passport/auth/getUserInfo',method:'get'})
// 获取status(身份)信息
const reqStatus = () => request({url:'/user/userinfo/getStatusList',method:'get'})
// 更改用户信息
const reqUpdateUserInfo = (user) => request({url:'/user/userinfo/updateUserInfo',method:'post',data:user})
// 更改用户头像
const reqUpdateAvatar = (avatar) => request({url:'/user/userinfo/updateAvatar',method:'post',data:avatar})
// 获取用户头像
const reqGetAvatar = () => request({url:'/user/userinfo/getAvatar',method:'get'})
// 获取我的最爱
const reqMyFavorite = () => request({url:'/user/userinfo/getMyFavorite',method:'get'})
// 插入歌曲到我的最爱中
const reqAddMyFavorite = (music) => request({url:'/user/userinfo/addMyFavorite',method:'post',data:music})
// 从我的最爱中删除歌曲
const reqDeleteMyFavorite = (musicId) => request({url:`/user/userinfo/deleteMyFavorite/${musicId}`,method:'delete'})
// 获取关注列表
const reqGetFocusList = () => request({url:'/user/userinfo/getFocusList',method:'get'});
// 获取粉丝列表
const reqGetFansList = () => request({url:'/user/userinfo/getFansList',method:'get'});
// 关注用户
const reqFocusUser = (userInfo) => request({url:'/user/userinfo/focusUser',method:'post',data:userInfo});
// 取消关注
const reqUnFocusUser = (userInfo) => request({url:'/user/userinfo/unFocusUser',method:'post',data:userInfo});
export default{
    reqUserLogin,
    reqUserRegist,
    reqUserByToken,
    reqStatus,
    reqUpdateUserInfo,
    reqUpdateAvatar,
    reqGetAvatar,
    reqMyFavorite,
    reqAddMyFavorite,
    reqDeleteMyFavorite,
    reqGetFocusList,
    reqGetFansList,
    reqFocusUser,
    reqUnFocusUser
}