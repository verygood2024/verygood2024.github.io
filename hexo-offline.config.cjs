const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const versionFile = path.join(publicDir, 'cache-version-prod.json');

let CACHE_VERSION = 'v2.7.1';

try {
    const data = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
    CACHE_VERSION = data.version || CACHE_VERSION;
} catch (e) {
    console.warn('[Workbox] 未找到版本文件，使用默认版本:', CACHE_VERSION);
}

// ===============================
// 只允许正常响应进入缓存
// 防止404/500等污染缓存
// ===============================
const validResponsePlugin = {
    cacheWillUpdate: async ({response}) => {
        if (response.status === 200 || response.status === 0) {
            return response;
        }
        console.warn('[SW] 跳过异常缓存:', response.status, response.url);
        return null;
    }
};

module.exports = {
    // Hexo生成目录
    globDirectory: publicDir,
    // 输出Service Worker
    swDest: path.join(publicDir, 'service-worker.js'),
    // 只预缓存核心文件，图片、音频运行时缓存
    globPatterns: [
        '**/*.{js,css,svg,eot,ttf,woff,woff2}'
    ],
    globIgnores: [
        'cache-version*.json',
        'service-worker.js',
        'workbox-*.js',
        'workbox-*.js.map',
        'version-prod.js',
        'version-preview.js',
        'app.js'
    ],
    maximumFileSizeToCacheInBytes: 209715200,
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,

    runtimeCaching: [
        // =========================
        // 版本文件
        // 永远获取最新
        // =========================
        {
            urlPattern: /cache-version-prod\.json$/,
            handler: 'NetworkOnly'
        },

        // =========================
        // HTML页面
        // =========================
        {
            urlPattern: ({request, url}) => {
                return (
                    request.mode === 'navigate' ||
                    url.pathname === '/' ||
                    url.pathname.endsWith('.html')
                );
            },
            handler: 'NetworkFirst',
            options: {
                cacheName: `hexo-html`,
                networkTimeoutSeconds: 10,
                expiration: {
                    maxAgeSeconds: 7 * 24 * 60 * 60
                },
                plugins: [
                    validResponsePlugin
                ]
            }
        },

        // =========================
        // JS CSS
        // =========================
        {
            urlPattern: ({request}) => {
                return (
                    request.destination === 'script' ||
                    request.destination === 'style'
                );
            },
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: `hexo-static`,
                expiration: {
                    maxAgeSeconds: 180 * 24 * 60 * 60
                },
                plugins: [
                    validResponsePlugin
                ]
            }
        },

        // =========================
        // 图片
        // =========================
        {
            urlPattern: ({request}) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
                cacheName: `hexo-images`,
                expiration: {
                    maxAgeSeconds: 365 * 24 * 60 * 60
                },
                plugins: [
                    validResponsePlugin
                ]
            }
        },

        // =========================
        // 字体
        // =========================
        {
            urlPattern: ({request}) => {
                return (
                    request.destination === 'font' ||
                    /\.(woff2?|ttf|eot)$/i.test(request.url)
                );
            },
            handler: 'CacheFirst',
            options: {
                cacheName: `hexo-fonts`,
                expiration: {
                    maxAgeSeconds: 365 * 24 * 60 * 60
                },
                plugins: [
                    validResponsePlugin
                ]
            }
        },

        // =========================
        // 音频
        // =========================
        {
            urlPattern: ({request}) => {
                return (
                    request.destination === 'audio' ||
                    /\.(mp3|wav|ogg)$/i.test(request.url)
                );
            },
            handler: 'CacheFirst',
            options: {
                cacheName: `hexo-audio`,
                expiration: {
                    maxAgeSeconds: 180 * 24 * 60 * 60
                },
                plugins: [
                    validResponsePlugin
                ]
            }
        },

        // =========================
        // 自建CDN
        // =========================
        {
            urlPattern: /^https:\/\/cdn\.yesandnoandperhaps\.cn\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: `hexo-cdn`,
                expiration: {
                    maxAgeSeconds: 365 * 24 * 60 * 60
                },
                plugins: [
                    validResponsePlugin
                ]
            }
        }
    ]
};