[![Typing SVG](https://readme-typing-svg.demolab.com/?lines=YQuietMusic;Being+a+quiet+player)](https://git.io/typing-svg)

**项目介绍**：本项目为基于Vue、NodeJS以及网易云音乐API的在线音乐平台，实现前后端分离，用户可在线播放音乐、创建歌单、查找歌曲歌单，在个人中心可以修改自身资料、与其他用户进行交流，同时可以登录网易云音乐账号将歌单选择性导入，或通过云音乐歌单的Url将收藏的歌单进行导入。

**技术栈**：Vue3+vite+axios+pinia+mongoDB+elementPlus+Echarts

**项目特点**：

- 使用token进行身份验证，并通过二次封装axios拦截请求和相应，并对token做出解析和处理。
- 采用路由懒加载，进一步优化了项目的启动速度。
- 对API提供的大规模数据进行处理和封装。
- 通过监听音乐进度和解析歌词数据实现了歌词滚动和高亮处理。
- 通过Websocket实现了用户之间的私信交流。

## 后端文件地址

- [后端服务器](https://github.com/AlphaMachine007/YQuietMusicBackEnd)
- [数据源-网易云音乐API](https://github.com/Binaryify/NeteaseCloudMusicApi)
