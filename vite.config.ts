import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: "import { h, Fragment } from 'vue';",
    },
    build: {
        lib: {
            entry: 'src/ako.ts',
            name: 'ako',
            fileName: (format) => `ako.${format}.js`
        },
        rollupOptions: {
            external: ['vue', "element-plus", "@element-plus/icons-vue", "axios", "dayjs", 'element-plus/dist/index.css'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    server: {
        proxy: {
            "/api": "http://localhost:17777/",
        }
    }
})
