import request from "@/utils/request";
// 通过id获取歌曲详情
const reqSongDetailById = (songId) => request({ url:'/playMusic/getMusicDetailById',method:'post',data:songId});
// 播放列表中添加歌曲
const reqAddToPlayList = (music) => request({ url: '/music/addToPlayList', method: 'post', data: music });
// 从播放列表
const reqRemoveMusicById = (musicId) => request({ url: `/music/removeMusicById/${musicId}`, method: 'delete' });
// 获取播放列表
const reqPlayList = () => request({ url: '/music/getPlayList', method: 'get' });
// 获取音乐url
const reqMusicUrl = (musicInfo) => request({ url: '/playMusic/getMusicUrl', method: 'post', data: musicInfo });
// 获取歌词
const reqMusicLyric = (musicId) => request({ url: '/playMusic/getLyric', method: 'post', data: musicId });
// 播放全部(替换播放列表)
const reqPlayAllMusic = (songSheet) => request({ url: '/music/playAllMusic', method: 'post', data: songSheet });
// 创建歌单
const reqCreateSongSheet = (sheetName) => request({ url: '/music/createSongSheet', method: 'post', data: sheetName });
// 获取歌单
const reqGetSongSheet = () => request({ url: '/music/getSongSheet', method: 'get' });
// 通过Id获取歌单
const reqGetSongSheetById = (userId) => request({url:'/music/getSongSheetById',method:'post',data:userId});
// 向歌单中添加歌曲
const reqAddToSongSheet = (music) => request({ url: '/music/addSongToSheet', method: 'post', data: music });
// 从歌单中删除歌曲
const reqRemoveFromSheet = (music) => request({ url: '/music/removeSongFromSheet', method: 'post', data: music });
// 修改歌单信息(以及播放量)
const reqModifySongSheet = (music) => request({ url: '/music/editSongSheet', method: 'post', data: music });
// 删除歌单
const reqRemoveSongSheet = (sheetId) => request({url:`/music/removeSongSheet/${sheetId}`,method:'delete'});
// 从我的最爱中向其他歌单添加歌曲
const reqAddToOtherSheet = (sheetArr) => request({url:'/music/addToOtherSheet',method:'post',data:sheetArr});
// 获取收藏歌单
const reqCollectSheet = () => request({url:'/music/getCollectSheet',method:'get'});
// 通过Id获取收藏歌单
const reqCollectSheetById = (userId) => request({url:'/music/getCollectSheetById',method:'post',data:userId});
// 获取云歌单详情
const reqGetSheetDetail = (sheetId) => request({url:'/playMusic/getSheetDetail',method:'post',data:sheetId});
// 获取云歌单所有歌曲
const reqGetSheetAllMusic = (sheetId) => request({url:'/playMusic/getSheetAllMusic',method:'post',data:sheetId});
// 收藏歌单
const reqCollectFromSheet = (sheetArr) => request({url:'/music/addToCollectSheet',method:'post',data:sheetArr});
// 取消收藏
const reqRemoveCollectSheet = (sheetId) => request({url:'/music/removeCollectSheet',method:'post',data:sheetId});
// 向播放列表中添加多首歌曲
const reqAddManyToPlayList = (musicList) => request({url:'/music/addManyToPlayList',method:'post',data:musicList});
// 获取专辑内容
const reqGetAlbumById = (albumId) => request({url:'/playMusic/getAlbum',method:'post',data:albumId});
export default {
    reqSongDetailById,
    reqAddToPlayList,
    reqRemoveMusicById,
    reqPlayList,
    reqMusicUrl,
    reqMusicLyric,
    reqPlayAllMusic,
    reqCreateSongSheet,
    reqGetSongSheet,
    reqGetSongSheetById,
    reqAddToSongSheet,
    reqRemoveFromSheet,
    reqModifySongSheet,
    reqRemoveSongSheet,
    reqAddToOtherSheet,
    reqCollectSheet,
    reqCollectSheetById,
    reqGetSheetDetail,
    reqGetSheetAllMusic,
    reqCollectFromSheet,
    reqAddManyToPlayList,
    reqRemoveCollectSheet,
    reqGetAlbumById
}