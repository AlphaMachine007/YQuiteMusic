import api from '@/api';
import router from '@/routes';
import { useUser } from '@/store/user';
import { useSongSheet } from '@/store/songSheet';
import transformTime from '@/utils/transformTime';

const userStore = useUser();
const songSheetStore = useSongSheet();

async function toSongSheetDetail(row) {
    const sendCollectSheet = {
        userId: userStore.user._id,
        _id:row.id,
        sheetName: '',
        sheetContent: [],
        sheetDescribe: '',
        sheetCreator: '',
        playNum: 0,
        sheetCreatedTime: '',
        isCollect: true
    }
    if (row.songs) {
        sendCollectSheet.picUrl = row.album.coverImgUrl;
        sendCollectSheet.sheetName = row.album.name;
        sendCollectSheet.sheetDescribe = row.album.description;
        sendCollectSheet.sheetCreator = row.album.company;
        sendCollectSheet.sheetCreatedTime = new Date(row.album.publishTime).toLocaleString();
        sendCollectSheet.sheetContent = row.songs.map(elem => {
            return {
                id: elem.id,
                name: elem.name,
                singer: elem.ar,
                album: elem.al,
                time: transformTime(elem.dt),
                isShowOpe: false
            }
        })
    } else {
        sendCollectSheet.picUrl = row.picUrl || row.coverImgUrl || '';
        const resultA = await api.music.reqGetSheetDetail({ sheetId: row.id });
        if (resultA.code == 200) {
            sendCollectSheet.sheetName = resultA.playlist.name;
            sendCollectSheet.sheetDescribe = resultA.playlist.description;
            sendCollectSheet.sheetCreator = resultA.playlist.creator.nickname;
            sendCollectSheet.playNum = resultA.playlist.playCount;
            sendCollectSheet.sheetCreatedTime = new Date(resultA.playlist.createTime).toLocaleString();
        }
        const resultB = await api.music.reqGetSheetAllMusic({ sheetId: row.id });
        if (resultB.code == 200) {
            sendCollectSheet.sheetContent = resultB.songs.map(elem => {
                return {
                    id: elem.id,
                    name: elem.name,
                    singer: elem.ar,
                    album: elem.al,
                    time: transformTime(elem.dt),
                    isShowOpe: false
                }
            })
        }

    }
    if(row.isAlbum){
        sendCollectSheet.isAlbum = true;
    }
    songSheetStore.sheetDetail = sendCollectSheet;
    localStorage.setItem('YQ_SONGSHEET_INFO', JSON.stringify(sendCollectSheet));
    router.push({ path: '/home/songsheet' });
}

export default toSongSheetDetail;