import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  ,
  server:{
    proxy:{
      '/api':{//获取路径中包含了/api的请求
          target:'http://localhost:8080',//后台服务所在的源
          changeOrigin:true,//修改源
          rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
      }
    }
  },

  build: {
    outDir: 'dist',

    rollupOptions: {

      output: {
/*         manualChunks(id) {
          // 根据需要自定义拆分文件的规则
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        dir: 'dist', // 输出到 dist 目录
        entryFileNames: '[name].js', // 入口文件名使用原始名称
        assetFileNames: 'assets/[name].[ext]', // 资源文件夹使用 assets 子目录
        chunkFileNames: 'chunks/[name].js', // 拆分的文件使用 chunks 子目录 */
      },
    },
  },

/*   configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  }, */
})


