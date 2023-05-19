import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite"
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite';
// 配置@别名
import { resolve } from "path";
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
//element
import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      //安装两行后你会发现在组件中不用再导入ref，reactive等
      imports: ['vue', 'vue-router'],
      //element
      resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
    }),
    Components({
      // 引入组件的,包括自定义组件
      resolvers: [ElementPlusResolver(), AntDesignVueResolver({ importStyle: true, resolveIcons: true })],
    }),
  ],
  // 解析配置
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },

  server: {
    // proxy: {
    //   '/api': { // 匹配请求路径，
    //     target: 'http://127.0.0.1:3001', // 代理的目标地址
    //     // 开发模式，默认的127.0.0.1,开启后代理服务会把origin修改为目标地址
    //     changeOrigin: true,
    //     // secure: true, // 是否https接口
    //     // ws: true, // 是否代理websockets

    //     // 路径重写，**** 如果你的后端有统一前缀(如:/api)，就不开启；没有就开启
    //     //简单来说，就是是否改路径 加某些东西
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1500,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/')
            : [];
          const fileName =
            facadeModuleId[facadeModuleId.length - 2] || '[name]';
          return `js/${fileName}/[name].[hash].js`;
        }
      }
    }
  }
})

