import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            outDir: "dist/types",
            include: ['export.ts', 'src/**/*.ts', 'src/**/*.vue'],
            staticImport: true,
            rollupTypes: true
        }),
    ],
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: "import { h, Fragment } from 'vue';",
    },
    build: {
        lib: {
            entry: 'export.ts',
            name: 'ako',
            formats: ['es', 'umd'],
            fileName: (format) => `ako.${format}.js`,
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
        host: '0.0.0.0',
        port: 7777,
        proxy: {
            "/api": "http://localhost:17777/",
        }
    }
})
