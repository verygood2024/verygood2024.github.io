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

module.exports = {
    // Hexo生成目录
    globDirectory: publicDir,
    // 输出 Service Worker
    swDest: path.join(publicDir, 'service-worker.js'),
    // 只预缓存核心资源，图片、音频走runtime缓存
    globPatterns: [
        '**/*.{js,css,svg,eot,ttf,woff,woff2}'
    ],
    globIgnores: [
        'cache-version*.json',
        'service-worker.js',
        'workbox-*.js',
        'workbox-*.js.map'
    ],
    // 最大单文件缓存大小
    maximumFileSizeToCacheInBytes: 209715200,
    // 新SW立即接管
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,

    runtimeCaching: [
        // =========================
        // 版本检测文件，永远请求最新
        // =========================
        {
            urlPattern: /cache-version-prod\.json$/,
            handler: 'NetworkOnly'
        },

        // =========================
        // HTML页面，网络优先，GitHub失败使用缓存
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
                cacheName: `hexo-${CACHE_VERSION}-html`,
                networkTimeoutSeconds: 8,
                expiration: {
                    maxAgeSeconds: 7 * 24 * 60 * 60
                }
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
                cacheName: `hexo-${CACHE_VERSION}-static`,
                expiration: {
                    maxAgeSeconds: 180 * 24 * 60 * 60
                }
            }
        },

        // =========================
        // 图片，浏览后缓存
        // =========================
        {
            urlPattern: ({request}) => {
                return request.destination === 'image';
            },
            handler: 'CacheFirst',
            options: {
                cacheName: `hexo-${CACHE_VERSION}-images`,
                expiration: {
                    maxAgeSeconds: 365 * 24 * 60 * 60
                }
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
                cacheName: `hexo-${CACHE_VERSION}-fonts`,
                expiration: {
                    maxAgeSeconds: 365 * 24 * 60 * 60
                }
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
                cacheName: `hexo-${CACHE_VERSION}-audio`,
                expiration: {
                    maxAgeSeconds: 180 * 24 * 60 * 60
                }
            }
        },

        // =========================
        // 自建CDN
        // =========================
        {
            urlPattern: /^https:\/\/cdn\.yesandnoandperhaps\.cn\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: `hexo-${CACHE_VERSION}-cdn`,
                expiration: {
                    maxAgeSeconds: 365 * 24 * 60 * 60
                }
            }
        }
    ]
};