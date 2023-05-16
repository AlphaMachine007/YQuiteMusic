import request from "@/utils/request";
// 发送私信(建立联系)
const reqChatWithUser = (chatInfo) => request({url:'/chat/addChat',method:'post',data:chatInfo});
// 获取会话列表
const reqGetChatList = ()=>request({url:'/chat/getChatList',method:'get'});
// 删除会话
const reqDeleteChat = (chatId)=>request({url:`/chat/deleteChat/${chatId}`,method:'delete'});
export default{
    reqChatWithUser,
    reqGetChatList,
    reqDeleteChat
}