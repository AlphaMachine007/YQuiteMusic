const Login = () => import('../views/Login.vue');
const Home = () => import('../views/Home.vue');
const HomePage = () => import("@/views/pages/HomePage.vue");
const UserPage = () => import("@/views/pages/UserPage.vue");
const UserInfo = () => import("@/views/userPages/UserInfo.vue");
const MyMusic = () => import("@/views/userPages/MyMusic.vue");
const CollectMusicList = () => import("@/views/userPages/CollectMusicList.vue");
const SubscribeList = () => import("@/views/userPages/SubscribeList.vue");
const FansList = () => import("@/views/userPages/FansList.vue");
const SearchPage = () => import("@/views/pages/SearchPage.vue");
const MusicPanel = () => import("@/views/pages/MusicPanel.vue");
const SongSheet = () => import("@/views/pages/SongSheet.vue");
const JoinCloud = () => import("@/views/pages/JoinCloud.vue");
const Discovery = () => import("@/views/pages/Discovery.vue");
const SearchUserPage = () => import("@/views/pages/SearchUserPage.vue");
const ChatRoom = () => import("@/views/pages/ChatRoom.vue")

let routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        redirect: { name: 'HomePage' },
        meta: {
            title: '主页'
        },
        component: Home,
        children: [
            {
                path: 'homepage',
                component: HomePage,
                name: 'HomePage',
                meta: {
                    title: '主界面'
                },

            },
            {
                path: 'userpage',
                component: UserPage,
                name: 'UserPage',
                redirect: { name: 'UserInfo' },
                meta: {
                    title: '个人信息'
                },
                children: [
                    {
                        path: 'userinfo',
                        component: UserInfo,
                        name: 'UserInfo',
                        meta: {
                            title: '个人资料'
                        },
                    },
                    {
                        path: 'mymusic',
                        component: MyMusic,
                        name: 'MyMusic',
                        meta: {
                            title: '我的音乐'
                        },
                    },
                    {
                        path: 'collectmusiclist',
                        component: CollectMusicList,
                        name: 'CollectMusicList',
                        meta: {
                            title: '收藏歌单'
                        },
                    },
                    {
                        path: 'subscribelist',
                        component: SubscribeList,
                        name: 'SubscribeList',
                        meta: {
                            title: '关注'
                        },
                    },
                    {
                        path: 'fanslist',
                        component: FansList,
                        name: 'FansList',
                        meta: {
                            title: '粉丝'
                        },
                    },
                ]
            },
            {
                path: 'searchpage',
                component: SearchPage,
                name: 'SearchPage',
                meta: {
                    title: '搜索'
                }
            },
            {
                path: 'musicpanel',
                component: MusicPanel,
                name: 'MusicPanel',
                meta: {
                    title: '详情'
                },
            },
            {
                path: 'songsheet',
                component: SongSheet,
                name: 'SongSheet',
                meta: {
                    title: '歌单'
                }
            },
            {
                path: 'joincloud',
                component: JoinCloud,
                name: 'JoinCloud',
                meta: {
                    title: '登录云账号'
                }
            },
            {
                path: 'discovery',
                component: Discovery,
                name: 'Discovery',
                meta: {
                    title: '发现'
                }
            },
            {
                path: 'searchuserpage',
                component: SearchUserPage,
                name: 'SearchUserPage',
                meta: {
                    title: '用户'
                }
            },
            {
                path: 'chatroom',
                component: ChatRoom,
                name: 'ChatRoom',
                meta: {
                    title: '私信'
                }
            }
        ]
    }
]

export default routes;