// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'

// Utilities
import {defineConfig} from 'vite'
import {fileURLToPath, URL} from 'node:url'

// ... URL ...

// const cloud_url = 'http://110.42.103.198:22440'
const buaa_url = 'http://172.27.250.68:8080'

// ... ...


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        Layouts(),
        Vue({
            template: {
                transformAssetUrls
            }
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true,
            styles: {
                configFile: 'src/styles/settings.scss',
            },
        }),
        Components(),
        Fonts({
            google: {
                families: [{
                    name: 'Roboto',
                    styles: 'wght@100;300;400;500;700;900',
                }],
            },
        }),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
            ],
            eslintrc: {
                enabled: true,
            },
            vueTemplate: true,
        }),
    ],
    define: {'process.env': {}},
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    server: {
        // -----------local debug use -----------
        // port: 8001,

        // ----------- Docker image use ----------

        // ---------------------------------------
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
        port: 9051,
        proxy: {
            // cross-origin configs
            '/v1': {
                target: buaa_url,
                changeOrigin: true,
                rewrite: (path) => {
                    return path.replace(/^\/v1/, '')
                }
            },
            '/generate-pdf': {
                target: buaa_url,
                changeOrigin: true,
                rewrite: (path) => {
                    return path.replace(/^\/generate-pdf/, '');
                },
            },
        }

    }
})
