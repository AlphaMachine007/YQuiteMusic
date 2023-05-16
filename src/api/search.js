import request from "@/utils/request";

const reqSearch = (searchInfo) => request({url:'/search/searchInfo',method:'post',data:searchInfo})
// 搜索用户
const reqSearchUser = (searchInfo) => request({url:'/search/searchUser',method:'post',data:searchInfo});
export default{
    reqSearch,
    reqSearchUser
}